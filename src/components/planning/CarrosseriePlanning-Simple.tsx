import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyId } from '@/hooks/use-company-id';
import { useUserRole } from '@/hooks/use-user-role';
import { useToast } from '@/hooks/use-toast';

const CarrosseriePlanningSimple = () => {
  const { user } = useAuth();
  const { companyId } = useCompanyId();
  const { userRole, isOwner, isResponsable, isCarrossier, canManage } = useUserRole();
  const { toast } = useToast();

  console.log('🔍 CarrosseriePlanningSimple - Debug:', {
    userId: user?.id,
    companyId,
    userRole,
    isOwner,
    canManage
  });

  // Determine view based on role
  const shouldShowManagerView = isOwner || isResponsable || canManage;
  
  useEffect(() => {
    console.log('🚨 ROLE DEBUG:', {
      userRole,
      isOwner,
      isResponsable,
      shouldShowManagerView,
      userId: user?.id
    });
  }, [userRole, isOwner, isResponsable, shouldShowManagerView, user?.id]);

  if (!companyId) {
    return <div>Chargement de l'entreprise...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Planning Carrosserie</h1>
      
      <div className="bg-blue-100 p-4 rounded mb-4">
        <h2 className="font-semibold">Informations de debug :</h2>
        <p>Utilisateur ID: {user?.id}</p>
        <p>Entreprise ID: {companyId}</p>
        <p>Rôle: {userRole}</p>
        <p>Est propriétaire: {isOwner ? 'Oui' : 'Non'}</p>
        <p>Vue recommandée: {shouldShowManagerView ? 'Manager' : 'Employé'}</p>
      </div>

      {shouldShowManagerView ? (
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-semibold text-green-800">Vue Manager</h2>
          <p>Vous avez accès à la vue manager du planning.</p>
        </div>
      ) : (
        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="text-xl font-semibold text-yellow-800">Vue Employé</h2>
          <p>Vous avez accès à la vue employé du planning.</p>
        </div>
      )}
    </div>
  );
};

export default CarrosseriePlanningSimple;