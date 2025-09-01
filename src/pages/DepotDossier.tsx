import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const DepotDossier = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dépôt de dossier</h1>
          <p className="text-muted-foreground">Gérez les dépôts de dossiers judiciaires</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dépôt de dossier</CardTitle>
            <CardDescription>
              Effectuez le dépôt de vos dossiers auprès des instances judiciaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Fonctionnalité en cours de développement...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepotDossier;