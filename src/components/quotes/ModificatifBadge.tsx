import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Quote } from '@/services/supabase/quotes';

interface ModificatifBadgeProps {
  quote: Quote;
  className?: string;
}

export const ModificatifBadge = ({ quote, className }: ModificatifBadgeProps) => {
  if (!quote.is_modified_from_report) {
    return null;
  }

  if (quote.modificatif_received_at) {
    return (
      <Badge variant="outline" className={`gap-1 ${className}`}>
        <CheckCircle2 className="h-3 w-3 text-success" />
        Modificatif reçu
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`gap-1 border-warning text-warning ${className}`}>
      <AlertTriangle className="h-3 w-3" />
      Modificatif à recevoir
    </Badge>
  );
};
