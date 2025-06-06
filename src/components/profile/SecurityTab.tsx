
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const SecurityTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité</CardTitle>
        <CardDescription>
          Gérez vos paramètres de sécurité et de connexion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Options de sécurité à venir dans une prochaine mise à jour.
        </p>
      </CardContent>
    </Card>
  );
};
