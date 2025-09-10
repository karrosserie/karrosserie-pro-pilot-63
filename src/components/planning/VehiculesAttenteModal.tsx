import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle, Clock, User, AlertTriangle, FileText, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VehiculeAttente {
  id: number;
  plaque: string;
  modele: string;
  etapeBloquee: string;
  raisonBlocage: string;
  detailBlocage: string;
  dateAttente: string;
  priorite: 'normale' | 'urgente';
  prix: string;
  client: string;
}

interface Employe {
  id: number;
  nom: string;
  email: string;
  qualifications: string[];
  actif: boolean;
}

// Modal pour débloquer un véhicule
interface DebloquerModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule: VehiculeAttente;
  onDebloquer: (vehiculeId: number, solution: string, notes: string) => void;
}

export const DebloquerModal: React.FC<DebloquerModalProps> = ({
  isOpen,
  onClose,
  vehicule,
  onDebloquer
}) => {
  const [solution, setSolution] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const solutions = [
    'Pièces reçues - Reprendre la réparation',
    'Accord expert obtenu - Continuer les travaux',
    'Technicien disponible - Assigner la tâche',
    'Problème résolu - Poursuivre le processus',
    'Validation client obtenue - Reprendre',
    'Autre solution (préciser dans les notes)'
  ];

  const handleDebloquer = () => {
    if (!solution) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une solution",
        variant: "destructive"
      });
      return;
    }

    onDebloquer(vehicule.id, solution, notes);
    toast({
      title: "Véhicule débloqué",
      description: `${vehicule.plaque} - ${vehicule.modele} a été débloqué avec succès`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            Débloquer le véhicule
          </DialogTitle>
          <DialogDescription>
            Résoudre le blocage pour {vehicule?.plaque} - {vehicule?.modele}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Résumé du véhicule */}
          <Card className="bg-warning/5 border-warning/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Véhicule:</span> {vehicule?.plaque}
                </div>
                <div>
                  <span className="font-medium">Client:</span> {vehicule?.client}
                </div>
                <div>
                  <span className="font-medium">Étape bloquée:</span> {vehicule?.etapeBloquee}
                </div>
                <div>
                  <span className="font-medium">En attente depuis:</span> {vehicule?.dateAttente && new Date(vehicule.dateAttente).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-3 p-3 bg-background rounded border">
                <span className="font-medium text-destructive">Raison du blocage:</span>
                <p className="text-sm mt-1">{vehicule?.raisonBlocage} - {vehicule?.detailBlocage}</p>
              </div>
            </CardContent>
          </Card>

          {/* Solution */}
          <div className="space-y-2">
            <Label htmlFor="solution">Solution appliquée *</Label>
            <Select value={solution} onValueChange={setSolution}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la solution..." />
              </SelectTrigger>
              <SelectContent>
                {solutions.map((sol, index) => (
                  <SelectItem key={index} value={sol}>
                    {sol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes complémentaires */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes complémentaires</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Détailles supplémentaires, actions prises, informations importantes..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleDebloquer}
              className="bg-success hover:bg-success/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Débloquer le véhicule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal pour planifier un véhicule
interface PlanifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule: VehiculeAttente;
  employes: Employe[];
  onPlanifier: (vehiculeId: number, employeId: number, datePrevu: string, heurePrevu: string, notes: string) => void;
}

export const PlanifierModal: React.FC<PlanifierModalProps> = ({
  isOpen,
  onClose,
  vehicule,
  employes,
  onPlanifier
}) => {
  const [employeId, setEmployeId] = useState('');
  const [datePrevu, setDatePrevu] = useState('');
  const [heurePrevu, setHeurePrevu] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const heuresDisponibles = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handlePlanifier = () => {
    if (!employeId || !datePrevu || !heurePrevu) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const employe = employes.find(e => e.id === parseInt(employeId));
    onPlanifier(vehicule.id, parseInt(employeId), datePrevu, heurePrevu, notes);
    
    toast({
      title: "Véhicule planifié",
      description: `${vehicule.plaque} assigné à ${employe?.nom} le ${new Date(datePrevu).toLocaleDateString()} à ${heurePrevu}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Planifier le véhicule
          </DialogTitle>
          <DialogDescription>
            Assigner un créneau pour {vehicule?.plaque} - {vehicule?.modele}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Résumé du véhicule */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Véhicule:</span> {vehicule?.plaque} - {vehicule?.modele}
                </div>
                <div>
                  <span className="font-medium">Client:</span> {vehicule?.client}
                </div>
                <div>
                  <span className="font-medium">Étape:</span> {vehicule?.etapeBloquee}
                </div>
                <div>
                  <span className="font-medium">Prix:</span> {vehicule?.prix}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employe">Technicien assigné *</Label>
              <Select value={employeId} onValueChange={setEmployeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un technicien..." />
                </SelectTrigger>
                <SelectContent>
                  {employes.filter(emp => emp.actif).map(employe => (
                    <SelectItem key={employe.id} value={employe.id.toString()}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {employe.nom}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date prévue *</Label>
              <Input
                id="date"
                type="date"
                value={datePrevu}
                onChange={(e) => setDatePrevu(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="heure">Heure prévue *</Label>
            <Select value={heurePrevu} onValueChange={setHeurePrevu}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une heure..." />
              </SelectTrigger>
              <SelectContent>
                {heuresDisponibles.map(heure => (
                  <SelectItem key={heure} value={heure}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {heure}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Instructions particulières</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instructions spéciales, priorités, informations importantes pour le technicien..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handlePlanifier}
              className="bg-primary hover:bg-primary/90"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Planifier le véhicule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal pour modifier un véhicule
interface ModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicule: VehiculeAttente;
  onModifier: (vehiculeId: number, modifications: Partial<VehiculeAttente>) => void;
}

export const ModifierModal: React.FC<ModifierModalProps> = ({
  isOpen,
  onClose,
  vehicule,
  onModifier
}) => {
  const [modele, setModele] = useState(vehicule?.modele || '');
  const [client, setClient] = useState(vehicule?.client || '');
  const [prix, setPrix] = useState(vehicule?.prix || '');
  const [priorite, setPriorite] = useState<'normale' | 'urgente'>(vehicule?.priorite || 'normale');
  const [etapeBloquee, setEtapeBloquee] = useState(vehicule?.etapeBloquee || '');
  const [raisonBlocage, setRaisonBlocage] = useState(vehicule?.raisonBlocage || '');
  const [detailBlocage, setDetailBlocage] = useState(vehicule?.detailBlocage || '');
  const { toast } = useToast();

  const etapes = [
    'Accueil & Préparation',
    'Expertise',
    'Remplacement ou débosselage',
    'Préparation peinture',
    'Mise en peinture',
    'Finitions & remontage',
    'Contrôle qualité',
    'Livraison'
  ];

  const raisonsBlocage = [
    'Attente pièces',
    'Accord expert assurance',
    'Attente technicien',
    'Problème découvert',
    'Pièces sur commande',
    'Validation client',
    'Attente devis',
    'Autre'
  ];

  const handleModifier = () => {
    if (!modele || !client || !prix) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const modifications = {
      modele,
      client,
      prix,
      priorite,
      etapeBloquee,
      raisonBlocage,
      detailBlocage
    };

    onModifier(vehicule.id, modifications);
    
    toast({
      title: "Véhicule modifié",
      description: `Les informations de ${vehicule.plaque} ont été mises à jour`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-accent" />
            Modifier le véhicule
          </DialogTitle>
          <DialogDescription>
            Modifier les informations de {vehicule?.plaque}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Informations générales
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plaque">Plaque d'immatriculation</Label>
                  <Input
                    id="plaque"
                    value={vehicule?.plaque}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modele">Modèle *</Label>
                  <Input
                    id="modele"
                    value={modele}
                    onChange={(e) => setModele(e.target.value)}
                    placeholder="Ex: Renault Clio"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Input
                    id="client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Ex: Mme Martin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prix">Prix *</Label>
                  <Input
                    id="prix"
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    placeholder="Ex: 1200€"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priorite">Priorité</Label>
                <Select value={priorite} onValueChange={(value: 'normale' | 'urgente') => setPriorite(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normale">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                        Normale
                      </div>
                    </SelectItem>
                    <SelectItem value="urgente">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive"></div>
                        Urgente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Informations de blocage */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                Informations de blocage
              </h4>

              <div className="space-y-2">
                <Label htmlFor="etape">Étape bloquée</Label>
                <Select value={etapeBloquee} onValueChange={setEtapeBloquee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez l'étape..." />
                  </SelectTrigger>
                  <SelectContent>
                    {etapes.map(etape => (
                      <SelectItem key={etape} value={etape}>
                        {etape}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="raison">Raison du blocage</Label>
                <Select value={raisonBlocage} onValueChange={setRaisonBlocage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez la raison..." />
                  </SelectTrigger>
                  <SelectContent>
                    {raisonsBlocage.map(raison => (
                      <SelectItem key={raison} value={raison}>
                        {raison}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detail">Détail du blocage</Label>
                <Textarea
                  id="detail"
                  value={detailBlocage}
                  onChange={(e) => setDetailBlocage(e.target.value)}
                  placeholder="Détails spécifiques du blocage..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleModifier}
              className="bg-accent hover:bg-accent/90"
            >
              <Settings className="w-4 h-4 mr-2" />
              Sauvegarder les modifications
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};