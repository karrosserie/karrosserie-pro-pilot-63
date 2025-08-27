import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface CreateUserResult {
  email: string;
  success: boolean;
  error?: string;
  userId?: string;
  role?: string;
}

export default function AdminCreateUsers() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CreateUserResult[]>([]);

  const createTestUsers = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-test-users');
      
      if (error) {
        toast({
          title: "Erreur",
          description: `Erreur lors de l'appel de la fonction: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (data?.success) {
        setResults(data.results || []);
        toast({
          title: "Succès",
          description: `${data.results?.filter((r: CreateUserResult) => r.success).length || 0} utilisateurs créés avec succès`,
          variant: "default",
        });
      } else {
        toast({
          title: "Erreur",
          description: data?.error || "Erreur inconnue",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création des utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Administration - Création des utilisateurs de test</CardTitle>
            <CardDescription>
              Créer les 4 utilisateurs de test avec leurs rôles respectifs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Utilisateurs à créer :</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• carrossier@gmail.com (Carrossier)</li>
                <li>• carrossiercourtois@gmail.com (Carrossier-vehicule de courtoisie)</li>
                <li>• responsable@gmail.com (Responsable)</li>
                <li>• responsableadmin@gmail.com (Responsable administratif)</li>
              </ul>
            </div>

            <Button 
              onClick={createTestUsers} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                'Créer les utilisateurs de test'
              )}
            </Button>

            {results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Résultats :</h3>
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        result.success 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span className="font-medium">{result.email}</span>
                        {result.role && (
                          <span className="text-xs px-2 py-1 rounded bg-white bg-opacity-50">
                            {result.role}
                          </span>
                        )}
                      </div>
                      {result.error && (
                        <span className="text-xs">{result.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Instructions :</h4>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Cliquez sur le bouton pour créer tous les utilisateurs</li>
                <li>2. Attendez que la création soit terminée</li>
                <li>3. Vérifiez les résultats ci-dessus</li>
                <li>4. Vous pouvez maintenant vous connecter avec l'un des comptes créés</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}