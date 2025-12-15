

export const PerformanceExplanation = () => {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Encadré VERT : Excellent */}
        <div className="bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20 border-l-[6px] border-green-600 rounded-2xl p-5">
          <div className="text-xl font-bold mb-3 text-green-700 dark:text-green-400">
            ✅ EXCELLENT (&gt;125%)
          </div>
          <div className="text-base leading-relaxed text-foreground mb-4">
            <strong>C'EST QUOI ?</strong><br/>
            L'employé vend BEAUCOUP plus d'heures qu'il n'en coûte. Il génère du PROFIT.
          </div>
          <div className="bg-white dark:bg-background/50 rounded-xl p-4 mb-4">
            <div className="text-sm text-muted-foreground mb-2">👤 Exemples :</div>
            <strong className="text-green-700 dark:text-green-400">• Jean Martin (128%)</strong><br/>
            <strong className="text-green-700 dark:text-green-400">• Sophie Bernard (130%)</strong>
          </div>
          <div className="text-base text-foreground leading-relaxed">
            <strong className="text-green-700 dark:text-green-400">✨ CE QU'IL FAUT FAIRE :</strong><br/>
            → Continue comme ça !<br/>
            → Utilise-le en exemple<br/>
            → Récompense sa performance
          </div>
        </div>

        {/* Encadré BLEU : Bon */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-l-[6px] border-blue-500 rounded-2xl p-5">
          <div className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">
            👍 BON (110-125%)
          </div>
          <div className="text-base leading-relaxed text-foreground mb-4">
            <strong>C'EST QUOI ?</strong><br/>
            L'employé est rentable, il vend plus qu'il ne coûte. C'est BIEN mais peut mieux faire.
          </div>
          <div className="bg-white dark:bg-background/50 rounded-xl p-4 mb-4">
            <div className="text-sm text-muted-foreground mb-2">👤 Exemples :</div>
            <strong className="text-blue-600 dark:text-blue-400">• Pierre Dupont (124%)</strong><br/>
            <strong className="text-blue-600 dark:text-blue-400">• Julie Moreau (120%)</strong>
          </div>
          <div className="text-base text-foreground leading-relaxed">
            <strong className="text-blue-600 dark:text-blue-400">🎯 CE QU'IL FAUT FAIRE :</strong><br/>
            → Encourage-le à viser 130%<br/>
            → Vérifie s'il perd du temps<br/>
            → Formation pour améliorer
          </div>
        </div>

        {/* Encadré ORANGE : À améliorer */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-l-[6px] border-orange-500 rounded-2xl p-5">
          <div className="text-xl font-bold mb-3 text-orange-600 dark:text-orange-400">
            ⚠️ À AMÉLIORER (&lt;110%)
          </div>
          <div className="text-base leading-relaxed text-foreground mb-4">
            <strong>C'EST QUOI ?</strong><br/>
            L'employé ne vend pas assez d'heures. <strong className="text-red-600">ATTENTION !</strong>
          </div>
          <div className="bg-white dark:bg-background/50 rounded-xl p-4 mb-4">
            <div className="text-sm text-muted-foreground mb-2">👤 Exemples :</div>
            <strong className="text-orange-600 dark:text-orange-400">• Marc Leblanc (108%)</strong><br/>
            <strong className="text-red-600 dark:text-red-400">• Luc Garnier (107%) ⚠️ CRITIQUE</strong>
          </div>
          <div className="text-base text-foreground leading-relaxed">
            <strong className="text-red-600 dark:text-red-400">🚨 CE QU'IL FAUT FAIRE :</strong><br/>
            → Parle avec lui<br/>
            → Formation urgente<br/>
            → Impact sur la rentabilité !
          </div>
        </div>
      </div>

      {/* Résumé */}
      <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl p-6 text-white">
        <div className="text-2xl font-bold mb-5 text-center">
          💡 COMMENT LIRE CE TABLEAU EN 10 SECONDES
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-lg leading-relaxed mb-5">
          <div>
            <strong className="text-xl">1️⃣</strong> Regarde <strong>"Productivité"</strong>
          </div>
          <div>
            <strong className="text-xl">2️⃣</strong> Si <strong>&gt;125% = 🟢 Super !</strong>
          </div>
          <div>
            <strong className="text-xl">3️⃣</strong> Si <strong>110-125% = 🔵 Bien</strong>
          </div>
          <div>
            <strong className="text-xl">4️⃣</strong> Si <strong>&lt;110% = 🟠 ATTENTION !</strong>
          </div>
        </div>
        <div className="p-4 bg-white/20 rounded-xl text-center text-lg">
          <strong>🎯 OBJECTIF :</strong> Tous tes employés doivent être au MINIMUM à 120% pour que ton atelier soit vraiment rentable !
        </div>
      </div>
    </div>
  );
};
