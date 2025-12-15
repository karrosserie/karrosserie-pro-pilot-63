import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dossier, Alert, STATUS_CONFIG, ALERT_CONFIG } from '@/types/atelier';

interface DossierCardProps {
  dossier: Dossier;
  alerts: Alert[];
  onSelect: (dossier: Dossier) => void;
  onAction: (action: string, dossier: Dossier) => void;
  formatCountdown: (ms: number) => string;
}

export const DossierCard = ({ 
  dossier: d, 
  alerts, 
  onSelect, 
  onAction,
  formatCountdown 
}: DossierCardProps) => {
  const urgent = alerts.some(a => ALERT_CONFIG[a.type].priority <= 1);
  const status = STATUS_CONFIG[d.status];

  return (
    <Card
      onClick={() => onSelect(d)}
      className={`p-5 cursor-pointer hover:shadow-lg transition-shadow ${
        urgent ? 'border-l-4 border-red-500' : ''
      } ${d.status === 'rdv_restitution' ? 'ring-2 ring-cyan-300' : ''}`}
    >
      <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className={status.color}>
            {status.icon} {status.label}
          </Badge>
          <span className="text-xl font-bold">{d.immatriculation}</span>
          {d.marqueModele && (
            <span className="text-sm text-muted-foreground">({d.marqueModele})</span>
          )}
        </div>
        {d.pvReception && (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
            ✅ PV
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>👤 {d.prenom} {d.nom}</span>
        <span>📱 {d.mobile}</span>
        {d.dateRestitution && (
          <span className="text-cyan-600 font-medium">
            🔑 {d.dateRestitution} {d.heureRestitution}
          </span>
        )}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mt-2">
          {alerts.map((a, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-2 text-sm ${ALERT_CONFIG[a.type].color} font-medium`}
            >
              <span>{ALERT_CONFIG[a.type].icon}</span>
              <span>{ALERT_CONFIG[a.type].label}</span>
              {a.countdown && (
                <span className="ml-auto font-mono">{formatCountdown(a.countdown)}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mt-3">
        {d.status === 'termine' && (
          <>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('whatsapp_rdv', d); }}>
              💬 WhatsApp
            </Button>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('planifier_rdv', d); }}>
              🔑 RDV
            </Button>
          </>
        )}
        {d.status === 'rdv_restitution' && (
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-karrosserie-blue to-purple-600"
            onClick={(e) => { e.stopPropagation(); onAction('signer_pv', d); }}
          >
            ✍️ Signer PV
          </Button>
        )}
        {d.status === 'en_reparation' && (
          <>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('attente_pieces', d); }}>
              📦 Pièces
            </Button>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('terminer', d); }}>
              ✅ Terminé
            </Button>
          </>
        )}
        {d.status === 'expertise_planifiee' && (
          <>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('whatsapp_expertise', d); }}>
              💬 WhatsApp
            </Button>
            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onAction('expertise_effectuee', d); }}>
              ✓ Effectuée
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
