import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Client } from '@/services/supabase/clients';
import { useClientVehicleCheck } from '@/hooks/use-client-vehicle-check';

interface RequestDocumentsButtonProps {
  client: Client;
  onRequestDocuments: (client: Client) => void;
  size?: 'sm' | 'lg' | 'default' | 'icon';
  className?: string;
}

export const RequestDocumentsButton: React.FC<RequestDocumentsButtonProps> = ({
  client,
  onRequestDocuments,
  size = 'sm',
  className
}) => {
  const { hasVehicle, isLoading } = useClientVehicleCheck(client);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVehicle) {
      onRequestDocuments(client);
    }
  };

  const isDisabled = isLoading || !hasVehicle;

  return (
    <Button 
      variant="secondary" 
      size={size} 
      onClick={handleClick}
      disabled={isDisabled}
      className={className}
      title={!hasVehicle ? "Le client doit avoir au moins un véhicule" : "Demander les documents"}
    >
      <Send className="h-4 w-4 mr-1" />
      Demander documents
    </Button>
  );
};