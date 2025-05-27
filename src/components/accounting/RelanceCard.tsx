
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
      case 'Relance 1': return 'bg-blue-500';
      case 'Relance 2': return 'bg-yellow-500';
      case 'Relance 3': return 'bg-orange-500';
      case 'Relance 4': return 'bg-red-500';
      case 'Contentieux': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  const getMoyenColor = (moyen: string) => {
    switch (moyen) {
      case 'SMS': return 'bg-green-500';
      case 'Email': return 'bg-blue-500';
      case 'Courrier': return 'bg-purple-500';
      case 'Recommandé': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="bg-gray-800 text-white border-gray-700">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{factureNumber}</h3>
              <Badge className={`${getRelanceBadgeColor(relanceType)} text-white`}>
                {relanceType}
              </Badge>
            </div>
            <p className="text-gray-300">{client}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{amount}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-400">Projet</p>
            <p className="text-white">{project}</p>
            <p className="text-gray-400">{projectRef}</p>
          </div>
          <div>
            <p className="text-gray-400">Échéance</p>
            <p className="text-white">{echeance}</p>
          </div>
          <div>
            <p className="text-gray-400">Banque</p>
            <p className="text-white">{banque}</p>
          </div>
          <div>
            <p className="text-gray-400">Prochaine action</p>
            <p className="text-white">{prochaine}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Moyens de relance utilisés :</p>
          <div className="flex gap-2">
            {moyensUtilises.map((moyen, index) => (
              <Badge key={index} className={`${getMoyenColor(moyen)} text-white text-xs`}>
                {moyen}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">Dernière relance: {derniereRelance}</p>
          <Button className="bg-gray-700 hover:bg-gray-600 text-white">
            Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelanceCard;
