import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { User, Car, Calendar, FileText, History, MessageCircle, Key, Pen, Package, Check, CalendarPlus } from 'lucide-react';
import { Dossier, STATUS_CONFIG } from '@/types/atelier';

interface DossierDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dossier: Dossier | null;
  onAction: (action: string, dossier: Dossier) => void;
}

export const DossierDetailModal = ({ open, onOpenChange, dossier, onAction }: DossierDetailModalProps) => {
  if (!dossier) return null;

  const status = STATUS_CONFIG[dossier.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl font-bold">{dossier.immatriculation}</span>
            <Badge className={status.color}>
              <status.Icon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Client Info */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Client
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Nom:</span>{' '}
                <span className="font-medium">{dossier.prenom} {dossier.nom}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Mobile:</span>{' '}
                <span className="font-medium">{dossier.mobile}</span>
              </div>
              {dossier.email && (
                <div>
                  <span className="text-muted-foreground">Email:</span>{' '}
                  <span className="font-medium">{dossier.email}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Vehicle Info */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Car className="h-4 w-4" />
              Véhicule
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Immatriculation:</span>{' '}
                <span className="font-medium">{dossier.immatriculation}</span>
              </div>
              {dossier.marqueModele && (
                <div>
                  <span className="text-muted-foreground">Marque/Modèle:</span>{' '}
                  <span className="font-medium">{dossier.marqueModele}</span>
                </div>
              )}
              {dossier.vin && (
                <div>
                  <span className="text-muted-foreground">VIN:</span>{' '}
                  <span className="font-mono text-xs">{dossier.vin}</span>
                </div>
              )}
              {dossier.kmEntree && (
                <div>
                  <span className="text-muted-foreground">Km entrée:</span>{' '}
                  <span className="font-medium">{dossier.kmEntree}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Dates */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dates
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Entrée:</span>{' '}
                <span className="font-medium">{dossier.dateEntree} {dossier.heureEntree}</span>
              </div>
              {dossier.dateExpertise && (
                <div>
                  <span className="text-muted-foreground">Expertise:</span>{' '}
                  <span className="font-medium">{dossier.dateExpertise} {dossier.heureExpertise}</span>
                </div>
              )}
              {dossier.dateRestitution && (
                <div>
                  <span className="text-muted-foreground">Restitution:</span>{' '}
                  <span className="font-medium text-cyan-600">{dossier.dateRestitution} {dossier.heureRestitution}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          {dossier.notes && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </h3>
              <p className="text-sm">{dossier.notes}</p>
            </Card>
          )}

          {/* History */}
          {dossier.historique && dossier.historique.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <History className="h-4 w-4" />
                Historique
              </h3>
              <div className="space-y-2">
                {dossier.historique.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm border-l-2 border-muted pl-3">
                    <span className="text-muted-foreground text-xs">
                      {new Date(h.date).toLocaleDateString('fr-FR')} {new Date(h.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>{h.action}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {/* Planifier Expertise - pour les dossiers sans expertise planifiée */}
            {(dossier.status === 'entree_atelier' || dossier.status === 'attente_expertise') && !dossier.dateExpertise && (
              <Button variant="outline" onClick={() => onAction('planifier_expertise', dossier)}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Planifier expertise
              </Button>
            )}
            {dossier.status === 'termine' && (
              <>
                <Button variant="outline" onClick={() => onAction('whatsapp_rdv', dossier)}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" onClick={() => onAction('planifier_rdv', dossier)}>
                  <Key className="h-4 w-4 mr-2" />
                  Planifier RDV
                </Button>
              </>
            )}
            {dossier.status === 'rdv_restitution' && (
              <Button 
                className="bg-karrosserie-blue hover:bg-karrosserie-blue/90"
                onClick={() => onAction('signer_pv', dossier)}
              >
                <Pen className="h-4 w-4 mr-2" />
                Signer PV réception
              </Button>
            )}
            {dossier.status === 'en_reparation' && (
              <>
                <Button variant="outline" onClick={() => onAction('attente_pieces', dossier)}>
                  <Package className="h-4 w-4 mr-2" />
                  Attente pièces
                </Button>
                <Button variant="outline" onClick={() => onAction('terminer', dossier)}>
                  <Check className="h-4 w-4 mr-2" />
                  Terminer
                </Button>
              </>
            )}
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
