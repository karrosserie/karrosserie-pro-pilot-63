import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, User, Users, Pencil, Trash, Phone, Mail, Clock } from 'lucide-react';

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

interface TeamMobileCardProps {
  member: TeamMember;
  onEditMember: (member: TeamMember) => void;
  onRemoveMember: (memberId: string) => void;
  onViewTimesheet?: (member: TeamMember) => void;
}

const TeamMobileCard: React.FC<TeamMobileCardProps> = ({
  member,
  onEditMember,
  onRemoveMember,
  onViewTimesheet
}) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Propriétaire': return <Crown className="h-4 w-4" />;
      case 'carrossier': return <User className="h-4 w-4" />;
      case 'carrossier-vehicule de courtoisie': return <User className="h-4 w-4" />;
      case 'responsable': return <Users className="h-4 w-4" />;
      case 'responsable administratif': return <Users className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    return role;
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'Propriétaire' ? 'default' : 'secondary';
  };

  return (
    <Card className={`${!member.active ? 'opacity-60' : ''}`}>
      <CardContent className="p-4 space-y-3">
        {/* Header avec nom et statut */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {member.profiles?.first_name} {member.profiles?.last_name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {getRoleIcon(member.role)}
              <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                {getRoleLabel(member.role)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!member.active && (
              <Badge variant="destructive" className="text-xs">
                Inactif
              </Badge>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-2">
          {member.profiles?.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="truncate">{member.profiles.email}</span>
            </div>
          )}
          {member.profiles?.phone_number && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
              <span>{member.profiles.phone_number}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          {(member.role === 'carrossier' || member.role === 'carrossier-vehicule de courtoisie') && onViewTimesheet && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewTimesheet(member)}
              className="flex-1 text-xs"
              title="Voir les pointages"
            >
              <Clock className="h-3 w-3 mr-1" />
              Pointages
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEditMember(member)}
            className="flex-1 text-xs"
          >
            <Pencil className="h-3 w-3 mr-1" />
            Modifier
          </Button>
          {member.role !== 'Propriétaire' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRemoveMember(member.id)}
              className="flex-1 text-xs text-red-600 hover:text-red-700"
            >
              <Trash className="h-3 w-3 mr-1" />
              Supprimer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMobileCard;