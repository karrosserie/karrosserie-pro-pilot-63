
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { Profile } from '@/services/supabase/profiles';

interface PersonalInfoDisplayProps {
  profile: Profile | null;
  onEdit: () => void;
}

export const PersonalInfoDisplay: React.FC<PersonalInfoDisplayProps> = ({ 
  profile, 
  onEdit 
}) => {
  return (
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
      
      <div className="flex justify-end">
        <Button onClick={onEdit}>
          Modifier
        </Button>
      </div>
    </div>
  );
};
