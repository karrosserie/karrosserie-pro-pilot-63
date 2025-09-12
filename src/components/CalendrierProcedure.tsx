import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CalendrierProcedure = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const procedureData = [
    { jour: "J+0", phase: "DÉPÔT", formalite: "Envoi dossier complet au RAR", responsable: "Entreprise", delai: "Immédiat", cout: "5€ (RAR)" },
    { jour: "J+2", phase: "RÉCEPTION", formalite: "Réception greffe + tampon date", responsable: "Tribunal", delai: "-", cout: "-" },
    { jour: "J+3 à J+8", phase: "PHASE 1", formalite: "Enregistrement au RG + numéro", responsable: "Greffier", delai: "3-5 jours", cout: "-" },
    { jour: "J+8 à J+10", phase: "PHASE 1", formalite: "Attribution juge compétent", responsable: "Tribunal", delai: "2-5 jours", cout: "-" },
    { jour: "J+8 à J+15", phase: "PHASE 1", formalite: "Accusé réception greffe", responsable: "Greffier", delai: "8-15 jours", cout: "-" },
    { jour: "J+10 à J+20", phase: "PHASE 1", formalite: "Contrôle recevabilité", responsable: "Greffier", delai: "Variable", cout: "-" },
    { jour: "", phase: "", formalite: "» Vérification compétence territoriale", responsable: "", delai: "", cout: "" },
    { jour: "", phase: "", formalite: "» Contrôle exhaustivité pièces", responsable: "", delai: "", cout: "" },
    { jour: "", phase: "", formalite: "» Vérification paiement 38€", responsable: "", delai: "", cout: "" },
    { jour: "J+15 à J+25", phase: "PHASE 1", formalite: "Décision recevabilité", responsable: "Greffier", delai: "5-10 jours", cout: "-", acceptation: true },
    { jour: "J+20 à J+30", phase: "PHASE 2", formalite: "Transmission au juge", responsable: "Greffe ➜ Juge", delai: "5-10 jours", cout: "-" },
    { jour: "J+25 à J+65", phase: "PHASE 2", formalite: "INSTRUCTION SUR PIÈCES", responsable: "Juge", delai: "15j-6sem", cout: "-" },
    { jour: "", phase: "", formalite: "Art. 1405 CPC - Examen au fond", responsable: "", delai: "", cout: "" },
    { jour: "", phase: "", formalite: "» Créance certaine ?", responsable: "", delai: "", cout: "" },
    { jour: "", phase: "", formalite: "» Créance liquide ?", responsable: "", delai: "", cout: "" },
    { jour: "", phase: "", formalite: "» Créance exigible ?", responsable: "", delai: "", cout: "" },
    { jour: "", phase: "", formalite: "» Justificatifs conformes ?", responsable: "", delai: "", cout: "" },
    { jour: "J+65 à J+75", phase: "PHASE 3", formalite: "DÉCISION RENDUE", responsable: "Juge", delai: "Variable", cout: "-" },
    { jour: "", phase: "", formalite: "Rédaction minute d'ordonnance", responsable: "", delai: "", cout: "" },
    { jour: "J+75 à J+85", phase: "PHASE 3", formalite: "Transmission greffe + signature", responsable: "Juge ➜ Greffe", delai: "5-10 jours", cout: "-" },
    { jour: "J+85", phase: "NOTIFICATION", formalite: "ORDONNANCE DISPONIBLE", responsable: "Greffe", delai: "-", cout: "-", final: true }
  ];

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        size="lg"
        className="w-full justify-between text-lg font-semibold"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Calendrier précis - Procédure Tribunal
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </Button>

      {isExpanded && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-3 font-semibold text-slate-700 border-r">JOUR</th>
                  <th className="text-left p-3 font-semibold text-slate-700 border-r">PHASE</th>
                  <th className="text-left p-3 font-semibold text-slate-700 border-r">FORMALITÉ/ACTION</th>
                  <th className="text-left p-3 font-semibold text-slate-700 border-r">RESPONSABLE</th>
                  <th className="text-left p-3 font-semibold text-slate-700 border-r">DÉLAI</th>
                  <th className="text-left p-3 font-semibold text-slate-700">COÛT</th>
                </tr>
              </thead>
              <tbody>
                {procedureData.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-b hover:bg-slate-50 ${
                      item.acceptation ? 'bg-green-50' : 
                      item.final ? 'bg-blue-50' : 
                      item.formalite.startsWith('»') ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="p-3 border-r font-medium text-slate-900">{item.jour}</td>
                    <td className="p-3 border-r">
                      {item.phase && (
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          item.phase === 'DÉPÔT' ? 'bg-blue-100 text-blue-800' :
                          item.phase === 'RÉCEPTION' ? 'bg-green-100 text-green-800' :
                          item.phase === 'PHASE 1' ? 'bg-orange-100 text-orange-800' :
                          item.phase === 'PHASE 2' ? 'bg-purple-100 text-purple-800' :
                          item.phase === 'PHASE 3' ? 'bg-red-100 text-red-800' :
                          item.phase === 'NOTIFICATION' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {item.phase}
                        </span>
                      )}
                    </td>
                    <td className="p-3 border-r">
                      <div className={`${item.formalite.startsWith('»') ? 'text-sm text-slate-600 ml-4' : 'font-medium text-slate-900'}`}>
                        {item.formalite}
                      </div>
                      {item.acceptation && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-green-600 font-medium">✅ Acceptation</span>
                          <span className="text-red-500 font-medium">OU ❌ Régularisation</span>
                        </div>
                      )}
                      {item.final && (
                        <div className="mt-1">
                          <span className="text-red-600 font-medium">📞 APPEL ENTREPRISE</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 border-r text-slate-700">{item.responsable}</td>
                    <td className="p-3 border-r text-slate-700">{item.delai}</td>
                    <td className="p-3 text-slate-700">{item.cout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendrierProcedure;