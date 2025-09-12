import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Check, Circle } from "lucide-react";

interface CessionProgressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cession: any;
}

const progressSteps = [
  { id: 'cree', label: 'Créé', status: 'completed' },
  { id: 'initialise', label: 'Initialisé', status: 'completed' },
  { id: 'en_attente_signature', label: 'En attente de signature électronique', status: 'current' },
  { id: 'document_signe', label: 'Document signé', status: 'pending' },
  { id: 'lecture', label: 'Lecture', status: 'pending' },
  { id: 'envoye_courrier', label: 'Envoyé par courrier recommandé', status: 'pending' },
  { id: 'reception_courrier', label: 'Réception du courrier recommandé', status: 'pending' }
];

// Mapping des statuts Supabase vers les étapes
const getStepStatus = (stepId: string, cessionStatus: string) => {
  switch (cessionStatus) {
    case 'en_attente':
      if (stepId === 'cree') return 'completed';
      return 'pending';
    
    case 'en_attente_signature':
      if (stepId === 'cree' || stepId === 'initialise') return 'completed';
      if (stepId === 'en_attente_signature') return 'current';
      return 'pending';
    
    case 'signe':
      if (stepId === 'cree' || stepId === 'initialise' || 
          stepId === 'en_attente_signature' || stepId === 'document_signe') return 'completed';
      if (stepId === 'lecture') return 'current';
      return 'pending';
    
    case 'envoye':
      if (stepId === 'cree' || stepId === 'initialise' || 
          stepId === 'en_attente_signature' || stepId === 'document_signe' || 
          stepId === 'lecture') return 'completed';
      if (stepId === 'envoye_courrier') return 'current';
      return 'pending';
    
    case 'recu':
      return 'completed'; // Toutes les étapes sont complétées
    
    default:
      if (stepId === 'cree') return 'completed';
      return 'pending';
  }
};

export const CessionProgressDialog = ({ isOpen, onClose, cession }: CessionProgressDialogProps) => {
  if (!cession) return null;

  const steps = progressSteps.map(step => ({
    ...step,
    status: getStepStatus(step.id, cession.status || 'en_attente')
  }));

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Suivi de la cession {cession.reference}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Barre de progression globale */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression générale</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Liste des étapes */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-3">
                {/* Icône de statut */}
                <div className="flex-shrink-0 mt-0.5">
                  {step.status === 'completed' ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : step.status === 'current' ? (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Circle className="w-3 h-3 text-white fill-current" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <Circle className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Ligne de connexion */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[11px] mt-6 w-0.5 h-8 bg-gray-200" />
                )}

                {/* Contenu de l'étape */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    step.status === 'completed' 
                      ? 'text-green-700' 
                      : step.status === 'current' 
                      ? 'text-blue-700' 
                      : 'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  {step.status === 'current' && (
                    <p className="text-xs text-blue-600 mt-1">En cours...</p>
                  )}
                  {step.status === 'completed' && (
                    <p className="text-xs text-green-600 mt-1">Terminé</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};