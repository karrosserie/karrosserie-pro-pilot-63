
import React from 'react';

interface CessionsHeaderProps {}

export const CessionsHeader = ({}: CessionsHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Cession de créance</h1>
      <p className="text-gray-600 mt-1">
        Gérez vos cessions de créance avec les compagnies d'assurance.
      </p>
    </div>
  );
};
