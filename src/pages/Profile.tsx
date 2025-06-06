
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService, Profile } from '@/services/supabase/profiles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const { user, profile, updateProfileState } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Profile>({
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
    }
  });

  const onSubmit = async (data: Partial<Profile>) => {
    if (!user) return;
    
    try {
      const updatedProfile = await profileService.updateProfile(user.id, data);
      // Update the profile state in AuthContext
      if (updatedProfile) {
        updateProfileState(updatedProfile);
      }
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
        variant: "default",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de la mise à jour de votre profil.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-2xl font-bold mb-8">Mon profil</h1>
      
      <Tabs defaultValue="personal">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et comment elles sont affichées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-primary text-xl">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-lg font-medium">
                    {profile?.first_name} {profile?.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Prénom</label>
                      <Input
                        {...register('first_name')}
                        placeholder="Prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Nom</label>
                      <Input
                        {...register('last_name')}
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">Enregistrer</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Prénom</label>
                      <p>{profile?.first_name || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Nom</label>
                      <p>{profile?.last_name || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setIsEditing(true)}
                    >
                      Modifier
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
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
        </TabsContent>
        
        <TabsContent value="preferences">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
