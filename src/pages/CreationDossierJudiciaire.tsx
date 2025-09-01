import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from "lucide-react";

const CreationDossierJudiciaire = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Création d'un dossier judiciaire</h1>
          <p className="text-muted-foreground">Créez et gérez vos dossiers judiciaires</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nouveau dossier judiciaire</CardTitle>
            <CardDescription>
              Créez un nouveau dossier pour une procédure judiciaire
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

export default CreationDossierJudiciaire;