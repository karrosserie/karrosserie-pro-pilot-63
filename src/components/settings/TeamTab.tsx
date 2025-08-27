import React, { useState } from 'react';
import { useCompany } from '@/hooks/use-company';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CustomPhoneInput } from '@/components/ui/custom-phone-input';
import { Plus, Pencil, UserX, Crown, User, Trash, Users, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from '@/hooks/use-confirmation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  active: boolean;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
  };
}

// Schema pour ajouter un nouveau membre
const addMemberSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  phoneNumber: z.string().refine((phone) => {
    if (!phone) return false;
    return isValidPhoneNumber(phone);
  }, "Veuillez entrer un numéro de téléphone valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(['Propriétaire', 'Carrossier', 'Carrossier-vehicule de courtoisie', 'Responsable', 'Responsable administratif']),
  active: z.boolean().default(true)
});

type AddMemberFormValues = z.infer<typeof addMemberSchema>;

// Schema pour modifier un membre existant
const editMemberSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  phoneNumber: z.string().refine((phone) => {
    if (!phone) return false;
    return isValidPhoneNumber(phone);
  }, "Veuillez entrer un numéro de téléphone valide"),
  role: z.enum(['Propriétaire', 'Carrossier', 'Carrossier-vehicule de courtoisie', 'Responsable', 'Responsable administratif']),
  active: z.boolean()
});

type EditMemberFormValues = z.infer<typeof editMemberSchema>;

