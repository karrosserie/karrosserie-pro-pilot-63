
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Profile } from '@/services/supabase/profiles';
import { User } from '@supabase/supabase-js';

interface ProfileHeaderProps {
  profile: Profile | null;
  user: User | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, user }) => {
  return (
    <div className="flex items-center gap-6 mb-6">
      <Avatar className="h-20 w-20">
        <AvatarImage src={profile?.avatar_url || ''} />
        <AvatarFallback className="bg-primary text-xl">
          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
      
      <div>
        <h3 className="text-lg font-medium">
          {profile?.first_name} {profile?.last_name}
        </h3>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>
    </div>
  );
};
