import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUnpaidInvoices } from '@/hooks/use-unpaid-invoices';
import { 
  Scale, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  Eye,
  FileText,
  Phone,
  Mail,
  Calendar,
  Download,
  X,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PaymentRelancesProps {}

const PaymentRelances: React.FC<PaymentRelancesProps> = () => {
  const { formattedInvoices: realInvoices, loading } = useUnpaidInvoices();
  const [filter, setFilter] = useState<string>('all');
  const [drawerData, setDrawerData] = useState<any>(null);
  const [viewingContent, setViewingContent] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentView, setCurrentView] = useState<'relances' | 'campagnes'>('relances');
  const [isAutoMode, setIsAutoMode] = useState(true); // true = auto, false = semi auto
  
  // États pour les campagnes
  const [campaignStatus, setCampaignStatus] = useState({
    janvier2025: 'active',
    decembre2024: 'completed'
  });
  const [selectedTemplate, setSelectedTemplate] = useState('sms-relance-auto');
  const [viewingLog, setViewingLog] = useState<any>(null);
  const [viewingCampaignDetails, setViewingCampaignDetails] = useState<any>(null);
  const [viewingStatDetails, setViewingStatDetails] = useState<{type: string, data: any} | null>(null);

  // Force rebuild - données fictives pour la démonstration
  const mockInvoices = [
    {
      id: 'FAC-2024-001',
      uuid: 'uuid-001',
      client: 'SARL Dupont Transport',
      vehicle: 'Renault Master',
      vehicleRef: 'AB-123-CD',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '3 450,00 €',
      dueDate: '15/11/2024',
      lastRelanceDate: '20/12/2024',
      relanceType: 'Relance 2',
      relanceTypeColor: 'bg-orange-100 text-orange-800',
      status: 'relance2',
      availableActions: ['whatsapp', 'sms', 'mail'],
      history: [
        { 
          action: 'Relance email', 
          type: 'email',
          date: '20/12/2024', 
          time: '14:30',
          status: 'Envoyé',
          content: {
            subject: 'Rappel de paiement - Facture FAC-2024-001',
            body: `Madame, Monsieur,

Nous vous rappelons qu'une facture d'un montant de 3 450,00 € est arrivée à échéance le 15/11/2024.

Détails de la facture :
- Numéro : FAC-2024-001
- Véhicule : Renault Master (AB-123-CD)
- Montant : 3 450,00 €
- Date d'échéance : 15/11/2024

Nous vous serions reconnaissants de bien vouloir procéder au règlement dans les meilleurs délais.

Cordialement,
Garage Martin`
          }
        },
        { 
          action: 'Relance téléphonique', 
          type: 'phone',
          date: '22/12/2024', 
          time: '16:15',
          status: 'Conversation',
          content: {
            note: 'Appel effectué à 16h15. Contact établi avec M. Dupont. Il confirme avoir reçu la facture et s\'engage à effectuer le paiement avant la fin de semaine. Promesse de paiement obtenue pour le 27/12/2024.',
            duration: '3min 45s',
            outcome: 'Promesse de paiement - 27/12/2024'
          }
        },
        { 
          action: 'SMS de rappel', 
          type: 'sms',
          date: '25/12/2024', 
          time: '10:15',
          status: 'Lu',
          content: {
            message: 'GARAGE MARTIN: Facture FAC-2024-001 de 3450€ impayée depuis le 15/11. Merci de régulariser. Contact: 01.23.45.67.89'
          }
        }
      ],
      clientPhone: '06 12 34 56 78',
      clientEmail: 'contact@dupont-transport.fr',
      clientAddress: '15 rue de la République\n75001 Paris\nFrance',
      daysOverdue: 25,
      autoRelancesDisabled: false,
      clientId: 'client-001'
    },
    {
      id: 'FAC-2024-015',
      uuid: 'uuid-002', 
      client: 'Entreprise Leroy',
      vehicle: 'Peugeot Partner',
      vehicleRef: 'EF-456-GH',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '1 250,00 €',
      dueDate: '10/12/2024',
      lastRelanceDate: '15/01/2025',
      relanceType: 'Relance 1',
      relanceTypeColor: 'bg-blue-100 text-blue-800',
      status: 'relance1',
      availableActions: ['whatsapp', 'sms', 'vms', 'mail'],
      history: [
        { 
          action: 'Email automatique', 
          type: 'email',
          date: '15/01/2025', 
          time: '09:00',
          status: 'Envoyé',
          content: {
            subject: 'Facture en retard - FAC-2024-015',
            body: `Bonjour,

Nous constatons qu'une facture reste impayée à ce jour.

Référence : FAC-2024-015
Véhicule : Peugeot Partner (EF-456-GH)
Montant : 1 250,00 €
Échéance dépassée depuis : 12 jours

Merci de procéder au règlement rapidement.

Garage Martin`
          }
        },
        { 
          action: 'Relance téléphonique', 
          type: 'phone',
          date: '18/01/2025', 
          time: '11:30',
          status: 'Répondeur',
          content: {
            note: 'Appel effectué à 11h30. Pas de réponse, message laissé sur répondeur : "Bonjour, Jean Martin du Garage Martin. Je vous appelle concernant votre facture FAC-2024-015 d\'un montant de 1250€ qui est en retard depuis 15 jours. Merci de me rappeler au 01.23.45.67.89 pour régulariser la situation."',
            duration: '1min 15s',
            outcome: 'Message laissé sur répondeur'
          }
        }
      ],
      clientPhone: '06 98 76 54 32',
      clientEmail: 'leroy.entreprise@gmail.com',
      clientAddress: '28 avenue des Tilleuls\n69003 Lyon\nFrance',
      daysOverdue: 12,
      autoRelancesDisabled: false,
      clientId: 'client-002'
    },
    {
      id: 'FAC-2024-032',
      uuid: 'uuid-003',
      client: 'SAS Moreau & Fils',
      vehicle: 'Citroën Berlingo',
      vehicleRef: 'IJ-789-KL',
      garage: 'Garage Martin',
      garageRef: '12345678901234',
      amount: '5 680,00 €',
      dueDate: '01/10/2024',
      lastRelanceDate: '15/01/2025',
      relanceType: 'Contentieux',
      relanceTypeColor: 'bg-red-100 text-red-800',
      status: 'contentieux',
      availableActions: ['recommande', 'judiciaire'],
      history: [
        { 
          action: 'Relance email', 
          type: 'email',
          date: '05/11/2024', 
          time: '16:45',
          status: 'Envoyé',
          content: {
            subject: 'Première relance - Facture FAC-2024-032',
            body: 'Madame, Monsieur,\n\nVotre facture d\'un montant de 5 680,00 € est échue depuis le 01/10/2024...'
          }
        },
        { 
          action: 'SMS de rappel', 
          type: 'sms',
          date: '20/11/2024', 
          time: '11:30',
          status: 'Lu',
          content: {
            message: 'URGENT: Facture FAC-2024-032 de 5680€ impayée depuis 50 jours. Contactez-nous: 01.23.45.67.89'
          }
        },
        { 
          action: 'Relance téléphonique', 
          type: 'phone',
          date: '05/12/2024', 
          time: '14:20',
          status: 'Répondeur',
          content: {
            note: 'Appel effectué à 14h20. Messagerie vocale laissée: "Bonjour, Garage Martin au sujet de votre facture impayée FAC-2024-032 de 5680€. Merci de nous rappeler au 01.23.45.67.89"',
            duration: '1min 30s'
          }
        },
        { 
          action: 'Mise en demeure', 
          type: 'registered',
          date: '20/12/2024', 
          time: '08:00',
          status: 'Reçu',
          content: {
            subject: 'MISE EN DEMEURE - Facture FAC-2024-032',
            body: 'Par la présente, nous vous mettons en demeure de procéder au règlement de la facture...'
          }
        },
        { 
          action: 'Dépôt dossier tribunal', 
          type: 'legal',
          date: '15/01/2025', 
          time: '09:30',
          status: 'En cours',
          content: {
            note: 'Dossier déposé au tribunal de commerce. Référence tribunal: TC-2025-00142',
            amount: '5 680,00 € + frais de procédure'
          }
        }
      ],
      clientPhone: '04 78 12 34 56',
      clientEmail: 'contact@moreau-fils.fr',
      clientAddress: '142 route de Grenoble\n38000 Grenoble\nFrance',
      daysOverdue: 95,
      autoRelancesDisabled: false,
      clientId: 'client-003'
    }
  ];

  // Utiliser les données fictives au lieu des vraies données
  const formattedInvoices = mockInvoices;

  // Filter invoices based on selected status
  const filteredInvoices = formattedInvoices.filter(invoice => {
    if (filter === 'all') return true;
    if (filter === 'relance') return ['relance1', 'relance2', 'relance3'].includes(invoice.status);
    if (filter === 'demeure') return invoice.status === 'relance4';
    if (filter === 'contentieux') return invoice.status === 'contentieux';
    return invoice.status === filter;
  });

  // Calculate stats
  const stats = {
    enRelance: formattedInvoices.filter(i => ['relance1', 'relance2', 'relance3'].includes(i.status)).length,
    procedureJudiciaire: formattedInvoices.filter(i => ['relance4', 'contentieux'].includes(i.status)).length,
    recupererCeMois: '28 450€', // TODO: Calculate actual recovered amount
    totalImpayes: formattedInvoices.reduce((sum, invoice) => {
      const amount = parseFloat(invoice.amount.replace(' €', '').replace(',', '.'));
      return sum + amount;
    }, 0).toLocaleString('fr-FR') + ' €'
  };

  const showDetails = (invoice: any) => {
    setDrawerData(invoice);
  };

  const closeDrawer = () => {
    setDrawerData(null);
    setViewingContent(null);
  };

  const viewContent = (content: any, type: string) => {
    setViewingContent({ content, type });
  };

  // Update current time every second for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate countdown for next action
  const getNextActionCountdown = (invoice: any) => {
    const lastSmsAction = invoice.history
      .filter((action: any) => action.type === 'sms')
      .sort((a: any, b: any) => new Date(b.date + ' ' + (b.time || '00:00')).getTime() - new Date(a.date + ' ' + (a.time || '00:00')).getTime())[0];
    
    if (!lastSmsAction) return null;

    // Parse date properly (DD/MM/YYYY format)
    const [day, month, year] = lastSmsAction.date.split('/');
    const smsDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    // Add time if available
    if (lastSmsAction.time) {
      const [hours, minutes] = lastSmsAction.time.split(':');
      smsDate.setHours(parseInt(hours), parseInt(minutes));
    }
    
    const miseEnDemeureDate = new Date(smsDate.getTime() + (8 * 24 * 60 * 60 * 1000)); // 8 jours après
    const tribunalDate = new Date(miseEnDemeureDate.getTime() + (10 * 24 * 60 * 60 * 1000)); // 10 jours après mise en demeure
    
    const now = currentTime.getTime();
    const miseEnDemeureTime = miseEnDemeureDate.getTime();
    const tribunalTime = tribunalDate.getTime();

    // Check if mise en demeure already sent
    const miseEnDemeureExists = invoice.history.some((action: any) => 
      action.type === 'registered' || action.action.toLowerCase().includes('mise en demeure')
    );

    if (miseEnDemeureExists) {
      // Compte à rebours pour tribunal
      if (now < tribunalTime) {
        const timeLeft = tribunalTime - now;
        const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
        
        return {
          type: 'tribunal',
          action: 'Générer dossier tribunal',
          timeLeft: { days, hours, minutes, seconds },
          isActive: true,
          deadline: tribunalDate.toLocaleDateString('fr-FR')
        };
      } else {
        return {
          type: 'tribunal_expired',
          action: 'Générer dossier tribunal',
          timeLeft: null,
          isActive: false,
          deadline: tribunalDate.toLocaleDateString('fr-FR')
        };
      }
    } else {
      // Compte à rebours pour mise en demeure
      if (now < miseEnDemeureTime) {
        const timeLeft = miseEnDemeureTime - now;
        const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
        
        return {
          type: 'miseEnDemeure',
          action: 'Envoyer mise en demeure',
          timeLeft: { days, hours, minutes, seconds },
          isActive: true,
          deadline: miseEnDemeureDate.toLocaleDateString('fr-FR')
        };
      } else {
        return {
          type: 'miseEnDemeure_expired',
          action: 'Envoyer mise en demeure',
          timeLeft: null,
          isActive: false,
          deadline: miseEnDemeureDate.toLocaleDateString('fr-FR')
        };
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'relance1': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'relance2': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'relance3': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'relance4': return 'bg-red-100 text-red-800 border-red-200';
      case 'contentieux': return 'bg-red-600 text-white border-red-600';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'relance1': return 'Relance 1';
      case 'relance2': return 'Relance 2';
      case 'relance3': return 'Relance 3';
      case 'relance4': return 'Relance 4';
      case 'contentieux': return 'Contentieux';
      default: return 'Non défini';
    }
  };

  // Fonctions pour les campagnes
  const handleCampaignAction = (campaign: string, action: string) => {
    if (campaign === 'janvier2025') {
      if (action === 'stop') {
        setCampaignStatus(prev => ({ ...prev, janvier2025: 'stopped' }));
      } else if (action === 'restart') {
        setCampaignStatus(prev => ({ ...prev, janvier2025: 'active' }));
      }
    } else if (campaign === 'decembre2024') {
      if (action === 'program') {
        setCampaignStatus(prev => ({ ...prev, decembre2024: 'programmed' }));
      }
    }
  };

  const handleTemplateAction = (templateId: string, action: string) => {
    if (action === 'select') {
      setSelectedTemplate(templateId);
    } else if (action === 'modify') {
      // Simuler l'ouverture d'un éditeur de template
      console.log(`Modification du template: ${templateId}`);
    } else if (action === 'configure') {
      // Simuler l'ouverture des paramètres
      console.log(`Configuration du template: ${templateId}`);
    }
  };

  const viewLogDetails = (log: any) => {
    setViewingLog(log);
  };

  const closeLogViewer = () => {
    setViewingLog(null);
  };

  const viewCampaignDetails = (campaign: string) => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      .toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

    const campaignData = {
      janvier2025: {
        id: 'janvier2025',
        name: `Relance ${currentMonth}`, // Mois en cours
        description: `Relances en cours - Dernière automatique le ${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`,
        status: campaignStatus.janvier2025,
        stats: { total: 8, envoyes: 4, ouverts: 2, enAttente: 4 }, // Stats du mois en cours
        clients: [
          { name: 'SARL Dupont Transport', facture: 'FAC-2025-001', montant: '3 450,00 €', statut: 'SMS envoyé', dateEnvoi: '15/01/2025', ouvert: true, type: 'actuel' },
          { name: 'Entreprise Leroy', facture: 'FAC-2025-003', montant: '1 250,00 €', statut: 'Email envoyé', dateEnvoi: '16/01/2025', ouvert: false, type: 'actuel' },  
          { name: 'EURL Rousseau Plomberie', facture: 'FAC-2025-005', montant: '890,50 €', statut: 'SMS envoyé', dateEnvoi: '17/01/2025', ouvert: true, type: 'actuel' },
          { name: 'Mme Catherine Bernard', facture: 'FAC-2025-007', montant: '2 150,00 €', statut: 'Email envoyé', dateEnvoi: '18/01/2025', ouvert: false, type: 'actuel' },
          { name: 'M. Pierre Dubois', facture: 'FAC-2025-009', montant: '650,00 €', statut: 'SMS programmé', dateEnvoi: 'Aujourd\'hui 14h30', ouvert: false, type: 'programme' },
          { name: 'SARL Petit Électricité', facture: 'FAC-2025-011', montant: '1 890,00 €', statut: 'Email programmé', dateEnvoi: 'Demain 9h00', ouvert: false, type: 'programme' },
          { name: 'SCI Lambert Immobilier', facture: 'FAC-2025-013', montant: '4 320,00 €', statut: 'SMS programmé', dateEnvoi: 'Demain 15h00', ouvert: false, type: 'programme' },
          { name: 'SAS Moreau & Fils', facture: 'FAC-2025-015', montant: '5 680,00 €', statut: 'Email programmé', dateEnvoi: 'Demain 10h30', ouvert: false, type: 'programme' }
        ]
      },
      decembre2024: {
        id: 'decembre2024', 
        name: `Relance ${previousMonth}`, // Mois précédent
        description: `Campagne clôturée le 31/${previousMonth.split(' ')[0] === 'décembre' ? '12' : '11'}/2024`,
        status: campaignStatus.decembre2024,
        stats: { total: 34, payes: 5, enLitige: 3, recupere: '18 450€' }, // Stats finales du mois précédent
        clients: [
          { name: 'Garage Renault Lyon', facture: 'FAC-2024-198', montant: '2 450,00 €', statut: 'Payé', datePaiement: '28/12/2024', recouvre: true, type: 'recouvre' },
          { name: 'Taxi Marseille SARL', facture: 'FAC-2024-201', montant: '1 890,00 €', statut: 'Payé', datePaiement: '30/12/2024', recouvre: true, type: 'recouvre' },
          { name: 'Transport Bordeaux', facture: 'FAC-2024-189', montant: '3 200,00 €', statut: 'En contentieux', dateContentieux: '20/12/2024', recouvre: false, type: 'litige' },
          { name: 'Flotte Auto Paris', facture: 'FAC-2024-203', montant: '5 400,00 €', statut: 'Payé', datePaiement: '29/12/2024', recouvre: true, type: 'recouvre' },
          { name: 'EURL Transport Sud', facture: 'FAC-2024-156', montant: '1 200,00 €', statut: 'En contentieux', dateContentieux: '22/12/2024', recouvre: false, type: 'litige' },
          { name: 'SAS Logistique Nord', facture: 'FAC-2024-134', montant: '2 800,00 €', statut: 'Payé', datePaiement: '27/12/2024', recouvre: true, type: 'recouvre' },
          { name: 'Ambulances Urgences', facture: 'FAC-2024-167', montant: '950,00 €', statut: 'En contentieux', dateContentieux: '25/12/2024', recouvre: false, type: 'litige' },
          { name: 'Société Maintenance', facture: 'FAC-2024-178', montant: '1 650,00 €', statut: 'Payé', datePaiement: '31/12/2024', recouvre: true, type: 'recouvre' }
        ]
      }
    };
    
    setViewingCampaignDetails(campaignData[campaign]);
  };

  const closeCampaignDetails = () => {
    setViewingCampaignDetails(null);
  };

  const viewStatDetails = (type: string) => {
    const statData = {
      enRelance: {
        title: 'Factures en relance',
        description: 'Factures avec au moins une relance envoyée',
        count: stats.enRelance,
        items: formattedInvoices
          .filter(i => ['relance1', 'relance2', 'relance3'].includes(i.status))
          .map(invoice => ({
            id: invoice.id,
            client: invoice.client,
            montant: invoice.amount,
            statut: getStatusText(invoice.status),
            statutColor: getStatusColor(invoice.status),
            retard: `${invoice.daysOverdue} jours`,
            derniereAction: invoice.history[invoice.history.length - 1]?.action || 'Aucune action',
            dateAction: invoice.history[invoice.history.length - 1]?.date || 'N/A'
          }))
      },
      procedureJudiciaire: {
        title: 'Procédures judiciaires',
        description: 'Factures en contentieux ou procédure tribunal',
        count: stats.procedureJudiciaire,
        items: formattedInvoices
          .filter(i => ['relance4', 'contentieux'].includes(i.status))
          .map(invoice => ({
            id: invoice.id,
            client: invoice.client,
            montant: invoice.amount,
            statut: getStatusText(invoice.status),
            statutColor: getStatusColor(invoice.status),
            retard: `${invoice.daysOverdue} jours`,
            derniereAction: invoice.history[invoice.history.length - 1]?.action || 'Aucune action',
            dateAction: invoice.history[invoice.history.length - 1]?.date || 'N/A'
          }))
      }
    };

    setViewingStatDetails({ type, data: statData[type] });
  };

  const closeStatDetails = () => {
    setViewingStatDetails(null);
  };

  const getOverdueColor = (days: number) => {
    if (days > 90) return 'text-red-600 font-bold';
    if (days > 60) return 'text-orange-500 font-medium';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Scale className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Module Juridique - Recouvrement
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Gérez vos impayés et procédures judiciaires en toute simplicité
              </p>
            </div>
          </div>
          
          {/* Auto/Semi Auto Toggle */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="auto-mode" className="text-sm font-medium">
              Semi Auto
            </Label>
            <Switch
              id="auto-mode"
              checked={isAutoMode}
              onCheckedChange={setIsAutoMode}
            />
            <Label htmlFor="auto-mode" className="text-sm font-medium">
              Auto
            </Label>
          </div>
        </div>
        
        {/* View Toggle Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={currentView === 'relances' ? 'default' : 'outline'}
            onClick={() => setCurrentView('relances')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Tableau de bord
          </Button>
          <Button
            variant={currentView === 'campagnes' ? 'default' : 'outline'}
            onClick={() => setCurrentView('campagnes')}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Phase de relance
          </Button>
        </div>
      </div>

      {currentView === 'relances' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card 
              className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => viewStatDetails('enRelance')}
            >
              <CardContent className="p-4">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.enRelance}</div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  EN RELANCE
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => viewStatDetails('procedureJudiciaire')}
            >
              <CardContent className="p-4">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.procedureJudiciaire}</div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  PROCÉDURE JUDICIAIRE
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="text-xl sm:text-2xl font-bold text-foreground">{stats.recupererCeMois}</div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  RÉCUPÉRÉ CE MOIS
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalImpayes}</div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  TOTAL IMPAYÉS
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Relance Mois en cours */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-lg font-bold text-green-800">
                  Relance janvier 2025
                </CardTitle>
                <p className="text-sm text-green-700">Relances en cours - Dernière automatique envoyée aujourd'hui</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">8</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">4</div>
                    <div className="text-xs text-muted-foreground">Envoyés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">4</div>
                    <div className="text-xs text-muted-foreground">Programmés</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className={campaignStatus.janvier2025 === 'active' ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
                    onClick={() => handleCampaignAction('janvier2025', campaignStatus.janvier2025 === 'active' ? 'stop' : 'restart')}
                  >
                    {campaignStatus.janvier2025 === 'active' ? 'Envoi actif' : campaignStatus.janvier2025 === 'stopped' ? 'Suspendue' : 'Reprogrammée'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCampaignAction('janvier2025', campaignStatus.janvier2025 === 'active' ? 'stop' : 'restart')}
                  >
                    {campaignStatus.janvier2025 === 'active' ? 'Suspendre' : 'Réactiver'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => viewCampaignDetails('janvier2025')}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Détails
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Relance Mois précédent */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-lg font-bold text-blue-800">
                  Relance décembre 2024
                </CardTitle>
                <p className="text-sm text-blue-700">Campagne clôturée le 31 décembre 2024 - Résultats finalisés</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">34</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">5</div>
                    <div className="text-xs text-muted-foreground">Recouvrés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-xs text-muted-foreground">En litige</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`text-blue-600 border-blue-300 ${campaignStatus.decembre2024 === 'programmed' ? 'bg-blue-50' : ''}`}
                  >
                    {campaignStatus.decembre2024 === 'programmed' ? 'Reprogrammée' : 'Clôturée'}
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleCampaignAction('decembre2024', 'program')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {campaignStatus.decembre2024 === 'programmed' ? 'Programmer à nouveau' : 'Nouvelle relance'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => viewCampaignDetails('decembre2024')}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Table */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle className="text-xl font-semibold">Factures impayées</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={filter === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="text-xs sm:text-sm"
                  >
                    Toutes
                  </Button>
                  <Button 
                    variant={filter === 'relance1' || filter === 'relance2' || filter === 'relance3' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('relance')}
                    className="text-xs sm:text-sm"
                  >
                    Relance
                  </Button>
                  <Button 
                    variant={filter === 'demeure' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('demeure')}
                    className="text-xs sm:text-sm"
                  >
                    Mise en demeure
                  </Button>
                  <Button 
                    variant={filter === 'contentieux' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('contentieux')}
                    className="text-xs sm:text-sm"
                  >
                    Judiciaire
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Facture</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Retard</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.uuid} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-foreground">{invoice.client}</div>
                          <div className="text-sm text-muted-foreground">{invoice.vehicle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{invoice.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">{invoice.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={getOverdueColor(invoice.daysOverdue)}>
                            {invoice.daysOverdue} jours
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className={getStatusColor(invoice.status)}>
                            {getStatusText(invoice.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => showDetails(invoice)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Détails
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4 p-4">
                {filteredInvoices.map((invoice) => (
                  <Card key={invoice.uuid} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="font-semibold text-foreground text-sm">{invoice.client}</div>
                          <div className="text-xs text-muted-foreground">{invoice.vehicle}</div>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(invoice.status)} text-xs`}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div>
                          <span className="text-muted-foreground">Facture:</span>
                          <div className="font-medium">{invoice.id}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Montant:</span>
                          <div className="font-semibold">{invoice.amount}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Retard:</span>
                          <div className={getOverdueColor(invoice.daysOverdue)}>{invoice.daysOverdue} jours</div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => showDetails(invoice)}
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredInvoices.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium mb-2">Aucune facture impayée</p>
                  <p className="text-sm">Aucune facture ne correspond aux critères sélectionnés.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        /* Phase de Relance View */
        <>
          {/* Tunnel de conversion */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Tunnel de conversion
            </h3>
            
            {/* Desktop & Tablet - Horizontal flow */}
            <div className="hidden sm:flex items-center gap-1 lg:gap-2 xl:gap-3 w-full overflow-x-auto pb-2">
              {/* Factures impayées */}
              <div className="flex-1 relative min-w-0">
                <div className="bg-white text-black border-3 border-blue-500 rounded-xl px-3 lg:px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="text-xs opacity-70 truncate">Factures impayées</div>
                  <div className="text-xl lg:text-2xl font-bold">45</div>
                </div>
                <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 text-blue-400">
                  <svg width="6" height="12" viewBox="0 0 6 12" fill="currentColor" className="lg:w-2 lg:h-4">
                    <path d="M0 0L6 6L0 12V0Z"/>
                  </svg>
                </div>
              </div>

              {/* Relances automatiques */}
              <div className="flex-1 relative min-w-0 ml-0.5">
                <div className="bg-white text-black border-3 border-orange-500 rounded-xl px-3 lg:px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="text-xs opacity-70 truncate">Relances auto</div>
                  <div className="text-xl lg:text-2xl font-bold">38</div>
                </div>
                <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 text-orange-400">
                  <svg width="6" height="12" viewBox="0 0 6 12" fill="currentColor" className="lg:w-2 lg:h-4">
                    <path d="M0 0L6 6L0 12V0Z"/>
                  </svg>
                </div>
              </div>

              {/* Mises en demeure */}
              <div className="flex-1 relative min-w-0 ml-0.5">
                <div className="bg-white text-black border-3 border-red-500 rounded-xl px-3 lg:px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="text-xs opacity-70 truncate">Mises demeure</div>
                  <div className="text-xl lg:text-2xl font-bold">15</div>
                </div>
                <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 text-red-400">
                  <svg width="6" height="12" viewBox="0 0 6 12" fill="currentColor" className="lg:w-2 lg:h-4">
                    <path d="M0 0L6 6L0 12V0Z"/>
                  </svg>
                </div>
              </div>

              {/* Procédures judiciaires */}
              <div className="flex-1 relative min-w-0 ml-0.5">
                <div className="bg-white text-black border-3 border-purple-500 rounded-xl px-3 lg:px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="text-xs opacity-70 truncate">Judiciaires</div>
                  <div className="text-xl lg:text-2xl font-bold">8</div>
                </div>
                <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 text-purple-400">
                  <svg width="6" height="12" viewBox="0 0 6 12" fill="currentColor" className="lg:w-2 lg:h-4">
                    <path d="M0 0L6 6L0 12V0Z"/>
                  </svg>
                </div>
              </div>

              {/* Montants récupérés */}
              <div className="flex-1 min-w-0 ml-0.5">
                <div className="bg-white text-black border-3 border-green-500 rounded-xl px-3 lg:px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <div className="text-xs opacity-70 truncate">Récupérés</div>
                  <div className="text-xl lg:text-2xl font-bold">78%</div>
                </div>
              </div>
            </div>

            {/* Mobile - Vertical stack */}
            <div className="sm:hidden space-y-3">
              <div className="bg-white text-black border-3 border-blue-500 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-center">
                  <div className="text-sm opacity-70">Factures impayées</div>
                  <div className="text-2xl font-bold">45</div>
                </div>
              </div>
              
              <div className="bg-white text-black border-3 border-orange-500 rounded-xl p-4 shadow-lg mx-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm opacity-70">Relances automatiques</div>
                  <div className="text-2xl font-bold">38</div>
                </div>
              </div>
              
              <div className="bg-white text-black border-3 border-red-500 rounded-xl p-4 shadow-lg mx-8">
                <div className="flex justify-between items-center">
                  <div className="text-sm opacity-70">Mises en demeure</div>
                  <div className="text-2xl font-bold">15</div>
                </div>
              </div>
              
              <div className="bg-white text-black border-3 border-purple-500 rounded-xl p-4 shadow-lg mx-12">
                <div className="flex justify-between items-center">
                  <div className="text-sm opacity-70">Procédures judiciaires</div>
                  <div className="text-2xl font-bold">8</div>
                </div>
              </div>
              
              <div className="bg-white text-black border-3 border-green-500 rounded-xl p-4 shadow-lg mx-16">
                <div className="flex justify-between items-center">
                  <div className="text-sm opacity-70">Montants récupérés</div>
                  <div className="text-2xl font-bold">78%</div>
                </div>
              </div>
            </div>
            
            {/* Indicateurs de performance */}
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-muted-foreground mt-4 gap-2 sm:gap-0 px-1">
              <div className="flex gap-4">
                <span>Taux conversion: <span className="font-semibold text-green-600">84%</span></span>
                <span>Temps moyen: <span className="font-semibold">45j</span></span>
              </div>
              <div className="text-right">
                <span>Dernière MàJ: <span className="font-semibold">il y a 2min</span></span>
              </div>
            </div>
          </div>

          {/* Journal d'Activité */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Journal d'Activité Temps Réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "09/01/2025 17:02", client: "SAS Moreau", action: "Mise en demeure", status: "Envoyé", type: "success", details: "Mise en demeure envoyée par courrier recommandé. Accusé de réception en attente.", invoiceAmount: "5680€", dueDate: "01/10/2024", importance: "critical" },
                  { time: "09/01/2025 16:58", client: "EURL Rousseau", action: "Email amiable", status: "Erreur", type: "error", details: "Adresse email invalide. Tentative d'envoi échouée. Vérifier les coordonnées client.", invoiceAmount: "890€", dueDate: "15/12/2024", importance: "critical" },
                  { time: "09/01/2025 16:45", client: "M. Pierre Dubois", action: "SMS message", status: "Lu", type: "info", details: "SMS de relance lu à 16h52. Taux de lecture: 100%. Aucune réponse reçue.", invoiceAmount: "650€", dueDate: "20/12/2024", importance: "medium" },
                  { time: "09/01/2025 16:12", client: "SAS Moreau", action: "Email amiable", status: "Lu", type: "info", details: "Email ouvert à 16h18. Lien de paiement cliqué mais transaction non finalisée.", invoiceAmount: "5680€", dueDate: "01/10/2024", importance: "critical" },
                  { time: "09/01/2025 15:38", client: "SARL Petit Électricité", action: "SMS message", status: "Réception interrompue", type: "warning", details: "SMS partiellement délivré. Opérateur mobile a signalé une interruption de service.", invoiceAmount: "1890€", dueDate: "10/12/2024", importance: "medium" },
                  { time: "09/01/2025 15:12", client: "SAS Moreau", action: "SMS message", status: "Envoyé", type: "success", details: "SMS de première relance envoyé avec succès. Coût: 0,08€", invoiceAmount: "5680€", dueDate: "01/10/2024", importance: "critical" },
                  { time: "09/01/2025 14:45", client: "SARL Dupont", action: "SMS message", status: "Envoyé", type: "success", details: "SMS automatique de rappel d'échéance. Facture FAC-2024-001 - 3450€", invoiceAmount: "3450€", dueDate: "15/11/2024", importance: "medium" },
                  { time: "09/01/2025 14:23", client: "Entreprise Leroy", action: "LTR message", status: "Envoyé", type: "success", details: "Lettre recommandée avec AR expédiée. Suivi: RR123456789FR", invoiceAmount: "1250€", dueDate: "10/12/2024", importance: "medium" },
                  { time: "09/01/2025 13:56", client: "SARL Petit Électricité", action: "SMS message", status: "Envoyé", type: "success", details: "SMS de relance 2. Message personnalisé avec historique des impayés.", invoiceAmount: "1890€", dueDate: "10/12/2024", importance: "medium" },
                  { time: "09/01/2025 13:12", client: "SARL Dupont", action: "LTR message", status: "Envoyé", type: "success", details: "Courrier simple de première relance. Coût d'affranchissement: 1,16€", invoiceAmount: "3450€", dueDate: "15/11/2024", importance: "low" }
                ].sort((a, b) => {
                  // Tri par importance : critical > medium > low
                  const importanceOrder = { 'critical': 3, 'medium': 2, 'low': 1 };
                  return importanceOrder[b.importance] - importanceOrder[a.importance];
                }).map((log, index) => {
                  // Calculer le retard en jours depuis la date d'échéance
                  const today = new Date('2025-01-09');
                  const [day, month, year] = log.dueDate.split('/');
                  const dueDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                  const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
                  
                  // Déterminer le niveau d'urgence basé sur le retard
                  const getUrgencyLevel = (days) => {
                    if (days >= 90) return 'critical'; // Rouge pastel
                    if (days >= 60) return 'high';     // Orange pastel
                    if (days >= 30) return 'medium';   // Jaune pastel
                    if (days > 0) return 'low';        // Bleu pastel
                    return 'none';                     // Vert pastel
                  };
                  
                  const urgency = getUrgencyLevel(daysOverdue);
                  
                  // Couleurs selon l'importance (rouge, jaune, bleu)
                  const getImportanceStyles = (importance) => {
                    switch (importance) {
                      case 'critical': return 'bg-red-50 border-l-4 border-red-400 hover:bg-red-100';
                      case 'medium': return 'bg-yellow-50 border-l-4 border-yellow-400 hover:bg-yellow-100';
                      case 'low': return 'bg-blue-50 border-l-4 border-blue-400 hover:bg-blue-100';
                      default: return 'bg-gray-50 border-l-4 border-gray-300 hover:bg-gray-100';
                    }
                  };
                  
                  const getImportanceBadgeColor = (importance, type) => {
                    if (type === 'error') return 'bg-red-100 text-red-700 border-red-200';
                    if (type === 'warning') return 'bg-amber-100 text-amber-700 border-amber-200';
                    
                    switch (importance) {
                      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
                      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
                      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
                      default: return 'bg-gray-100 text-gray-700 border-gray-200';
                    }
                  };
                  
                  const getRetardText = (days) => {
                    if (days === 0) return 'À jour';
                    if (days === 1) return '1 jour de retard';
                    return `${days} jours de retard`;
                  };
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg transition-all duration-200 ${getImportanceStyles(log.importance)}`}>
                      {/* Header avec temps et urgence */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground font-mono bg-white/50 px-2 py-1 rounded">
                            {log.time}
                          </span>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              daysOverdue === 0 ? 'text-green-600' : 
                              daysOverdue <= 30 ? 'text-blue-600' : 
                              daysOverdue <= 60 ? 'text-yellow-600' : 
                              daysOverdue <= 90 ? 'text-orange-600' : 'text-red-600'
                            }`}>
                              {getRetardText(daysOverdue)}
                            </span>
                          </div>
                        </div>
                        
                        <Badge 
                          className={`text-xs border ${getImportanceBadgeColor(log.importance, log.type)}`}
                        >
                          {log.status}
                        </Badge>
                      </div>
                      
                      {/* Content principal */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-foreground">{log.client}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{log.action}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Montant: <span className="font-semibold text-foreground">{log.invoiceAmount}</span></span>
                            <span>Échéance: <span className="font-medium">{log.dueDate}</span></span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-3 hover:bg-white/50"
                          onClick={() => viewLogDetails(log)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          <span className="text-xs">Voir</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal pour les détails de statistiques */}
      {viewingStatDetails && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={closeStatDetails}
          />
          
          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded-lg shadow-xl z-50 w-[600px] max-w-[90vw] max-h-[80vh] overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center">
                  📊 {viewingStatDetails.data.title}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeStatDetails}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Description */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">
                  {viewingStatDetails.data.description}
                </div>
                <div className="text-2xl font-bold text-foreground">
                  Total: {viewingStatDetails.data.count} factures
                </div>
              </div>

              {/* Liste des factures */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-4 flex items-center">
                  📋 Détail des factures
                </h4>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {viewingStatDetails.data.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{item.id}</span>
                          <Badge className={`text-xs ${item.statutColor}`}>
                            {item.statut}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {item.client}
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="font-medium">{item.montant}</span>
                          <span className="text-red-600">Retard: {item.retard}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Dernière action: {item.derniereAction} ({item.dateAction})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton Fermer */}
              <div className="flex justify-center">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                  onClick={closeStatDetails}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal pour les détails de campagne */}
      {viewingCampaignDetails && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={closeCampaignDetails}
          />
          
          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded-lg shadow-xl z-50 w-[500px] max-w-[90vw] max-h-[80vh] overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center">
                  📊 Détail de la campagne
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeCampaignDetails}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Statistiques détaillées */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-4 flex items-center">
                  📈 Statistiques détaillées
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {viewingCampaignDetails.id === 'janvier2025' ? '12' : '34'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Factures ciblées
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {viewingCampaignDetails.id === 'janvier2025' ? '28' : '67'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Actions réalisées
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      {viewingCampaignDetails.id === 'janvier2025' ? '3' : '5'}
                    </div>
                    <div className="text-xs text-green-600">
                      Paiements obtenus
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-yellow-100 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-800">
                      {viewingCampaignDetails.id === 'janvier2025' ? '25%' : '15%'}
                    </div>
                    <div className="text-xs text-yellow-600">
                      Taux de succès
                    </div>
                  </div>
                </div>
              </div>

              {/* Factures en cours */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-4 flex items-center">
                  📋 Factures en cours
                </h4>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {viewingCampaignDetails.id === 'janvier2025' ? (
                    <>
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">FAC-2024-001</span>
                          <span className="text-muted-foreground"> - SARL Dupont</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                          Étape 2/5
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">FAC-2024-004</span>
                          <span className="text-muted-foreground"> - EURL Rousseau</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                          Étape 3/5
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">FAC-2024-007</span>
                          <span className="text-muted-foreground"> - SAS Martin</span>
                        </div>
                        <Badge className="text-xs bg-green-500 text-white">
                          ✓ Payée
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">FAC-2024-015</span>
                          <span className="text-muted-foreground"> - Entreprise Leroy</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                          Étape 1/5
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">FAC-2024-032</span>
                          <span className="text-muted-foreground"> - SAS Moreau & Fils</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                          Étape 4/5
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">FAC-2024-198</span>
                          <span className="text-muted-foreground"> - Garage Renault Lyon</span>
                        </div>
                        <Badge className="text-xs bg-green-500 text-white">
                          ✓ Payée
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">FAC-2024-201</span>
                          <span className="text-muted-foreground"> - Taxi Marseille SARL</span>
                        </div>
                        <Badge className="text-xs bg-green-500 text-white">
                          ✓ Payée
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">FAC-2024-189</span>
                          <span className="text-muted-foreground"> - Transport Bordeaux</span>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          En litige
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">FAC-2024-203</span>
                          <span className="text-muted-foreground"> - Flotte Auto Paris</span>
                        </div>
                        <Badge className="text-xs bg-green-500 text-white">
                          ✓ Payée
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">FAC-2024-156</span>
                          <span className="text-muted-foreground"> - EURL Transport Sud</span>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          En litige
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bouton Fermer */}
              <div className="flex justify-center">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  onClick={closeCampaignDetails}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal pour les détails du journal */}
      {viewingLog && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={closeLogViewer}
          />
          
          {/* Modal */}
          <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border border-border rounded-lg shadow-xl z-50 w-[500px] max-w-[90vw]">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Détails de l'activité
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeLogViewer}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Heure:</span>
                    <div className="font-mono">{viewingLog.time}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Client:</span>
                    <div className="font-semibold">{viewingLog.client}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Action:</span>
                    <div>{viewingLog.action}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Statut:</span>
                    <Badge 
                      variant={
                        viewingLog.type === 'success' ? 'default' : 
                        viewingLog.type === 'error' ? 'destructive' : 
                        viewingLog.type === 'warning' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {viewingLog.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-muted-foreground">Détails:</span>
                  <div className="mt-1 p-3 bg-muted rounded border text-sm">
                    {viewingLog.details}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sidebar pour les détails */}
      {drawerData && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={closeDrawer}
          />
          
          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-screen w-[500px] max-w-[90vw] bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-6 h-full overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <Eye className="h-6 w-6 mr-2" />
                  Détails de la facture {drawerData.id}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeDrawer}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

               {/* Status Badge */}
               <div className="mb-6">
                 <Badge 
                   variant="outline" 
                   className={`${getStatusColor(drawerData.status)} text-sm px-3 py-1`}
                 >
                   {getStatusText(drawerData.status)}
                 </Badge>
               </div>

               {/* Progression des étapes */}
               <div className="mb-6">
                 <h4 className="text-lg font-semibold mb-4 flex items-center">
                   <Scale className="h-5 w-5 mr-2" />
                   Progression du recouvrement
                 </h4>
                 
                 {(() => {
                   // Déterminer l'étape actuelle basée sur l'historique et le statut
                   const getProgressionStep = (invoice: any) => {
                     const hasRegisteredMail = invoice.history.some((h: any) => 
                       h.type === 'registered' || h.action.toLowerCase().includes('mise en demeure')
                     );
                     const hasLegalAction = invoice.history.some((h: any) => 
                       h.type === 'legal' || h.action.toLowerCase().includes('tribunal')
                     );
                     const hasJudgment = invoice.history.some((h: any) => 
                       h.action.toLowerCase().includes('jugement')
                     );
                     const hasRelances = invoice.history.some((h: any) => 
                       h.type === 'email' || h.type === 'sms' || h.type === 'phone'
                     );

                     if (hasJudgment) return 5;
                     if (hasLegalAction) return 4;
                     if (hasRegisteredMail) return 3;
                     if (hasRelances) return 2;
                     return 1;
                   };

                   const currentStep = getProgressionStep(drawerData);
                   
                   const steps = [
                     { 
                       id: 1, 
                       label: 'Facture émise', 
                       color: currentStep >= 1 ? 'bg-green-500' : 'bg-gray-300',
                       textColor: currentStep >= 1 ? 'text-green-700' : 'text-gray-500',
                       bgColor: currentStep >= 1 ? 'bg-green-50' : 'bg-gray-50'
                     },
                     { 
                       id: 2, 
                       label: 'Relances auto', 
                       color: currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300',
                       textColor: currentStep >= 2 ? 'text-green-700' : 'text-gray-500',
                       bgColor: currentStep >= 2 ? 'bg-green-50' : 'bg-gray-50'
                     },
                     { 
                       id: 3, 
                       label: 'Mise en demeure', 
                       color: currentStep >= 3 ? 'bg-orange-500' : 'bg-gray-300',
                       textColor: currentStep >= 3 ? 'text-orange-700' : 'text-gray-500',
                       bgColor: currentStep >= 3 ? 'bg-orange-50' : 'bg-gray-50'
                     },
                     { 
                       id: 4, 
                       label: 'Dossier tribunal', 
                       color: currentStep >= 4 ? 'bg-red-500' : 'bg-gray-300',
                       textColor: currentStep >= 4 ? 'text-red-700' : 'text-gray-500',
                       bgColor: currentStep >= 4 ? 'bg-red-50' : 'bg-gray-50'
                     },
                     { 
                       id: 5, 
                       label: 'Jugement', 
                       color: currentStep >= 5 ? 'bg-red-600' : 'bg-gray-300',
                       textColor: currentStep >= 5 ? 'text-red-800' : 'text-gray-500',
                       bgColor: currentStep >= 5 ? 'bg-red-50' : 'bg-gray-50'
                     }
                   ];

                   return (
                     <div className="relative">
                       {/* Ligne de progression */}
                       <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 z-0"></div>
                       <div 
                         className="absolute top-6 left-6 h-0.5 bg-green-500 z-10 transition-all duration-500"
                         style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                       ></div>

                       {/* Étapes */}
                       <div className="relative z-20 grid grid-cols-5 gap-2">
                         {steps.map((step, index) => (
                           <div key={step.id} className="flex flex-col items-center">
                             {/* Cercle numéroté */}
                             <div 
                               className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${step.color} ${
                                 currentStep === step.id ? 'ring-4 ring-opacity-30 ' + (
                                   step.id <= 2 ? 'ring-green-300' : 
                                   step.id === 3 ? 'ring-orange-300' : 
                                   'ring-red-300'
                                 ) : ''
                               }`}
                             >
                               {step.id}
                             </div>
                             
                             {/* Label */}
                             <div className={`mt-2 text-xs font-medium text-center ${step.textColor} transition-colors duration-300`}>
                               {step.label}
                             </div>
                             
                             {/* Indicator bar sous l'étape actuelle */}
                             {currentStep === step.id && (
                               <div className={`mt-1 w-16 h-1 rounded-full transition-all duration-300 ${
                                 step.id <= 2 ? 'bg-green-400' : 
                                 step.id === 3 ? 'bg-orange-400' : 
                                 'bg-red-400'
                               }`}></div>
                             )}
                           </div>
                         ))}
                       </div>

                       {/* Informations sur l'étape actuelle */}
                       <div className={`mt-6 p-4 rounded-lg border transition-all duration-300 ${
                         currentStep <= 2 ? 'bg-green-50 border-green-200' :
                         currentStep === 3 ? 'bg-orange-50 border-orange-200' :
                         'bg-red-50 border-red-200'
                       }`}>
                         <div className="flex items-center justify-between">
                           <div>
                             <div className={`font-semibold text-sm ${
                               currentStep <= 2 ? 'text-green-800' :
                               currentStep === 3 ? 'text-orange-800' :
                               'text-red-800'
                             }`}>
                               Étape actuelle : {steps[currentStep - 1].label}
                             </div>
                             <div className={`text-xs mt-1 ${
                               currentStep <= 2 ? 'text-green-600' :
                               currentStep === 3 ? 'text-orange-600' :
                               'text-red-600'
                             }`}>
                               {currentStep === 1 && 'Facture émise, en attente de paiement'}
                               {currentStep === 2 && 'Relances automatiques en cours'}
                               {currentStep === 3 && 'Mise en demeure envoyée'}
                               {currentStep === 4 && 'Procédure judiciaire engagée'}
                               {currentStep === 5 && 'Jugement rendu'}
                             </div>
                           </div>
                           <div className={`text-xl ${
                             currentStep <= 2 ? 'text-green-500' :
                             currentStep === 3 ? 'text-orange-500' :
                             'text-red-500'
                           }`}>
                             {currentStep <= 2 ? '📧' :
                              currentStep === 3 ? '📨' :
                              currentStep === 4 ? '⚖️' : '🏛️'}
                           </div>
                         </div>
                       </div>
                     </div>
                   );
                 })()}
               </div>

              {/* Relance History */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Historique des relances
                </h4>
                
                {viewingContent ? (
                  /* Content Viewer */
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-semibold">Contenu de la {viewingContent.type === 'email' ? 'relance email' : viewingContent.type === 'sms' ? 'relance SMS' : 'relance téléphonique'}</h5>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingContent(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {viewingContent.type === 'email' && (
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-muted-foreground">Sujet:</span>
                          <div className="mt-1 p-2 bg-background rounded border">
                            {viewingContent.content.subject}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Message:</span>
                          <div className="mt-1 p-3 bg-background rounded border whitespace-pre-line text-sm">
                            {viewingContent.content.body}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {viewingContent.type === 'sms' && (
                      <div>
                        <span className="font-medium text-muted-foreground">Message SMS:</span>
                        <div className="mt-1 p-3 bg-background rounded border text-sm">
                          {viewingContent.content.message}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Longueur: {viewingContent.content.message.length} caractères
                        </div>
                      </div>
                    )}
                    
                    {viewingContent.type === 'phone' && (
                      <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Phone className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="font-medium text-blue-800">Résumé de l'appel téléphonique</span>
                          </div>
                          {viewingContent.content.duration && (
                            <div className="text-sm text-blue-700 mb-2">
                              <strong>Durée:</strong> {viewingContent.content.duration}
                            </div>
                          )}
                          {viewingContent.content.outcome && (
                            <div className="text-sm text-blue-700">
                              <strong>Résultat:</strong> {viewingContent.content.outcome}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Notes détaillées:</span>
                          <div className="mt-1 p-3 bg-background rounded border text-sm">
                            {viewingContent.content.note}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {viewingContent.type === 'registered' && (
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-muted-foreground">Objet:</span>
                          <div className="mt-1 p-2 bg-background rounded border font-medium">
                            {viewingContent.content.subject}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Contenu:</span>
                          <div className="mt-1 p-3 bg-background rounded border text-sm">
                            {viewingContent.content.body}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {viewingContent.type === 'legal' && (
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-muted-foreground">Informations:</span>
                          <div className="mt-1 p-3 bg-background rounded border text-sm">
                            {viewingContent.content.note}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Montant réclamé:</span>
                          <div className="mt-1 font-semibold text-red-600">
                            {viewingContent.content.amount}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* History Timeline */
                  <div className="space-y-3">
                    {drawerData.history
                      .sort((a: any, b: any) => new Date(a.date + ' ' + (a.time || '00:00')).getTime() - new Date(b.date + ' ' + (b.time || '00:00')).getTime())
                      .map((entry: any, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{entry.action}</div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={entry.status === 'Envoyé' ? 'default' : entry.status === 'Lu' ? 'secondary' : entry.status === 'Reçu' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {entry.status}
                              </Badge>
                              {entry.content && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => viewContent(entry.content, entry.type)}
                                  className="text-xs px-2 py-1 h-6"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Voir
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {entry.date} {entry.time && `à ${entry.time}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* General Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Informations générales
                </h4>
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Client:</span>
                    <div className="font-semibold">{drawerData.client}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Montant:</span>
                    <div className="font-semibold">{drawerData.amount}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Date d'échéance:</span>
                    <div>{drawerData.dueDate}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Retard:</span>
                    <div className="font-medium text-red-600">{drawerData.daysOverdue} jours</div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Informations de contact
                </h4>
                <div className="space-y-2 text-sm">
                  {drawerData.clientPhone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{drawerData.clientPhone}</span>
                    </div>
                  )}
                  {drawerData.clientEmail && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{drawerData.clientEmail}</span>
                    </div>
                  )}
                  {drawerData.clientAddress && (
                    <div className="flex items-start">
                      <div className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground">📍</div>
                      <div className="whitespace-pre-line">{drawerData.clientAddress}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Documents disponibles
                </h4>
                <div className="space-y-3">
                  {[
                    { name: "Facture originale", icon: "📄" },
                    { name: "Devis signé", icon: "📝" },
                    { name: "Historique des relances", icon: "📜" }
                  ].map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{doc.icon}</span>
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log(`Téléchargement: ${doc.name}`)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons / Countdown */}
              <div className="pt-4 border-t">
                {drawerData.status.includes('relance') ? (
                  (() => {
                    const countdown = getNextActionCountdown(drawerData);
                    if (!countdown) {
                      return (
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">
                            Aucun SMS de rappel trouvé pour calculer le délai automatique
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <Clock className="h-5 w-5 text-orange-600 mr-2" />
                          <span className="font-semibold text-orange-800">
                            {countdown.action}
                          </span>
                        </div>
                        
                        {countdown.isActive ? (
                          <div className="space-y-2">
                            <div className="text-2xl font-bold text-orange-700">
                              {countdown.timeLeft.days > 0 && `${countdown.timeLeft.days}j `}
                              {String(countdown.timeLeft.hours).padStart(2, '0')}:
                              {String(countdown.timeLeft.minutes).padStart(2, '0')}:
                              {String(countdown.timeLeft.seconds).padStart(2, '0')}
                            </div>
                            <div className="text-xs text-orange-600">
                              {countdown.type === 'miseEnDemeure' 
                                ? `Délai automatique de 8 jours après le dernier SMS (échéance: ${countdown.deadline})`
                                : `Délai automatique de 10 jours après la mise en demeure (échéance: ${countdown.deadline})`
                              }
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-sm text-red-600 font-medium">
                              Délai dépassé depuis le {countdown.deadline}
                            </div>
                            <div className="text-xs text-red-500">
                              Action manuelle requise
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : drawerData.status === 'contentieux' ? (
                  <div className="text-center p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-300 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Scale className="h-5 w-5 text-red-600 mr-2" />
                      <span className="font-semibold text-red-800">
                        Procédure judiciaire en cours
                      </span>
                    </div>
                    <div className="text-sm text-red-600">
                      Dossier déposé au tribunal
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentRelances;