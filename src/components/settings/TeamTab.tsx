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
import { Plus, Edit, UserX, Crown, User, Trash2, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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
  role: z.enum(['owner', 'manager', 'reservation_manager', 'inventory_manager']),
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
  role: z.enum(['owner', 'manager', 'reservation_manager', 'inventory_manager']),
  active: z.boolean()
});

type EditMemberFormValues = z.infer<typeof editMemberSchema>;

const TeamTab = () => {
  const { companyInfo, isLoading } = useCompany();
  const { signUp } = useAuth();
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
      role: "manager",
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
      role: "manager",
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

    if (error) {
      console.error('Error fetching team members:', error);
      toast.error('Erreur lors du chargement de l\'équipe');
    } else {
      // Fetch profile data separately for each user
      const membersWithProfiles = await Promise.all(
        (data || []).map(async (member) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, email, phone_number')
            .eq('id', member.user_id)
            .single();
          
          return {
            ...member,
            profiles: profile
          };
        })
      );
      setTeamMembers(membersWithProfiles);
    }
  };

  const handleAddMember = async (data: AddMemberFormValues) => {
    if (!companyInfo?.id) return;

    setIsSubmitting(true);

    try {
      // Créer l'utilisateur avec Supabase Auth
      const { user } = await signUp(data.email, data.password, data.firstName, data.lastName, data.phoneNumber);
      
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
        toast.error('Erreur lors de l\'ajout du membre à l\'équipe');
      } else {
        toast.success('Membre ajouté avec succès');
        setIsAddDialogOpen(false);
        addForm.reset();
        fetchTeamMembers();
      }
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast.error('Erreur lors de la création du membre');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMember = async (data: EditMemberFormValues) => {
    if (!editingMember) return;

    setIsSubmitting(true);

    try {
      // Mettre à jour le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_number: data.phoneNumber
        })
        .eq('id', editingMember.user_id);

      if (profileError) {
        toast.error('Erreur lors de la mise à jour du profil');
        return;
      }

      // Mettre à jour le rôle et le statut
      const { error: roleError } = await supabase
        .from('user_companies')
        .update({ 
          role: data.role,
          active: data.active
        })
        .eq('id', editingMember.id);

      if (roleError) {
        toast.error('Erreur lors de la mise à jour du membre');
      } else {
        toast.success('Membre mis à jour avec succès');
        setIsEditDialogOpen(false);
        setEditingMember(null);
        editForm.reset();
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error('Erreur lors de la mise à jour du membre');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre de l\'équipe ?')) {
      return;
    }

    const { error } = await supabase
      .from('user_companies')
      .delete()
      .eq('id', memberId);

    if (error) {
      toast.error('Erreur lors de la suppression du membre');
    } else {
      toast.success('Membre supprimé de l\'équipe');
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
      role: member.role as 'owner' | 'manager' | 'reservation_manager' | 'inventory_manager',
      active: member.active
    });
    setIsEditDialogOpen(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4" />;
      case 'manager': return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Propriétaire';
      case 'manager': return 'Responsable';
      case 'reservation_manager': return 'Gestionnaire de réservation';
      case 'inventory_manager': return 'Gestionnaire d\'inventaire';
      default: return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'owner' ? 'default' : 'secondary';
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
              <Plus className="h-4 w-4 mr-2" />
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
                          <option value="manager">Responsable</option>
                          <option value="reservation_manager">Gestionnaire de réservation</option>
                          <option value="inventory_manager">Gestionnaire d'inventaire</option>
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
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {member.role !== 'owner' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
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
                        <option value="manager">Responsable</option>
                        <option value="reservation_manager">Gestionnaire de réservation</option>
                        <option value="inventory_manager">Gestionnaire d'inventaire</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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