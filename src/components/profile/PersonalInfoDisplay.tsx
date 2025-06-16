
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
  const formatPhoneNumber = (phoneNumber?: string) => {
    if (!phoneNumber) return '-';
    
    // Si le numéro commence par +33, on le formate à la française
    if (phoneNumber.startsWith('+33')) {
      const number = phoneNumber.substring(3);
      if (number.length === 9) {
        return `+33 ${number.substring(0, 1)} ${number.substring(1, 3)} ${number.substring(3, 5)} ${number.substring(5, 7)} ${number.substring(7)}`;
      }
    }
    
    // Sinon on retourne le numéro tel quel
    return phoneNumber;
  };

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
          {formatPhoneNumber(profile?.phone_number)}
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onEdit}
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white"
        >
          Modifier
        </Button>
      </div>
    </div>
  );
};
