
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RelanceTableData {
  facture: string;
  client: string;
  projet: string;
  montant: string;
  echeance: string;
  statut: string;
  relanceType: string;
  moyens: string[];
  prochaineAction: string;
}

const RelanceTable: React.FC = () => {
  const relances: RelanceTableData[] = [
    {
      facture: 'F-2023-124',
      client: 'Durand Auto',
      projet: 'OR-007-142',
      montant: '2 450,75 €',
      echeance: '10/04/2025',
      statut: 'En retard',
      relanceType: 'Relance 1',
      moyens: ['SMS', 'Email', 'Courrier', 'Recommandé'],
      prochaineAction: '19/05/2025'
    },
    {
      facture: 'F-2023-122',
      client: 'Martin SARL',
      projet: 'OR-007-139',
      montant: '3 825,5 €',
      echeance: '05/04/2025',
      statut: 'En retard',
      relanceType: 'Relance 2',
      moyens: ['SMS', 'Email', 'Courrier', 'Recommandé'],
      prochaineAction: '17/05/2025'
    },
    {
      facture: 'F-2023-120',
      client: 'Dubois et Fils',
      projet: 'OR-007-135',
      montant: '6 120,25 €',
      echeance: '28/03/2025',
      statut: 'En retard',
      relanceType: 'Relance 3',
      moyens: ['SMS', 'Email', 'Courrier', 'Recommandé'],
      prochaineAction: '12/05/2025'
    },
    {
      facture: 'F-2023-118',
      client: 'Garage Central',
      projet: 'OR-007-129',
      montant: '4 250 €',
      echeance: '15/03/2025',
      statut: 'En retard',
      relanceType: 'Relance 4',
      moyens: ['SMS', 'Email', 'Courrier', 'Recommandé'],
      prochaineAction: '08/05/2025'
    },
    {
      facture: 'F-2023-116',
      client: 'Auto Service Plus',
      projet: 'OR-007-122',
      montant: '7 890 €',
      echeance: '01/03/2025',
      statut: 'En retard',
      relanceType: 'Contentieux',
      moyens: ['SMS', 'Email', 'Courrier', 'Recommandé'],
      prochaineAction: '01/05/2025'
    }
  ];

  const getRelanceBadgeColor = (type: string) => {
    switch (type) {
      case 'Relance 1': return 'bg-blue-500 hover:bg-blue-600';
      case 'Relance 2': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Relance 3': return 'bg-orange-500 hover:bg-orange-600';
      case 'Relance 4': return 'bg-red-500 hover:bg-red-600';
      case 'Contentieux': return 'bg-red-700 hover:bg-red-800';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getMoyenColor = (moyen: string) => {
    switch (moyen) {
      case 'SMS': return 'bg-green-500 hover:bg-green-600';
      case 'Email': return 'bg-blue-500 hover:bg-blue-600';
      case 'Courrier': return 'bg-purple-500 hover:bg-purple-600';
      case 'Recommandé': return 'bg-orange-500 hover:bg-orange-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-800">Vue tableau</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="text-gray-700 font-medium">Facture</TableHead>
                <TableHead className="text-gray-700 font-medium">Client</TableHead>
                <TableHead className="text-gray-700 font-medium">Projet</TableHead>
                <TableHead className="text-gray-700 font-medium">Montant</TableHead>
                <TableHead className="text-gray-700 font-medium">Échéance</TableHead>
                <TableHead className="text-gray-700 font-medium">Statut</TableHead>
                <TableHead className="text-gray-700 font-medium">Relances</TableHead>
                <TableHead className="text-gray-700 font-medium">Prochaine action</TableHead>
                <TableHead className="text-gray-700 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relances.map((relance, index) => (
                <TableRow key={index} className="border-gray-200 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-800">{relance.facture}</TableCell>
                  <TableCell className="text-gray-700">{relance.client}</TableCell>
                  <TableCell className="text-gray-700">{relance.projet}</TableCell>
                  <TableCell className="text-gray-800 font-medium">{relance.montant}</TableCell>
                  <TableCell className="text-gray-700">{relance.echeance}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{relance.statut}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge className={`${getRelanceBadgeColor(relance.relanceType)} text-white w-fit`}>
                        {relance.relanceType}
                      </Badge>
                      <div className="flex gap-1">
                        {relance.moyens.map((moyen, moyenIndex) => (
                          <Badge 
                            key={moyenIndex} 
                            className={`${getMoyenColor(moyen)} text-white text-xs`}
                          >
                            {moyen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{relance.prochaineAction}</TableCell>
                  <TableCell>
                    <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white">
                      Actions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelanceTable;
