
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomPhoneInput } from '@/components/ui/custom-phone-input';
import { Profile } from '@/services/supabase/profiles';

interface PersonalInfoFormProps {
  profile: Profile | null;
  onCancel: () => void;
  onSave: (data: Partial<Profile>) => Promise<void>;
}

export const PersonalInfoForm = ({ profile, onCancel, onSave }: PersonalInfoFormProps) => {
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
            placeholder="Votre prénom"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
            placeholder="Votre nom"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <CustomPhoneInput
          value={formData.phone}
          onChange={(value) => setFormData(prev => ({ ...prev, phone: value || '' }))}
          placeholder="Numéro de téléphone"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
};
