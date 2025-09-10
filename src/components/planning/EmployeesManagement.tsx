import React, { useState } from 'react';
import { TeamMembersList } from "./TeamMembersList";
import { TeamMember } from '@/hooks/use-team-members';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TeamMemberForm } from './TeamMemberForm';

export const EmployeesManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);

  const handleAddTeamMember = () => {
    setSelectedTeamMember(null);
    setIsAddDialogOpen(true);
  };

  const handleEditTeamMember = (teamMember: TeamMember) => {
    setSelectedTeamMember(teamMember);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedTeamMember(null);
  };

  return (
    <div className="space-y-6">
      <TeamMembersList
        onAddTeamMember={handleAddTeamMember}
        onEditTeamMember={handleEditTeamMember}
      />

      {/* Dialogs pour ajouter/modifier un membre */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau membre</DialogTitle>
          </DialogHeader>
          <TeamMemberForm onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le membre</DialogTitle>
          </DialogHeader>
          <TeamMemberForm 
            teamMember={selectedTeamMember} 
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};