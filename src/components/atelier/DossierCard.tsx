import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Key, MessageCircle, Check, Pen, Package, CheckCircle, Calendar, HardHat, AlertCircle, UserPlus } from 'lucide-react';
import { Dossier, Alert, STATUS_CONFIG, ALERT_CONFIG } from '@/types/atelier';

interface DossierCardProps {
  dossier: Dossier;
  alerts: Alert[];
  onSelect: (dossier: Dossier) => void;
  onAction: (action: string, dossier: Dossier) => void;
  onAssigner: (dossier: Dossier) => void;
  formatCountdown: (ms: number) => string;
}

export const DossierCard = ({ 
  dossier: d, 
  alerts, 
  onSelect, 
  onAction,
  onAssigner,
  formatCountdown 
}: DossierCardProps) => {
  const urgent = alerts.some(a => ALERT_CONFIG[a.type].priority <= 1);
  const status = STATUS_CONFIG[d.status];

  return (
    <Card
      onClick={() => onSelect(d)}
      className={`p-5 cursor-pointer hover:shadow-lg transition-shadow ${
        urgent ? 'border-l-4 border-destructive' : ''
      } ${d.status === 'rdv_restitution' ? 'ring-2 ring-cyan-300' : ''}`}
    >
      <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className={status.color}>
            <status.Icon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
          <span className="text-xl font-bold">{d.immatriculation}</span>
          {d.marqueModele && (
            <span className="text-sm text-muted-foreground">({d.marqueModele})</span>
          )}
        </div>
        {d.pvReception && (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            PV
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {d.prenom} {d.nom}
        </span>
        <span className="flex items-center gap-1">
          <Phone className="h-4 w-4" />
          {d.mobile}
        </span>
        {d.dateRestitution && (
          <span className="flex items-center gap-1 text-cyan-600 font-medium">
            <Key className="h-4 w-4" />
            {d.dateRestitution} {d.heureRestitution}
          </span>
        )}
      </div>

      {/* Employé assigné */}
      <div className="mt-2">
        {d.employeAssigne ? (
          <span className="flex items-center gap-2 text-sm">
            <HardHat className="h-4 w-4 text-indigo-600" />
            <span className="font-medium text-indigo-600">{d.employeAssigne.nom}</span>
            {d.employeAssigne.tacheEnCours && (
              <Badge variant="outline" className="text-xs">
                {d.employeAssigne.tacheEnCours}
              </Badge>
            )}
            {d.employeAssigne.statusTache && (
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  d.employeAssigne.statusTache === 'En cours' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                }`}
              >
                {d.employeAssigne.statusTache}
              </Badge>
            )}
          </span>
        ) : d.status === 'en_reparation' && (
          <span className="flex items-center gap-1 text-sm text-orange-600">
            <AlertCircle className="h-4 w-4" />
            Non assigné
          </span>
        )}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mt-2">
          {alerts.map((a, i) => {
            const AlertIcon = ALERT_CONFIG[a.type].Icon;
            return (
              <div 
                key={i} 
                className={`flex items-center gap-2 text-sm ${ALERT_CONFIG[a.type].color} font-medium`}
              >
                <AlertIcon className="h-4 w-4" />
                <span>{ALERT_CONFIG[a.type].label}</span>
                {a.countdown && (
                  <span className="ml-auto font-mono">{formatCountdown(a.countdown)}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mt-3">
        {/* Bouton Assigner */}
        <Button 
          size="sm" 
          variant="outline" 
          onClick={(e) => { e.stopPropagation(); onAssigner(d); }}
          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Assigner
        </Button>
        
        {/* Planifier Expertise - pour les dossiers sans expertise planifiée */}
        {(d.status === 'entree_atelier' || d.status === 'attente_expertise') && !d.dateExpertise && (
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('planifier_expertise', d); }}>
            <Calendar className="h-4 w-4 mr-1" />
            Expertise
          </Button>
        )}
        {d.status === 'termine' && (
          <>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('whatsapp_rdv', d); }}>
              <MessageCircle className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('planifier_rdv', d); }}>
              <Key className="h-4 w-4 mr-1" />
              RDV
            </Button>
          </>
        )}
        {d.status === 'rdv_restitution' && (
          <Button 
            size="sm" 
            className="bg-karrosserie-blue hover:bg-karrosserie-blue/90"
            onClick={(e) => { e.stopPropagation(); onAction('signer_pv', d); }}
          >
            <Pen className="h-4 w-4 mr-1" />
            Signer PV
          </Button>
        )}
        {d.status === 'en_reparation' && (
          <>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('attente_pieces', d); }}>
              <Package className="h-4 w-4 mr-1" />
              Pièces
            </Button>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('terminer', d); }}>
              <Check className="h-4 w-4 mr-1" />
              Terminé
            </Button>
          </>
        )}
        {d.status === 'expertise_planifiee' && (
          <>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('whatsapp_expertise', d); }}>
              <MessageCircle className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('expertise_effectuee', d); }}>
              <Check className="h-4 w-4 mr-1" />
              Effectuée
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
