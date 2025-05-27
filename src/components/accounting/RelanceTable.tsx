
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
    <Card>
      <CardHeader>
        <CardTitle>Vue tableau</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Relances</TableHead>
              <TableHead>Prochaine action</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relances.map((relance, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{relance.facture}</TableCell>
                <TableCell>{relance.client}</TableCell>
                <TableCell>{relance.projet}</TableCell>
                <TableCell>{relance.montant}</TableCell>
                <TableCell>{relance.echeance}</TableCell>
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
                <TableCell>{relance.prochaineAction}</TableCell>
                <TableCell>
                  <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                    Actions
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RelanceTable;