const TeamTab = () => {
  const { companyInfo, isLoading } = useCompany();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const { confirm } = useConfirmation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addForm = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "Carrossier",
      active: true
    }
  });

  const editForm = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: "Carrossier",
      active: true
    }
  });

  React.useEffect(() => {
    if (companyInfo?.id) {
      fetchTeamMembers();
    }
  }, [companyInfo?.id]);

  const fetchTeamMembers = async () => {
    if (!companyInfo?.id) return;

    console.log('Fetching team members for company:', companyInfo.id);

    const { data, error } = await supabase
      .from('user_companies')
      .select(`
        id,
        user_id,
        role,
        active,
        created_at
      `)
      .eq('company_id', companyInfo.id);

    console.log('User companies data:', { data, error });

    if (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement de l'équipe",
        variant: "destructive"
      });
    } else {
      // Fetch profile data separately for each user
      const membersWithProfiles = await Promise.all(
        (data || []).map(async (member) => {
          console.log('Fetching profile for user:', member.user_id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email, phone_number')
            .eq('id', member.user_id)
            .single();
          
          console.log('Profile data for', member.user_id, ':', { profile, profileError });
          
          return {
            ...member,
            profiles: profile || null
          };
        })
      );
      
      console.log('Final team members with profiles:', membersWithProfiles);
      setTeamMembers(membersWithProfiles);
    }
  };

  const handleAddMember = async (data: AddMemberFormValues) => {
    console.log('handleAddMember called with data:', data);
    if (!companyInfo?.id) return;

    setIsSubmitting(true);

    try {
      console.log('Calling signUp...');
      // Créer l'utilisateur avec Supabase Auth
      const { user } = await signUp(data.email, data.password, data.firstName, data.lastName, data.phoneNumber);
      console.log('SignUp completed, user:', user);
      
      console.log('Adding user to team...');
      // Ajouter l'utilisateur à l'équipe
      const { error } = await supabase
        .from('user_companies')
        .insert({
          user_id: user.id,
          company_id: companyInfo.id,
          role: data.role,
          active: data.active
        });

      if (error) {
        console.error('Error adding member to team:', error);
        toast({
          title: "Erreur",
          description: "Erreur lors de l'ajout du membre à l'équipe",
          variant: "destructive"
        });
      } else {
        console.log('Member added successfully, closing dialog and refreshing...');
        setIsAddDialogOpen(false);
        addForm.reset();
        fetchTeamMembers();
      }
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du membre",
        variant: "destructive"
      });
    } finally {
      console.log('handleAddMember completed');
      setIsSubmitting(false);
    }
  };

  const handleEditMember = async (data: EditMemberFormValues) => {
    if (!editingMember) return;

    // Empêcher la désactivation d'un propriétaire
    if (editingMember.role === 'Propriétaire' && !data.active) {
      toast({
        title: "Erreur",
        description: "Un propriétaire ne peut pas être désactivé",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Tentative de mise à jour du membre:', {
        memberId: editingMember.id,
        userId: editingMember.user_id,
        currentData: editingMember.profiles,
        newData: data
      });

      // Utiliser la edge function pour mettre à jour l'utilisateur
      const { data: session } = await supabase.auth.getSession();
      
      const response = await fetch(`https://jukdsypvuehnniskgpfd.supabase.co/functions/v1/update-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session?.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2RzeXB2dWVobm5pc2tncGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTA5MTIsImV4cCI6MjA2MzU2NjkxMn0.fJcqL0Sg_x7AXacC6lhqic-VWhvI46D3tFgRcpgchxo',
        },
        body: JSON.stringify({
          userId: editingMember.user_id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
          active: data.active,
          userCompanyId: editingMember.id
        }),
      });

      const result = await response.json();
      console.log('Résultat edge function:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }

      toast({
        title: "Succès",
        description: "Membre mis à jour avec succès"
      });
      setIsEditDialogOpen(false);
      setEditingMember(null);
      editForm.reset();
      fetchTeamMembers();
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du membre",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    const confirmed = await confirm({
      title: 'Confirmation',
      description: 'Êtes-vous sûr de vouloir supprimer ce membre de l\'équipe ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      variant: 'destructive'
    });
    
    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from('user_companies')
      .delete()
      .eq('id', memberId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du membre",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Membre supprimé de l'équipe"
      });
      fetchTeamMembers();
    }
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    editForm.reset({
      firstName: member.profiles?.first_name || '',
      lastName: member.profiles?.last_name || '',
      email: member.profiles?.email || '',
      phoneNumber: member.profiles?.phone_number || '',
      role: member.role as 'Propriétaire' | 'Carrossier' | 'Carrossier-vehicule de courtoisie' | 'Responsable' | 'Responsable administratif',
      active: member.active
    });
    setIsEditDialogOpen(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Propriétaire': return <Crown className="h-4 w-4" />;
      case 'Carrossier': return <User className="h-4 w-4" />;
      case 'Carrossier-vehicule de courtoisie': return <User className="h-4 w-4" />;
      case 'Responsable': return <Users className="h-4 w-4" />;
      case 'Responsable administratif': return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    // Les rôles sont déjà dans le bon format
    return role;
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'Propriétaire' ? 'default' : 'secondary';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">Gestion de l'équipe</h3>
          <p className="text-sm text-muted-foreground">
            Gérez les membres de votre équipe et leurs accès.
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un membre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau membre</DialogTitle>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit(handleAddMember)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemple.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de téléphone</FormLabel>
                      <FormControl>
                        <CustomPhoneInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Numéro de téléphone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Mot de passe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                          <option value="Carrossier">Carrossier</option>
                          <option value="Carrossier-vehicule de courtoisie">Carrossier-véhicule de courtoisie</option>
                          <option value="Responsable">Responsable</option>
                          <option value="Responsable administratif">Responsable administratif</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Membre actif
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Activez ou désactivez ce membre
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                    {isSubmitting ? 'Ajout...' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Membres de l'équipe ({teamMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {getRoleIcon(member.role)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.profiles?.first_name && member.profiles?.last_name
                        ? `${member.profiles.first_name} ${member.profiles.last_name}`
                        : member.profiles?.email || 'Utilisateur'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.profiles?.email}
                    </p>
                    {member.profiles?.phone_number && (
                      <p className="text-sm text-muted-foreground">
                        {member.profiles.phone_number}
                      </p>
                    )}
                  </div>
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {getRoleLabel(member.role)}
                  </Badge>
                  {!member.active && (
                    <Badge variant="destructive">
                      Désactivé
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(member)}
                    className="hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {member.role !== 'Propriétaire' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {teamMembers.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Aucun membre dans l'équipe
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le membre</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditMember)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <CustomPhoneInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Numéro de téléphone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {editingMember?.role !== 'Propriétaire' && (
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <FormControl>
                          <select
                           {...field}
                           className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                         >
                           <option value="Carrossier">Carrossier</option>
                           <option value="Carrossier-vehicule de courtoisie">Carrossier-véhicule de courtoisie</option>
                           <option value="Responsable">Responsable</option>
                           <option value="Responsable administratif">Responsable administratif</option>
                         </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {editingMember?.role !== 'Propriétaire' && (
                <FormField
                  control={editForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Membre actif
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Activez ou désactivez ce membre
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
                  {isSubmitting ? 'Modification...' : 'Modifier'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamTab;