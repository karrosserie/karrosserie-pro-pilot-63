import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useTeamMembers, TeamMember } from '@/hooks/use-team-members';
import { TeamMemberCard } from './TeamMemberCard';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TeamMembersListProps {
  onAddTeamMember: () => void;
  onEditTeamMember: (teamMember: TeamMember) => void;
}

export const TeamMembersList: React.FC<TeamMembersListProps> = ({
  onAddTeamMember,
  onEditTeamMember
}) => {
  const { teamMembers, isLoading, removeTeamMember } = useTeamMembers();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamMemberToDelete, setTeamMemberToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setTeamMemberToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (teamMemberToDelete) {
      removeTeamMember.mutate(teamMemberToDelete);
      setDeleteDialogOpen(false);
      setTeamMemberToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement des membres d'équipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion de l'Équipe</h2>
          <p className="text-gray-600 mt-1">Gérer les membres d'équipe et leurs qualifications</p>
        </div>
        <Button 
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
          onClick={onAddTeamMember}
        >
          <User className="w-4 h-4 mr-2" />
          Ajouter un membre
        </Button>
      </div>

      {/* Liste des membres d'équipe */}
      {teamMembers.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre d'équipe</h3>
          <p className="text-gray-500 mb-4">
            Commencez par ajouter votre premier membre à l'équipe.
          </p>
          <Button 
            className="bg-karrosserie-orange hover:bg-karrosserie-orange/90"
            onClick={onAddTeamMember}
          >
            <User className="w-4 h-4 mr-2" />
            Ajouter un membre
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers
            .sort((a, b) => {
              const firstNameA = a.profiles?.first_name || '';
              const lastNameA = a.profiles?.last_name || '';
              const firstNameB = b.profiles?.first_name || '';
              const lastNameB = b.profiles?.last_name || '';
              
              const fullNameA = `${firstNameA} ${lastNameA}`.trim();
              const fullNameB = `${firstNameB} ${lastNameB}`.trim();
              
              return fullNameA.localeCompare(fullNameB);
            })
            .map((teamMember) => (
            <TeamMemberCard
              key={teamMember.id}
              teamMember={teamMember}
              onEdit={onEditTeamMember}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir retirer ce membre de l'équipe ? Cette action peut être annulée en réactivant le membre.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Retirer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};