import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clock, Play, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaskWaitingActionsProps {
  taskId: string;
  taskName: string;
  vehiclePlate: string;
  isWaiting?: boolean;
  onSetWaiting?: (taskId: string, reason?: string) => Promise<{ success: boolean; error?: any }>;
  onResume?: (taskId: string) => Promise<{ success: boolean; error?: any }>;
}

export const TaskWaitingActions = ({
  taskId,
  taskName,
  vehiclePlate,
  isWaiting = false,
  onSetWaiting,
  onResume
}: TaskWaitingActionsProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('pieces-manquantes');
  const [customReason, setCustomReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const waitingReasons = [
    { value: 'pieces-manquantes', label: 'Pièces manquantes' },
    { value: 'attente-client', label: 'Attente validation client' },
    { value: 'attente-assurance', label: 'Attente accord assurance' },
    { value: 'probleme-technique', label: 'Problème technique' },
    { value: 'attente-expert', label: 'Attente passage expert' },
    { value: 'autres', label: 'Autre raison' }
  ];

  const handleSetWaiting = async () => {
    if (!onSetWaiting) return;
    
    setLoading(true);
    try {
      const reason = selectedReason === 'autres' ? customReason : 
                     waitingReasons.find(r => r.value === selectedReason)?.label || 'Raison non spécifiée';
      
      const result = await onSetWaiting(taskId, reason);
      
      if (result.success) {
        toast({
          title: "Tâche mise en attente",
          description: `La tâche ${taskName} pour ${vehiclePlate} a été mise en attente.`
        });
        setShowDialog(false);
        setSelectedReason('pieces-manquantes');
        setCustomReason('');
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de mettre la tâche en attente."
        });
      }
    } catch (error) {
      console.error('Error setting task waiting:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    if (!onResume) return;
    
    setLoading(true);
    try {
      const result = await onResume(taskId);
      
      if (result.success) {
        toast({
          title: "Tâche reprise",
          description: `La tâche ${taskName} pour ${vehiclePlate} a été reprise.`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de reprendre la tâche."
        });
      }
    } catch (error) {
      console.error('Error resuming task:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite."
      });
    } finally {
      setLoading(false);
    }
  };

  if (isWaiting) {
    // Tâche en attente - bouton pour la reprendre
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleResume}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Play className="w-4 h-4" />
        {loading ? 'Reprise...' : 'Reprendre'}
      </Button>
    );
  }

  // Tâche normale - bouton pour la mettre en attente
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2"
      >
        <Clock className="w-4 h-4" />
        Mettre en attente
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Mettre en attente
            </DialogTitle>
            <DialogDescription>
              Vous vous apprêtez à mettre en attente la tâche "{taskName}" pour le véhicule {vehiclePlate}.
              Veuillez indiquer la raison du blocage.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Raison du blocage</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une raison" />
                </SelectTrigger>
                <SelectContent>
                  {waitingReasons.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReason === 'autres' && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Précisez la raison</Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Décrivez le problème..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSetWaiting}
              disabled={loading || (selectedReason === 'autres' && !customReason.trim())}
            >
              {loading ? 'Mise en attente...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};