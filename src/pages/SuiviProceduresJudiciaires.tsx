import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

const SuiviProceduresJudiciaires = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Eye className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suivi des procédures judiciaires</h1>
          <p className="text-muted-foreground">Suivez l'avancement de vos procédures judiciaires</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Suivi des procédures</CardTitle>
            <CardDescription>
              Consultez l'état d'avancement de vos procédures judiciaires en cours
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

export default SuiviProceduresJudiciaires;