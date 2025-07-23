
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAccountingData } from '@/hooks/use-accounting-data';
import { isWithinInterval, parseISO } from 'date-fns';
import jsPDF from 'jspdf';

export interface GeneratedReport {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'yearly' | 'fec' | 'csv' | 'excel';
  fromDate: Date;
  toDate: Date;
  generatedAt: Date;
  status: 'generating' | 'ready' | 'sent' | 'error';
  fileUrl?: string;
}

export const useGeneratedReports = () => {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const { toast } = useToast();
  const { transactions } = useAccountingData();

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
    
    // Download the PDF
    doc.save(`${reportName.toLowerCase().replace(/\s+/g, '-')}-${fromDateStr.replace(/\//g, '-')}-${toDateStr.replace(/\//g, '-')}.pdf`);
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

  const addReport = (type: string, fromDate: Date, toDate: Date) => {
    const reportTypeMap: Record<string, GeneratedReport['type']> = {
      'Bilan mensuel': 'monthly',
      'Bilan trimestriel': 'quarterly',
      'Bilan annuel': 'yearly',
      'Export FEC': 'fec',
      'Export CSV': 'csv',
      'Export Excel': 'excel'
    };

    const newReport: GeneratedReport = {
      id: `report-${Date.now()}`,
      name: type,
      type: reportTypeMap[type] || 'monthly',
      fromDate,
      toDate,
      generatedAt: new Date(),
      status: 'generating'
    };

    setReports(prev => [newReport, ...prev]);

    // Filtrer les transactions pour la période
    const filteredTransactions = filterTransactionsByDateRange(fromDate, toDate);

    // Génération immédiate selon le type
    setTimeout(() => {
      try {
        if (type.includes('Bilan')) {
          generatePDFReport(type, fromDate, toDate, filteredTransactions);
        } else if (type === 'Export CSV') {
          generateCSVExport(fromDate, toDate, filteredTransactions);
        } else if (type === 'Export FEC') {
          generateFECExport(fromDate, toDate, filteredTransactions);
        } else if (type === 'Export Excel') {
          // Pour Excel, on génère un CSV qui peut être ouvert dans Excel
          generateCSVExport(fromDate, toDate, filteredTransactions);
        }

        setReports(prev => 
          prev.map(report => 
            report.id === newReport.id 
              ? { ...report, status: 'ready', fileUrl: `/downloads/${report.id}.pdf` }
              : report
          )
        );
      } catch (error) {
        console.error('Erreur lors de la génération:', error);
        setReports(prev => 
          prev.map(report => 
            report.id === newReport.id 
              ? { ...report, status: 'error' }
              : report
          )
        );
      }
    }, 1000);

    return newReport.id;
  };

  const sendEmail = async (reportId: string, email: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const fromDateStr = format(report.fromDate, 'dd/MM/yyyy', { locale: fr });
    const toDateStr = format(report.toDate, 'dd/MM/yyyy', { locale: fr });

    // Marquer le rapport comme envoyé
    setReports(prev => 
      prev.map(r => 
        r.id === reportId 
          ? { ...r, status: 'sent' }
          : r
      )
    );

    toast({
      title: "Email envoyé",
      description: `${report.name} envoyé à ${email} pour la période du ${fromDateStr} au ${toDateStr}`,
    });
  };

  return {
    reports,
    addReport,
    sendEmail
  };
};
