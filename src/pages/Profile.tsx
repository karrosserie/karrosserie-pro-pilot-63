
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService, Profile } from '@/services/supabase/profiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { PersonalInfoDisplay } from '@/components/profile/PersonalInfoDisplay';
import { SecurityTab } from '@/components/profile/SecurityTab';

const ProfilePage = () => {
  const { user, profile, updateProfileState } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const onSave = async (data: Partial<Profile>) => {
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
              <ProfileHeader profile={profile} user={user} />
              
              {isEditing ? (
                <PersonalInfoForm
                  profile={profile}
                  onSave={onSave}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <PersonalInfoDisplay
                  profile={profile}
                  onEdit={() => setIsEditing(true)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
