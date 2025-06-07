
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
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-600 mt-1">
        {description}
      </p>
    </div>
  );
};

export default ClientsHeader;
