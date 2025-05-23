
import React from 'react';
import ClientList from '@/components/client/ClientList';

const Clients = () => {
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Clients</h1>
        <p className="text-gray-600 mt-1">Consultez et gérez vos clients.</p>
      </div>
      
      <ClientList />
    </div>
  );
};

export default Clients;
