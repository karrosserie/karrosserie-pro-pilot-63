
import React from 'react';
import ClientsPage from '@/components/clients/ClientsPage';
import { useIsMobile } from '@/hooks/use-mobile';

const Clients = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-4 md:space-y-6`}>
      <ClientsPage />
    </div>
  );
};

export default Clients;
