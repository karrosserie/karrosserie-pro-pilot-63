import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Trash } from 'lucide-react';
import { TeamMember } from '@/hooks/use-team-members';

interface TeamMemberCardProps {
  teamMember: TeamMember;
  onEdit: (teamMember: TeamMember) => void;
  onDelete: (id: string) => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  teamMember,
  onEdit,
  onDelete
}) => {
  const getQualificationColor = (index: number) => {
    const colors = [
      "bg-primary/10 text-primary border-primary/20",
      "bg-green-100 text-green-800 border-green-200",
      "bg-orange-100 text-orange-800 border-orange-200",
      "bg-red-100 text-red-800 border-red-200",
      "bg-blue-100 text-blue-800 border-blue-200",
      "bg-purple-100 text-purple-800 border-purple-200",
      "bg-gray-100 text-gray-800 border-gray-200"
    ];
    return colors[index % colors.length];
  };

  const fullName = teamMember.profiles
    ? `${teamMember.profiles.first_name} ${teamMember.profiles.last_name}`
    : 'Membre non assigné';

  const email = teamMember.profiles?.email || '';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{fullName}</h3>
            {email && <p className="text-sm text-gray-600">{email}</p>}
            <p className="text-sm text-gray-500 font-medium">{teamMember.role}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(teamMember)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
              onClick={() => onDelete(teamMember.id)}
            >
              <Trash className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Qualifications :</h4>
          <div className="flex flex-wrap gap-2">
            {teamMember.qualifications && teamMember.qualifications.map((qualification, index) => (
              <Badge 
                key={qualification} 
                className={`${getQualificationColor(index)} text-xs`}
              >
                {qualification}
              </Badge>
            ))}
            {(!teamMember.qualifications || teamMember.qualifications.length === 0) && (
              <p className="text-sm text-gray-500 italic">Aucune qualification assignée</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};