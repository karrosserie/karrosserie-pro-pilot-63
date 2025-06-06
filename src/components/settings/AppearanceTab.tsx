
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AppearanceTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personnalisation de l'interface</CardTitle>
        <CardDescription>
          Personnalisez l'apparence et le comportement de l'application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode">Mode sombre</Label>
              <p className="text-sm text-gray-500">
                Activer le mode sombre pour réduire la fatigue oculaire.
              </p>
            </div>
            <Switch id="darkMode" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="animations">Animations</Label>
              <p className="text-sm text-gray-500">
                Activer les animations dans l'interface utilisateur.
              </p>
            </div>
            <Switch id="animations" defaultChecked />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="colorTheme">Couleur principale</Label>
            <div className="grid grid-cols-6 gap-2">
              <Button type="button" className="bg-orange-500 hover:bg-orange-600 h-8 w-8 p-0 rounded-full" />
              <Button type="button" className="bg-blue-500 hover:bg-blue-600 h-8 w-8 p-0 rounded-full" />
              <Button type="button" className="bg-green-500 hover:bg-green-600 h-8 w-8 p-0 rounded-full" />
              <Button type="button" className="bg-purple-500 hover:bg-purple-600 h-8 w-8 p-0 rounded-full" />
              <Button type="button" className="bg-red-500 hover:bg-red-600 h-8 w-8 p-0 rounded-full" />
              <Button type="button" className="bg-gray-500 hover:bg-gray-600 h-8 w-8 p-0 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceTab;
