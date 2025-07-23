
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Paperclip, FileText } from 'lucide-react';
import { GeneratedReport } from '@/hooks/use-generated-reports';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmailReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: GeneratedReport | null;
  onSend: (email: string) => void;
}

export const EmailReportDialog = ({ 
  open, 
  onOpenChange, 
  report, 
  onSend 
}: EmailReportDialogProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getEmailSubject = (report: GeneratedReport) => {
    const fromDateStr = format(report.fromDate, 'dd/MM/yyyy', { locale: fr });
    const toDateStr = format(report.toDate, 'dd/MM/yyyy', { locale: fr });
    return `${report.name} - Période du ${fromDateStr} au ${toDateStr}`;
  };

  const getEmailBody = (report: GeneratedReport) => {
    const fromDateStr = format(report.fromDate, 'dd/MM/yyyy', { locale: fr });
    const toDateStr = format(report.toDate, 'dd/MM/yyyy', { locale: fr });
    
    const reportTypeText = {
      'monthly': 'le bilan mensuel',
      'quarterly': 'le bilan trimestriel', 
      'yearly': 'le bilan annuel',
      'fec': 'l\'export au format FEC',
      'csv': 'l\'export au format CSV',
      'excel': 'l\'export au format Excel'
    };

    return `Bonjour,

Veuillez trouver ${reportTypeText[report.type] || 'le rapport'} en pièce jointe pour la période du ${fromDateStr} au ${toDateStr}.

Ce document a été généré automatiquement le ${format(report.generatedAt, 'dd/MM/yyyy à HH:mm', { locale: fr })}.

Cordialement,
L'équipe comptabilité`;
  };

  const handleSend = async () => {
    if (!email || !report) return;

    setIsLoading(true);
    await onSend(email);
    setIsLoading(false);
    setEmail('');
    onOpenChange(false);
  };

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Envoyer le rapport par email</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email du destinataire</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Objet</Label>
            <Input
              value={getEmailSubject(report)}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={getEmailBody(report)}
              readOnly
              className="bg-gray-50 min-h-[200px]"
            />
          </div>

          {/* Section Pièces jointes */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Pièce jointe</Label>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>
                {report.name.replace(/\s+/g, '_')}.pdf
              </span>
              <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Générée automatiquement
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSend}
              disabled={!email || isLoading}
            >
              {isLoading ? 'Envoi...' : 'Envoyer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
