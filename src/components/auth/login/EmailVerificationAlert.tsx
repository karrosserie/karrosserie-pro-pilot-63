
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EmailVerificationAlertProps {
  email: string;
  onResendVerification: () => Promise<void>;
}

const EmailVerificationAlert = ({ email, onResendVerification }: EmailVerificationAlertProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription className="flex flex-col">
        <span>Votre adresse email n'a pas été vérifiée.</span>
        <button 
          onClick={onResendVerification}
          className="text-left underline font-medium mt-2 hover:no-underline"
        >
          Cliquez ici pour recevoir un nouvel email de vérification
        </button>
      </AlertDescription>
    </Alert>
  );
};

export default EmailVerificationAlert;
