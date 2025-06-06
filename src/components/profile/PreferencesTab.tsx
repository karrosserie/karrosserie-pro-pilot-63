
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const PreferencesTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Préférences</CardTitle>
        <CardDescription>
          Personnalisez votre expérience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Options de personnalisation à venir dans une prochaine mise à jour.
        </p>
      </CardContent>
    </Card>
  );
};
