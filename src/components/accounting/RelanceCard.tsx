
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RelanceCardProps {
  factureNumber: string;
  client: string;
  amount: string;
  project: string;
  projectRef: string;
  echeance: string;
  prochaine: string;
  banque: string;
  relanceType: 'Relance 1' | 'Relance 2' | 'Relance 3' | 'Relance 4' | 'Contentieux';
  moyensUtilises: string[];
  derniereRelance: string;
}

const RelanceCard: React.FC<RelanceCardProps> = ({
  factureNumber,
  client,
  amount,
  project,
  projectRef,
  echeance,
  prochaine,
  banque,
  relanceType,
  moyensUtilises,
  derniereRelance
}) => {
  const getRelanceBadgeColor = (type: string) => {
    switch (type) {
      case 'Relance 1': return 'bg-blue-600 hover:bg-blue-700';
      case 'Relance 2': return 'bg-amber-600 hover:bg-amber-700';
      case 'Relance 3': return 'bg-orange-600 hover:bg-orange-700';
      case 'Relance 4': return 'bg-red-600 hover:bg-red-700';
      case 'Contentieux': return 'bg-red-800 hover:bg-red-900';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getMoyenColor = (moyen: string) => {
    switch (moyen) {
      case 'SMS': return 'bg-green-600 hover:bg-green-700';
      case 'Email': return 'bg-blue-600 hover:bg-blue-700';
      case 'Courrier': return 'bg-purple-600 hover:bg-purple-700';
      case 'Recommandé': return 'bg-orange-600 hover:bg-orange-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{factureNumber}</h3>
              <Badge className={`${getRelanceBadgeColor(relanceType)} text-white border-0`}>
                {relanceType}
              </Badge>
            </div>
            <p className="text-gray-600 font-medium">{client}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-karrosserie-orange">{amount}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500 font-medium mb-1">Projet</p>
            <p className="text-gray-800 font-medium">{project}</p>
            <p className="text-gray-500">{projectRef}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Échéance</p>
            <p className="text-gray-800 font-medium">{echeance}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Banque</p>
            <p className="text-gray-800">{banque}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium mb-1">Prochaine action</p>
            <p className="text-gray-800 font-medium">{prochaine}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-500 font-medium text-sm mb-2">Moyens de relance utilisés :</p>
          <div className="flex gap-2 flex-wrap">
            {moyensUtilises.map((moyen, index) => (
              <Badge key={index} className={`${getMoyenColor(moyen)} text-white text-xs border-0`}>
                {moyen}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">Dernière relance: <span className="font-medium text-gray-700">{derniereRelance}</span></p>
          <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white">
            Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelanceCard;
