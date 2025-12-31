import { Button } from '@/components/ui/button';
import { DossierWithDetails } from '@/types/dossier';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface DossierTimelineProps {
  dossier: DossierWithDetails;
}

interface TimelineEvent {
  id: string;
  date: Date | null;
  title: string;
  description: string;
  type: 'creation' | 'expertise' | 'devis' | 'repair_order' | 'invoice' | 'cession';
  completed: boolean;
  linkTo?: string;
}

export const DossierTimeline = ({ dossier }: DossierTimelineProps) => {
  const navigate = useNavigate();

  // Build timeline events from dossier data
  const events: TimelineEvent[] = [];

  // Get client and vehicle info for creation event
  const client = dossier.clients;
  const vehicle = dossier.vehicles;
  const clientName = client 
    ? client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() 
    : 'Client';
  const licensePlate = vehicle?.license_plate || 'Véhicule';

  // 1. Dossier creation
  events.push({
    id: 'creation',
    date: dossier.created_at ? new Date(dossier.created_at) : null,
    title: 'Dossier créé',
    description: `Client: ${clientName} | Véhicule: ${licensePlate}`,
    type: 'creation',
    completed: true,
  });

  // 2. Expertise report
  if (dossier.expertise_reports) {
    const report = dossier.expertise_reports;
    const reportDate = report.report_date ? new Date(report.report_date) : null;
    events.push({
      id: 'expertise',
      date: reportDate,
      title: 'Expertise liée',
      description: `${report.report_number || 'EXP'} | Montant: ${report.amount?.toLocaleString('fr-FR') || '0'}€ | ${report.status === 'validated' ? 'Validée' : 'En attente'}`,
      type: 'expertise',
      completed: true,
      linkTo: `/documents/expertise?openReport=${report.id}`,
    });
  } else {
    events.push({
      id: 'expertise',
      date: null,
      title: 'Expertise',
      description: '(à venir)',
      type: 'expertise',
      completed: false,
    });
  }

  // 3. Devis (Quote)
  if (dossier.quotes) {
    const quote = dossier.quotes;
    events.push({
      id: 'devis',
      date: quote.created_at ? new Date(quote.created_at) : null,
      title: 'Devis créé',
      description: `${quote.reference || 'DEV'} | ${quote.amount?.toLocaleString('fr-FR') || '0'}€ | ${quote.status === 'accepted' ? 'Accepté' : quote.status === 'pending' ? 'En attente' : quote.status || 'En attente'}`,
      type: 'devis',
      completed: true,
      linkTo: `/documents/devis?openQuote=${quote.id}`,
    });
  } else {
    events.push({
      id: 'devis',
      date: null,
      title: 'Devis',
      description: '(à venir)',
      type: 'devis',
      completed: false,
    });
  }

  // 4. Repair Order
  if (dossier.repair_orders) {
    const ro = dossier.repair_orders;
    const roDate = ro.arrival_date ? new Date(ro.arrival_date) : null;
    events.push({
      id: 'repair_order',
      date: roDate,
      title: 'Ordre de réparation',
      description: `${ro.reference || 'OR'} | ${ro.status === 'completed' ? 'Terminé' : ro.status === 'in_progress' ? 'En cours' : 'En attente'}`,
      type: 'repair_order',
      completed: true,
      linkTo: `/documents/ordres?openOrder=${ro.id}`,
    });
  } else {
    events.push({
      id: 'repair_order',
      date: null,
      title: 'Ordre de réparation',
      description: '(à venir)',
      type: 'repair_order',
      completed: false,
    });
  }

  // 5. Invoice
  if (dossier.invoices && dossier.invoices.length > 0) {
    const invoice = dossier.invoices[0];
    const invoiceDate = invoice.issue_date ? new Date(invoice.issue_date) : null;
    events.push({
      id: 'invoice',
      date: invoiceDate,
      title: 'Facture',
      description: `${invoice.reference || 'FAC'} | ${invoice.amount?.toLocaleString('fr-FR') || '0'}€ | ${invoice.status === 'paid' ? 'Payée' : 'En attente'}`,
      type: 'invoice',
      completed: true,
      linkTo: `/documents/factures?openInvoice=${invoice.id}`,
    });
  } else {
    events.push({
      id: 'invoice',
      date: null,
      title: 'Facture',
      description: '(à venir)',
      type: 'invoice',
      completed: false,
    });
  }

  // 6. Cession
  if (dossier.cessions) {
    const cession = dossier.cessions;
    events.push({
      id: 'cession',
      date: null,
      title: 'Cession',
      description: `${cession.reference || 'CES'} | ${cession.status === 'signed' ? 'Signée' : 'En attente'}`,
      type: 'cession',
      completed: true,
      linkTo: `/cessions?openCession=${cession.id}`,
    });
  } else {
    events.push({
      id: 'cession',
      date: null,
      title: 'Cession',
      description: '(à venir)',
      type: 'cession',
      completed: false,
    });
  }

  return (
    <div className="space-y-0">
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-4">
          {/* Timeline Line */}
          <div className="flex flex-col items-center">
            {/* Dot */}
            <div 
              className={cn(
                "w-3 h-3 rounded-full shrink-0 z-10",
                event.completed 
                  ? "bg-[hsl(var(--karrosserie-orange))]" 
                  : "bg-background border-2 border-muted-foreground/30"
              )}
            />
            {/* Vertical Line */}
            {index < events.length - 1 && (
              <div 
                className={cn(
                  "w-0.5 flex-1 min-h-[60px]",
                  event.completed && events[index + 1]?.completed 
                    ? "bg-primary" 
                    : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-6">
            {/* Date */}
            {event.date && (
              <p className="text-sm text-muted-foreground mb-2">
                {format(event.date, "dd/MM/yyyy HH:mm", { locale: fr })}
              </p>
            )}

            {/* Event Card */}
            <div 
              className={cn(
                "rounded-lg p-4 flex items-center justify-between",
                event.completed 
                  ? "bg-background border border-border shadow-sm" 
                  : "bg-muted/30 border border-dashed border-muted-foreground/30"
              )}
            >
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div 
                    className={cn(
                      "w-1 h-12 rounded-full shrink-0",
                      event.completed ? "bg-primary" : "bg-transparent"
                    )}
                  />
                  <div>
                    <h4 
                      className={cn(
                        "font-medium",
                        event.completed ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {event.title}
                    </h4>
                    <p 
                      className={cn(
                        "text-sm",
                        event.completed ? "text-muted-foreground" : "text-muted-foreground/70"
                      )}
                    >
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>

              {event.completed && event.linkTo && (
                <Button
                  size="sm"
                  className="ml-4 gap-1"
                  onClick={() => navigate(event.linkTo!)}
                >
                  Voir
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
