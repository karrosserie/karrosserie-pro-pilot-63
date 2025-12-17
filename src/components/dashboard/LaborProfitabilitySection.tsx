import { DashboardProductivityData } from '@/hooks/dashboard/use-dashboard-productivity';
import { TrendingUp, TrendingDown, AlertTriangle, Info, Calculator, CheckCircle } from 'lucide-react';

interface LaborProfitabilitySectionProps {
  data: DashboardProductivityData;
}

export const LaborProfitabilitySection = ({ data }: LaborProfitabilitySectionProps) => {
  const isPositiveMargin = data.laborMargin > 0;

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        💰 Rentabilité de ta Main d'Œuvre
      </h2>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* CA Main d'Œuvre */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-2">
            💰 CA Main d'Œuvre
          </p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {data.totalRevenue.toLocaleString('fr-FR')}€
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Heures vendues × Taux horaire
          </p>
        </div>

        {/* Coût Salarial */}
        <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
          <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1 flex items-center gap-2">
            💸 Coût Salarial
          </p>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
            {data.laborCost.toLocaleString('fr-FR')}€
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            {data.totalBoughtHours}h × {data.hourlyRates.laborCost}€/h
          </p>
        </div>

        {/* Marge Main d'Œuvre */}
        <div className={`rounded-lg p-4 border ${
          isPositiveMargin 
            ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
        }`}>
          <p className={`text-sm font-medium mb-1 flex items-center gap-2 ${
            isPositiveMargin ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
          }`}>
            {isPositiveMargin ? '✅' : '❌'} Marge Main d'Œuvre
          </p>
          <p className={`text-3xl font-bold ${
            isPositiveMargin ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
          }`}>
            {isPositiveMargin ? '+' : ''}{data.laborMargin.toLocaleString('fr-FR')}€
          </p>
          <p className={`text-xs mt-1 ${
            isPositiveMargin ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositiveMargin ? 'TES EMPLOYÉS SONT RENTABLES ! 🎉' : 'ATTENTION : Marge négative'}
          </p>
        </div>
      </div>

      {/* Avertissement */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              ATTENTION - Ce n'est pas ton bénéfice final !
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Cet indicateur mesure la rentabilité de ta main d'œuvre uniquement
            </p>
          </div>
        </div>
      </div>

      {/* Deux colonnes : Coûts non inclus / À quoi ça sert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Coûts NON inclus */}
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="font-semibold text-foreground mb-3 flex items-center gap-2">
            ❌ Coûts NON inclus ici :
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Charges sociales (~45%)</li>
            <li>• Loyer & fluides</li>
            <li>• Équipements & amortissements</li>
            <li>• Assurances RC Pro</li>
            <li>• Frais bancaires & comptable</li>
            <li>• Véhicules & carburant</li>
          </ul>
        </div>

        {/* À quoi ça sert */}
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="font-semibold text-foreground mb-3 flex items-center gap-2">
            💡 À quoi ça sert ?
          </p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Ton activité génère-t-elle assez d'heures vendues ?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Tes équipes sont-elles productives ?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Ta marge MO couvre-t-elle les charges ?</span>
            </li>
          </ul>
          <div className="mt-3 pt-3 border-t border-border text-xs">
            <p className="text-green-600 dark:text-green-400">🟢 Positif = Bonne activité</p>
            <p className="text-red-600 dark:text-red-400">🔴 Négatif = Pas assez d'heures vendues</p>
          </div>
        </div>
      </div>

      {/* Comment on calcule */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        <p className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          💡 Comment on calcule cette marge ?
        </p>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <span className="font-medium text-foreground">1️⃣ CA Main d'Œuvre</span> = Somme des factures de la période
          </p>
          <p>
            <span className="font-medium text-foreground">2️⃣ Coût Salarial Brut</span> = Heures pointées × Coût horaire moyen ({data.hourlyRates.laborCost}€/h)
          </p>
          <p>
            <span className="font-medium text-foreground">3️⃣ Marge Main d'Œuvre</span> = CA Main d'Œuvre - Coût Salarial Brut
          </p>
        </div>
        <div className="mt-4 p-3 bg-card rounded border border-border">
          <p className="text-sm">
            📊 <strong>C'est quoi cette marge ?</strong> C'est l'argent généré par le travail de tes employés 
            <strong className="text-primary"> AVANT</strong> de payer toutes les autres charges de l'entreprise.
          </p>
        </div>
      </div>

      {/* Indication taux horaires utilisés */}
      <div className="mt-4 text-xs text-muted-foreground flex flex-wrap gap-4">
        <span>Taux horaires : Carrosserie {data.hourlyRates.carrosserie}€/h</span>
        <span>Peinture {data.hourlyRates.peinture}€/h</span>
        <span>Mécanique {data.hourlyRates.mecanique}€/h</span>
        <span>Coût salarial {data.hourlyRates.laborCost}€/h</span>
      </div>
    </div>
  );
};
