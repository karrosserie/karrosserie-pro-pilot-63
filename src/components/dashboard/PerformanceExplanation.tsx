
import { CheckCircle, ThumbsUp, AlertTriangle, Target } from 'lucide-react';

export const PerformanceExplanation = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Excellent */}
        <div className="bg-card rounded-lg border-l-4 border-l-green-500 border border-border p-4">
          <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
            <CheckCircle className="w-4 h-4" />
            Excellent (&gt;125%)
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            L'employé vend beaucoup plus d'heures qu'il n'en coûte. Il génère du profit.
          </p>
          <p className="text-xs text-green-600">
            Continue ainsi, utilise-le en exemple pour les autres.
          </p>
        </div>

        {/* Bon */}
        <div className="bg-card rounded-lg border-l-4 border-l-blue-500 border border-border p-4">
          <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
            <ThumbsUp className="w-4 h-4" />
            Bon (110-125%)
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            L'employé est rentable, il vend plus qu'il ne coûte. Peut mieux faire.
          </p>
          <p className="text-xs text-blue-600">
            Encourage-le à viser 130%, vérifie s'il perd du temps quelque part.
          </p>
        </div>

        {/* À améliorer */}
        <div className="bg-card rounded-lg border-l-4 border-l-orange-500 border border-border p-4">
          <div className="flex items-center gap-2 text-orange-600 font-semibold mb-2">
            <AlertTriangle className="w-4 h-4" />
            À améliorer (&lt;110%)
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            L'employé ne vend pas assez d'heures. Attention à la rentabilité.
          </p>
          <p className="text-xs text-orange-600">
            Parle avec lui pour comprendre le problème, formation urgente si nécessaire.
          </p>
        </div>
      </div>

      {/* Résumé */}
      <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
        <Target className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Objectif de rentabilité</p>
          <p className="text-xs text-muted-foreground">
            Tous les employés doivent être au minimum à 120% pour que l'atelier soit vraiment rentable.
          </p>
        </div>
      </div>
    </div>
  );
};
