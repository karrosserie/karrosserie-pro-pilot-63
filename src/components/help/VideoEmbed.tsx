import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VideoEmbedProps {
  filePath: string;
  title?: string;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ 
  filePath, 
  title = "Vidéo explicative",
  className = "" 
}) => {
  const { data: { publicUrl } } = supabase.storage
    .from('campaign-assets')
    .getPublicUrl(filePath);

  return (
    <div className={`mb-4 ${className}`}>
      <video 
        className="w-full rounded-lg border shadow-sm" 
        controls
        preload="metadata"
      >
        <source src={publicUrl} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
        <span>📹</span> {title}
      </p>
    </div>
  );
};
