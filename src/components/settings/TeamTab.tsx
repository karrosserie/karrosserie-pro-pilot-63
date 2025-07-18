import React, { useState } from 'react';
import { useCompany } from '@/hooks/use-company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, UserX, Crown, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  expires_at: string;
}

const TeamTab = () => {
  const { companyInfo, isLoading } = useCompany();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isInviting, setIsInviting] = useState(false);

  React.useEffect(() => {
    if (companyInfo?.id) {
      fetchTeamMembers();
      fetchInvitations();
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
            .select('first_name, last_name, email')
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

  const fetchInvitations = async () => {
    if (!companyInfo?.id) return;

    const { data, error } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('company_id', companyInfo.id)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching invitations:', error);
    } else {
      setInvitations(data || []);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail || !companyInfo?.id) return;

    setIsInviting(true);

    try {
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          email: inviteEmail,
          company_id: companyInfo.id,
          invited_by: (await supabase.auth.getUser()).data.user?.id,
          role: inviteRole
        });

      if (error) {
        toast.error('Erreur lors de l\'envoi de l\'invitation');
      } else {
        toast.success('Invitation envoyée avec succès');
        setInviteEmail('');
        fetchInvitations();
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
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

  const handleCancelInvitation = async (invitationId: string) => {
    const { error } = await supabase
      .from('team_invitations')
      .update({ status: 'cancelled' })
      .eq('id', invitationId);

    if (error) {
      toast.error('Erreur lors de l\'annulation de l\'invitation');
    } else {
      toast.success('Invitation annulée');
      fetchInvitations();
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'owner' ? <Crown className="h-4 w-4" /> : <User className="h-4 w-4" />;
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
      <div>
        <h3 className="text-lg font-medium">Gestion de l'équipe</h3>
        <p className="text-sm text-muted-foreground">
          Gérez les membres de votre équipe et leurs accès.
        </p>
      </div>

      {/* Invitation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Inviter un nouveau membre
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                type="email"
                placeholder="adresse@exemple.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="member">Membre</option>
                <option value="admin">Administrateur</option>
              </select>
              <Button 
                onClick={handleInviteUser}
                disabled={!inviteEmail || isInviting}
                className="whitespace-nowrap"
              >
                {isInviting ? 'Envoi...' : 'Inviter'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  </div>
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role === 'owner' ? 'Propriétaire' : 
                     member.role === 'admin' ? 'Administrateur' : 'Membre'}
                  </Badge>
                </div>
                {member.role !== 'owner' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                )}
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

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Invitations en attente ({invitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{invitation.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Invité le {new Date(invitation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {invitation.role === 'admin' ? 'Administrateur' : 'Membre'}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelInvitation(invitation.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Annuler
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamTab;