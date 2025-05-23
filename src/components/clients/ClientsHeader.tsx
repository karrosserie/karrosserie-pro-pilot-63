
import React from 'react';

interface ClientsHeaderProps {
  title?: string;
  description?: string;
}

const ClientsHeader: React.FC<ClientsHeaderProps> = ({
  title = "Clients",
  description = "Consultez et gérez vos clients."
}) => {
  return (
    <div className="mb-4 md:mb-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ClientsHeader;
