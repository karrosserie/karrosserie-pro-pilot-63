import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useTeamMembers, TeamMember, CreateTeamMemberData, UpdateTeamMemberData } from '@/hooks/use-team-members';
import { STANDARD_QUALIFICATIONS } from '@/hooks/useEmployeeData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TeamMemberFormProps {
  teamMember?: TeamMember | null;
  onClose: () => void;
}

const roles = [
  'Carrossier',
  'Carrossier-Véhicule de courtoisie', 
  'Responsable',
  'Responsable administratif',
  'Propriétaire'
];

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  teamMember,
  onClose
}) => {
  const { addTeamMember, updateTeamMember } = useTeamMembers();
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_id: teamMember?.user_id || '',
    role: teamMember?.role || '',
    qualifications: teamMember?.qualifications || []
  });

  useEffect(() => {
    if (!teamMember) {
      fetchAvailableUsers();
    }
  }, [teamMember]);

  // Qualifications are now available for all roles
  // No need to reset qualifications when role changes

  const fetchAvailableUsers = async () => {
    try {
      // Récupérer tous les utilisateurs qui ne sont pas déjà dans une équipe active
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .not('id', 'in', `(
          SELECT user_id FROM user_companies 
          WHERE active = true AND company_id = (
            SELECT company_id FROM user_companies 
            WHERE user_id = auth.uid() AND active = true LIMIT 1
          )
        )`);

      if (error) throw error;
      setAvailableUsers(profiles || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleQualificationToggle = (qualificationId: string) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.includes(qualificationId)
        ? prev.qualifications.filter(q => q !== qualificationId)
        : [...prev.qualifications, qualificationId]
    }));
  };

  // Qualifications are now available for all roles
  const shouldShowQualifications = formData.role !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (teamMember) {
        // Mode édition
        const updateData: UpdateTeamMemberData = {
          role: formData.role,
          qualifications: formData.qualifications
        };
        
        await updateTeamMember.mutateAsync({
          id: teamMember.id,
          data: updateData
        });
      } else {
        // Mode création
        const createData: CreateTeamMemberData = {
          user_id: formData.user_id,
          role: formData.role,
          qualifications: formData.qualifications
        };

        await addTeamMember.mutateAsync(createData);
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving team member:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!teamMember && (
        <div className="space-y-2">
          <Label htmlFor="user">Utilisateur *</Label>
          <Select
            value={formData.user_id}
            onValueChange={(value) => setFormData(prev => ({ ...prev, user_id: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un utilisateur" />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} - {user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">Rôle *</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {shouldShowQualifications && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>
              Qualifications {(formData.role === 'Carrossier' || formData.role === 'Carrossier-Véhicule de courtoisie') ? '* ' : ''}
              (sélectionnez une ou plusieurs)
            </Label>
            {formData.qualifications.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {formData.qualifications.length} qualification(s) sélectionnée(s)
              </span>
            )}
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
            {STANDARD_QUALIFICATIONS.map((qualification) => (
              <div key={qualification.id} className="flex items-center space-x-3">
                <Checkbox
                  id={qualification.id}
                  checked={formData.qualifications.includes(qualification.id)}
                  onCheckedChange={() => handleQualificationToggle(qualification.id)}
                />
                <Label 
                  htmlFor={qualification.id} 
                  className="text-sm font-normal flex-1 cursor-pointer"
                >
                  <span className={`inline-block px-2 py-1 rounded-sm text-xs mr-2 ${qualification.color}`}>
                    {qualification.name}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          variant="validation"
          disabled={isLoading || (!teamMember && !formData.user_id) || !formData.role}
        >
          {isLoading ? "Sauvegarde..." : teamMember ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  );
};