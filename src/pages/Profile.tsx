
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
import { User, Phone, MapPin } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({
  first_name: z.string().min(1, { message: "Le prénom est requis" }),
  last_name: z.string().min(1, { message: "Le nom est requis" }),
  phone_number: z.string().min(1, { message: "Le numéro de téléphone est requis" }),
  address: z.string().min(1, { message: "L'adresse est requise" }),
  city: z.string().min(1, { message: "La ville est requise" }),
  postal_code: z.string().min(1, { message: "Le code postal est requis" }),
  country: z.string().min(1, { message: "Le pays est requis" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, profile, updateProfileState } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone_number: profile?.phone_number || '',
      address: profile?.address || '',
      city: profile?.city || '',
      postal_code: profile?.postal_code || '',
      country: profile?.country || '',
    },
    mode: 'onChange',
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Prénom</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Prénom" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Nom</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nom" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Numéro de téléphone</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input {...field} placeholder="Numéro de téléphone" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                      <h3 className="text-md font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Adresse postale
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Adresse</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Adresse" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Ville</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ville" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postal_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel required>Code postal</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Code postal" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel required>Pays</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Pays" defaultValue="France" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                </Form>
              ) : (
                <div className="space-y-6">
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
                  
                  <div>
                    <label className="block text-sm mb-2">Numéro de téléphone</label>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {profile?.phone_number || '-'}
                    </p>
                  </div>

                  <div className="border p-4 rounded-md bg-gray-50">
                    <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Adresse postale
                    </h3>
                    <div className="space-y-2">
                      <p>{profile?.address || '-'}</p>
                      <p>
                        {profile?.postal_code ? `${profile.postal_code} ` : ''}
                        {profile?.city || '-'}
                      </p>
                      <p>{profile?.country || '-'}</p>
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
