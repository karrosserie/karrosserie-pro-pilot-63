import React, { useState } from 'react';
import { Paintbrush, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaintDetailsSectionProps {
  task: any;
  onUpdate?: () => void;
}

export const PaintDetailsSection: React.FC<PaintDetailsSectionProps> = ({ task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [paintBrand, setPaintBrand] = useState(task.paint_brand || '');
  const [colorCode, setColorCode] = useState(task.color_code || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('employee_schedule')
        .update({
          paint_brand: paintBrand || null,
          color_code: colorCode || null
        })
        .eq('id', task.id);

      if (error) throw error;

      toast({
        title: "Informations sauvegardées",
        description: "Les détails de peinture ont été mis à jour avec succès.",
      });

      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les informations de peinture.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPaintBrand(task.paint_brand || '');
    setColorCode(task.color_code || '');
    setIsEditing(false);
  };

  // Afficher seulement pour les tâches "Préparation peinture" en cours
  if (task.task_type !== 'Préparation peinture' || task.status !== 'En cours') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4 text-blue-600" />
            Détails de peinture
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              Modifier
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="paint-brand">Marque de peinture</Label>
              <Input
                id="paint-brand"
                value={paintBrand}
                onChange={(e) => setPaintBrand(e.target.value)}
                placeholder="Ex: Sikkens, PPG, BASF..."
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color-code">Code couleur</Label>
              <Input
                id="color-code"
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
                placeholder="Ex: L041, 147/A, etc."
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <Save className="w-3 h-3" />
                Sauvegarder
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Annuler
              </Button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Marque de peinture :</span>
              <p className="font-medium">
                {task.paint_brand || <span className="italic text-muted-foreground">Non renseigné</span>}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Code couleur :</span>
              <p className="font-medium">
                {task.color_code || <span className="italic text-muted-foreground">Non renseigné</span>}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};