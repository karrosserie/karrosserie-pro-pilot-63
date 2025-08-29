
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAccountingData } from '@/hooks/use-accounting-data';
import { isWithinInterval, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

export interface GeneratedReport {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'yearly' | 'fec' | 'csv' | 'excel' | 'social' | 'pointages';
  fromDate: Date;
  toDate: Date;
  generatedAt: Date;
  fileUrl?: string;
}

export const useGeneratedReports = () => {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [companyName, setCompanyName] = useState<string>('');
  const { toast } = useToast();
  const { transactions } = useAccountingData();

  // Charger les rapports depuis la base de données
  useEffect(() => {
    const loadReportsFromDB = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userCompany } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (!userCompany?.company_id) {
        return;
      }

      const { data: reportsData, error: reportsError } = await supabase
        .from('generated_reports')
        .select('*')
        .eq('company_id', userCompany.company_id)
        .order('created_at', { ascending: false });

      if (!reportsError && reportsData) {
        const transformedReports = reportsData.map(report => ({
          id: report.id,
          name: report.name,
          type: report.type as GeneratedReport['type'],
          fromDate: new Date(report.from_date),
          toDate: new Date(report.to_date),
          generatedAt: new Date(report.generated_at),
          fileUrl: report.file_url
        }));
        setReports(transformedReports);
      }

      // Charger le nom de l'entreprise
      const { data: userCompanyData } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (userCompanyData) {
        const { data: companyData } = await supabase
          .from('company_info')
          .select('name')
          .eq('id', userCompanyData.company_id)
          .single();
        
        if (companyData) {
          setCompanyName(companyData.name);
        }
      }
    };

    loadReportsFromDB();
  }, []);

  const filterTransactionsByDateRange = (fromDate: Date, toDate: Date) => {
    return transactions.filter(transaction => {
      if (!transaction.date) return false;
      const transactionDate = parseISO(transaction.date.split('/').reverse().join('-'));
      return isWithinInterval(transactionDate, { start: fromDate, end: toDate });
    });
  };

  const generatePDFReport = (reportName: string, fromDate: Date, toDate: Date, filteredTransactions: any[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(20);
    doc.text(reportName, pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    const fromDateStr = format(fromDate, 'dd/MM/yyyy', { locale: fr });
    const toDateStr = format(toDate, 'dd/MM/yyyy', { locale: fr });
    doc.text(`Période: ${fromDateStr} - ${toDateStr}`, pageWidth / 2, 30, { align: 'center' });
    
    // Summary
    const receipts = filteredTransactions.filter(t => t.type === 'Encaissement' && t.status !== 'En attente');
    const expenses = filteredTransactions.filter(t => t.type === 'Dépense');
    const pending = filteredTransactions.filter(t => t.status === 'En attente');
    
    const totalReceipts = receipts.reduce((sum, t) => sum + parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.')), 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.')), 0);
    const totalPending = pending.reduce((sum, t) => sum + parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.')), 0);
    
    let yPos = 50;
    doc.setFontSize(14);
    doc.text('Résumé financier', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.text(`Encaissements: ${totalReceipts.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`, 20, yPos);
    yPos += 7;
    doc.text(`Dépenses: ${totalExpenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`, 20, yPos);
    yPos += 7;
    doc.text(`En attente: ${totalPending.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`, 20, yPos);
    yPos += 7;
    doc.text(`Solde: ${(totalReceipts - totalExpenses).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`, 20, yPos);
    
    // Détail des transactions
    yPos += 20;
    if (filteredTransactions.length > 0) {
      doc.setFontSize(14);
      doc.text('Détail des transactions', 20, yPos);
      yPos += 10;
      
      // En-têtes du tableau
      doc.setFontSize(8);
      doc.text('Date', 20, yPos);
      doc.text('Description', 45, yPos);
      doc.text('Type', 110, yPos);
      doc.text('Méthode', 135, yPos);
      doc.text('Montant', 165, yPos);
      doc.text('Statut', 185, yPos);
      yPos += 5;
      
      // Ligne de séparation
      doc.line(20, yPos, 200, yPos);
      yPos += 5;
      
      // Transactions
      filteredTransactions.forEach((transaction) => {
        if (yPos > 270) { // Nouvelle page si nécessaire
          doc.addPage();
          yPos = 20;
        }
        
        doc.text(transaction.date, 20, yPos);
        
        // Tronquer la description si trop longue
        const description = transaction.description.length > 25 ? 
          transaction.description.substring(0, 25) + '...' : 
          transaction.description;
        doc.text(description, 45, yPos);
        
        doc.text(transaction.type, 110, yPos);
        doc.text(transaction.method, 135, yPos);
        doc.text(transaction.amount, 165, yPos);
        doc.text(transaction.status || '-', 185, yPos);
        
        yPos += 5;
      });
    } else {
      doc.setFontSize(10);
      doc.text('Aucune transaction trouvée pour cette période.', 20, yPos);
    }
    
    // Download the PDF
    doc.save(`${reportName.toLowerCase().replace(/\s+/g, '-')}-${fromDateStr.replace(/\//g, '-')}-${toDateStr.replace(/\//g, '-')}.pdf`);
  };

  const generateSocialReport = async (reportName: string, fromDate: Date, toDate: Date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userCompany } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', user.id)
        .eq('active', true)
        .single();

      if (!userCompany?.company_id) return;

      const companyId = userCompany.company_id;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
    
      // Header
      doc.setFontSize(20);
      doc.text('BILAN SOCIAL', pageWidth / 2, 20, { align: 'center' });
      
      if (companyName) {
        doc.setFontSize(16);
        doc.text(companyName.toUpperCase(), pageWidth / 2, 35, { align: 'center' });
      }
      
      doc.setFontSize(12);
      const fromDateStr = format(fromDate, 'dd/MM/yyyy', { locale: fr });
      const toDateStr = format(toDate, 'dd/MM/yyyy', { locale: fr });
      doc.text(`Période: ${fromDateStr} - ${toDateStr}`, pageWidth / 2, 50, { align: 'center' });
      
      let yPosition = 70;
      const lineHeight = 8;
      
      // Récupération des données réelles
      const { data: employees } = await supabase
        .from('employees')
        .select(`
          *,
          employee_timesheets(*)
        `)
        .eq('company_id', companyId);
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*');
      
      const totalEmployees = employees?.length || 0;
      
      // 1. EMPLOI
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('1. EMPLOI', 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`• Effectif total : ${totalEmployees} salariés`, 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Répartition H/F : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Entrées dans l\'année : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Sorties dans l\'année : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Types de contrats : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Temps de travail : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight * 2;
      
      // 2. RÉMUNÉRATIONS
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('2. RÉMUNÉRATIONS', 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('• Masse salariale brute annuelle : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Salaire moyen brut mensuel : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Écart salarial H/F : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Primes et avantages : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight * 2;
      
      // 3. SANTÉ & SÉCURITÉ
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('3. SANTÉ & SÉCURITÉ', 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('• Accidents du travail : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Maladies professionnelles : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Jours d\'arrêt maladie cumulés : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Taux d\'absentéisme : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight * 2;
      
      // Vérifier si on a besoin d'une nouvelle page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      // 4. FORMATION
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('4. FORMATION', 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('• Budget formation : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Salariés formés : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Heures de formation : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Thèmes : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight * 2;
      
      // 5. CONDITIONS DE TRAVAIL
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('5. CONDITIONS DE TRAVAIL', 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('• Postes aménagés : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Télétravail : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Équipements de protection : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight * 2;
      
      // 6. RELATIONS SOCIALES
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('6. RELATIONS SOCIALES', 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('• CSE : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Réunions CSE tenues : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Accords collectifs signés : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight * 2;
      
      // 7. VIE DE L'ENTREPRISE
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('7. VIE DE L\'ENTREPRISE', 20, yPosition);
      yPosition += lineHeight * 1.5;
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('• Événements : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Actions RSE : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight;
      doc.text('• Turnover : Données en cours de collecte', 25, yPosition);
      yPosition += lineHeight * 3;
      
      // Footer
      doc.setFontSize(10);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, yPosition);
      
      // Télécharger le PDF
      doc.save(`bilan-social-${fromDateStr.replace(/\//g, '-')}-${toDateStr.replace(/\//g, '-')}.pdf`);
      
    } catch (error) {
      console.error('Erreur lors de la génération du bilan social:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le bilan social. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const generateCSVExport = (fromDate: Date, toDate: Date, filteredTransactions: any[]) => {
    const headers = ['Date', 'Description', 'Type', 'Méthode', 'Montant', 'Client', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date,
        `"${t.description}"`,
        t.type,
        t.method,
        t.amount.replace(/[€\s]/g, '').replace(',', '.'),
        `"${t.client}"`,
        t.status || ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fromDateStr = format(fromDate, 'dd-MM-yyyy', { locale: fr });
    const toDateStr = format(toDate, 'dd-MM-yyyy', { locale: fr });
    link.download = `export-comptable-${fromDateStr}-${toDateStr}.csv`;
    link.click();
  };

  const generateFECExport = (fromDate: Date, toDate: Date, filteredTransactions: any[]) => {
    // Format FEC simplifié
    const headers = ['JournalCode', 'JournalLib', 'EcritureNum', 'EcritureDate', 'CompteNum', 'CompteLib', 'CompAuxNum', 'CompAuxLib', 'PieceRef', 'PieceDate', 'EcritureLib', 'Debit', 'Credit'];
    const fecContent = [
      headers.join('\t'),
      ...filteredTransactions.map((t, index) => {
        const amount = parseFloat(t.amount.replace(/[€\s]/g, '').replace(',', '.'));
        const debit = t.type === 'Dépense' ? amount.toFixed(2) : '0.00';
        const credit = t.type === 'Encaissement' ? amount.toFixed(2) : '0.00';
        const date = t.date.split('/').reverse().join('');
        
        return [
          'VTE', // Journal des ventes
          'Journal des ventes',
          `${index + 1}`.padStart(6, '0'),
          date,
          t.type === 'Encaissement' ? '411000' : '607000',
          t.type === 'Encaissement' ? 'Clients' : 'Achats',
          '',
          '',
          `REF${index + 1}`,
          date,
          t.description.replace(/"/g, ''),
          debit,
          credit
        ].join('\t');
      })
    ].join('\n');
    
    const blob = new Blob([fecContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fromDateStr = format(fromDate, 'dd-MM-yyyy', { locale: fr });
    const toDateStr = format(toDate, 'dd-MM-yyyy', { locale: fr });
    link.download = `export-fec-${fromDateStr}-${toDateStr}.txt`;
    link.click();
  };

  const addReport = async (type: string, fromDate: Date, toDate: Date) => {
    const reportTypeMap: Record<string, GeneratedReport['type']> = {
      'Bilan mensuel': 'monthly',
      'Bilan trimestriel': 'quarterly',
      'Bilan annuel': 'yearly',
      'Bilan sociale': 'social',
      'Export FEC': 'fec',
      'Export CSV': 'csv',
      'Export Excel': 'excel',
      'Pointages FEC': 'pointages',
      'Pointages CSV': 'pointages'
    };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userCompany } = await supabase
      .from('user_companies')
      .select('company_id')
      .eq('user_id', user.id)
      .eq('active', true)
      .single();

    if (!userCompany?.company_id) {
      throw new Error('No active company found');
    }

    // Créer le rapport en base de données
    const { data: reportData, error: reportError } = await supabase
      .from('generated_reports')
      .insert({
        company_id: userCompany.company_id,
        name: type,
        type: reportTypeMap[type] || 'monthly',
        from_date: fromDate.toISOString().split('T')[0],
        to_date: toDate.toISOString().split('T')[0]
      })
      .select()
      .single();

    if (reportError || !reportData) {
      console.error('Erreur lors de la création du rapport:', reportError);
      return;
    }

    const newReport: GeneratedReport = {
      id: reportData.id,
      name: reportData.name,
      type: reportData.type as GeneratedReport['type'],
      fromDate: new Date(reportData.from_date),
      toDate: new Date(reportData.to_date),
      generatedAt: new Date(reportData.generated_at)
    };

    setReports(prev => [newReport, ...prev]);

    // Filtrer les transactions pour la période
    const filteredTransactions = filterTransactionsByDateRange(fromDate, toDate);

    // Génération immédiate selon le type
    setTimeout(async () => {
      try {
        if (type === 'Bilan sociale') {
          await generateSocialReport(type, fromDate, toDate);
        } else if (type.includes('Bilan')) {
          generatePDFReport(type, fromDate, toDate, filteredTransactions);
        } else if (type === 'Export CSV') {
          generateCSVExport(fromDate, toDate, filteredTransactions);
        } else if (type === 'Export FEC') {
          generateFECExport(fromDate, toDate, filteredTransactions);
        } else if (type === 'Export Excel') {
          // Pour Excel, on génère un CSV qui peut être ouvert dans Excel
          generateCSVExport(fromDate, toDate, filteredTransactions);
        }

        // Mettre à jour le fichier URL en base
        await supabase
          .from('generated_reports')
          .update({ 
            file_url: `/downloads/${reportData.id}.pdf`
          })
          .eq('id', reportData.id);

        setReports(prev => 
          prev.map(report => 
            report.id === reportData.id 
              ? { ...report, fileUrl: `/downloads/${reportData.id}.pdf` }
              : report
          )
        );
      } catch (error) {
        console.error('Erreur lors de la génération:', error);
        
        // En cas d'erreur, on supprime le rapport
        await supabase
          .from('generated_reports')
          .delete()
          .eq('id', reportData.id);

        setReports(prev => 
          prev.filter(report => report.id !== reportData.id)
        );
      }
    }, 1000);

    return reportData.id;
  };

  const sendEmail = async (reportId: string, email: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const fromDateStr = format(report.fromDate, 'dd/MM/yyyy', { locale: fr });
    const toDateStr = format(report.toDate, 'dd/MM/yyyy', { locale: fr });

    toast({
      title: "Email envoyé",
      description: `${report.name} envoyé à ${email} pour la période du ${fromDateStr} au ${toDateStr}`,
    });
  };

  const deleteReport = async (reportId: string) => {
    // Supprimer de la base de données
    await supabase
      .from('generated_reports')
      .delete()
      .eq('id', reportId);

    // Supprimer du state local
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const downloadReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const filteredTransactions = filterTransactionsByDateRange(report.fromDate, report.toDate);
    
    if (report.type === 'social') {
      generateSocialReport(report.name, report.fromDate, report.toDate);
    } else if (report.type === 'monthly' || report.type === 'quarterly' || report.type === 'yearly') {
      generatePDFReport(report.name, report.fromDate, report.toDate, filteredTransactions);
    } else if (report.type === 'csv') {
      generateCSVExport(report.fromDate, report.toDate, filteredTransactions);
    } else if (report.type === 'fec') {
      generateFECExport(report.fromDate, report.toDate, filteredTransactions);
    }
  };

  return {
    reports,
    companyName,
    addReport,
    sendEmail,
    deleteReport,
    downloadReport
  };
};
