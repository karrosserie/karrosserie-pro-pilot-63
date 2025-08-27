import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Clock, Users, Plus, Edit, Trash2, Move, ArrowRight } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number; // en heures
  requiredQualifications: string[];
  isRequired: boolean;
  canRunInParallel: boolean;
  dependencies: string[];
  color: string;
  order: number;
}

interface ProcessTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  estimatedTotalDuration: number;
  isDefault: boolean;
}

const availableQualifications = [
  'Carrosserie',
  'Peinture',
  'Mécanique', 
  'Électricité',
  'Diagnostic',
  'Soudure',
  'Débosselage',
  'Polissage'
];

const stepColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-red-100 text-red-800',
  'bg-orange-100 text-orange-800'
];

const mockProcessTemplates: ProcessTemplate[] = [
  {
    id: '1',
    name: 'Processus Standard Carrosserie',
    description: 'Processus complet pour réparations de carrosserie avec peinture',
    isDefault: true,
    estimatedTotalDuration: 12,
    steps: [
      {
        id: 'accueil',
        name: 'Accueil & Préparation du dossier',
        description: 'Réception du véhicule, évaluation des dégâts, création du dossier client',
        estimatedDuration: 1,
        requiredQualifications: ['Diagnostic'],
        isRequired: true,
        canRunInParallel: false,
        dependencies: [],
        color: stepColors[0],
        order: 1
      },
      {
        id: 'remplacement',
        name: 'Remplacement ou débosselage',
        description: 'Remplacement des pièces endommagées ou débosselage',
        estimatedDuration: 2.5,
        requiredQualifications: ['Carrosserie', 'Débosselage'],
        isRequired: true,
        canRunInParallel: false,
        dependencies: ['accueil'],
        color: stepColors[1],
        order: 2
      },
      {
        id: 'preparation',
        name: 'Préparation peinture',
        description: 'Ponçage, masquage, apprêt',
        estimatedDuration: 2.5,
        requiredQualifications: ['Peinture', 'Préparation'],
        isRequired: true,
        canRunInParallel: false,
        dependencies: ['remplacement'],
        color: stepColors[2],
        order: 3
      },
      {
        id: 'peinture',
        name: 'Mise en peinture',
        description: 'Application de la peinture, séchage',
        estimatedDuration: 4,
        requiredQualifications: ['Peinture'],
        isRequired: true,
        canRunInParallel: false,
        dependencies: ['preparation'],
        color: stepColors[3],
        order: 4
      },
      {
        id: 'finitions',
        name: 'Finitions & remontage',
        description: 'Polissage, remontage des éléments',
        estimatedDuration: 1.5,
        requiredQualifications: ['Polissage', 'Carrosserie'],
        isRequired: true,
        canRunInParallel: false,
        dependencies: ['peinture'],
        color: stepColors[4],
        order: 5
      },
      {
        id: 'cloture',
        name: 'Clôture du dossier et livraison',
        description: 'Contrôle qualité final, nettoyage, livraison',
        estimatedDuration: 0.5,
        requiredQualifications: ['Diagnostic'],
        isRequired: true,
        canRunInParallel: false,
        dependencies: ['finitions'],
        color: stepColors[5],
        order: 6
      }
    ]
  }
];

export const ProcessConfig = () => {
  const [processes, setProcesses] = useState<ProcessTemplate[]>(mockProcessTemplates);
  const [selectedProcess, setSelectedProcess] = useState<ProcessTemplate>(mockProcessTemplates[0]);
  const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [newStep, setNewStep] = useState<Partial<WorkflowStep>>({
    name: '',
    description: '',
    estimatedDuration: 1,
    requiredQualifications: [],
    isRequired: true,
    canRunInParallel: false,
    dependencies: [],
    color: stepColors[0]
  });

  const handleAddStep = () => {
    const id = Date.now().toString();
    const step: WorkflowStep = {
      ...newStep as WorkflowStep,
      id,
      order: selectedProcess.steps.length + 1
    };
    
    const updatedProcess = {
      ...selectedProcess,
      steps: [...selectedProcess.steps, step],
      estimatedTotalDuration: selectedProcess.estimatedTotalDuration + step.estimatedDuration
    };
    
    setSelectedProcess(updatedProcess);
    setProcesses(prev => prev.map(p => p.id === selectedProcess.id ? updatedProcess : p));
    setIsStepDialogOpen(false);
    resetNewStep();
  };

  const handleEditStep = (step: WorkflowStep) => {
    setEditingStep(step);
    setNewStep(step);
    setIsStepDialogOpen(true);
  };

  const handleUpdateStep = () => {
    if (!editingStep) return;

    const updatedSteps = selectedProcess.steps.map(step => 
      step.id === editingStep.id ? { ...newStep as WorkflowStep, id: editingStep.id } : step
    );
    
    const updatedProcess = {
      ...selectedProcess,
      steps: updatedSteps,
      estimatedTotalDuration: updatedSteps.reduce((acc, step) => acc + step.estimatedDuration, 0)
    };
    
    setSelectedProcess(updatedProcess);
    setProcesses(prev => prev.map(p => p.id === selectedProcess.id ? updatedProcess : p));
    setIsStepDialogOpen(false);
    setEditingStep(null);
    resetNewStep();
  };

  const handleDeleteStep = (stepId: string) => {
    const updatedSteps = selectedProcess.steps.filter(step => step.id !== stepId);
    const updatedProcess = {
      ...selectedProcess,
      steps: updatedSteps,
      estimatedTotalDuration: updatedSteps.reduce((acc, step) => acc + step.estimatedDuration, 0)
    };
    
    setSelectedProcess(updatedProcess);
    setProcesses(prev => prev.map(p => p.id === selectedProcess.id ? updatedProcess : p));
  };

  const resetNewStep = () => {
    setNewStep({
      name: '',
      description: '',
      estimatedDuration: 1,
      requiredQualifications: [],
      isRequired: true,
      canRunInParallel: false,
      dependencies: [],
      color: stepColors[0]
    });
  };

  const handleQualificationChange = (qualification: string, checked: boolean) => {
    setNewStep(prev => ({
      ...prev,
      requiredQualifications: checked 
        ? [...(prev.requiredQualifications || []), qualification]
        : (prev.requiredQualifications || []).filter(q => q !== qualification)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Configuration des Processus</h2>
          <p className="text-muted-foreground">Définir les étapes et durées du workflow</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isStepDialogOpen} onOpenChange={setIsStepDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" onClick={() => setEditingStep(null)}>
                <Plus className="w-4 h-4" />
                Ajouter une étape
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingStep ? 'Modifier l\'étape' : 'Ajouter une nouvelle étape'}
                </DialogTitle>
                <DialogDescription>
                  Configurez les détails de l'étape du workflow.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="stepName">Nom de l'étape</Label>
                  <Input
                    id="stepName"
                    value={newStep.name}
                    onChange={(e) => setNewStep(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Préparation peinture"
                  />
                </div>
                <div>
                  <Label htmlFor="stepDescription">Description</Label>
                  <Textarea
                    id="stepDescription"
                    value={newStep.description}
                    onChange={(e) => setNewStep(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description détaillée de l'étape"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Durée estimée (heures)</Label>
                    <Input
                      id="duration"
                      type="number"
                      step="0.5"
                      value={newStep.estimatedDuration}
                      onChange={(e) => setNewStep(prev => ({ ...prev, estimatedDuration: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Couleur</Label>
                    <Select 
                      value={newStep.color} 
                      onValueChange={(value) => setNewStep(prev => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une couleur" />
                      </SelectTrigger>
                      <SelectContent>
                        {stepColors.map((color, index) => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded ${color}`}></div>
                              Couleur {index + 1}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Qualifications requises</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableQualifications.map(qualification => (
                      <div key={qualification} className="flex items-center space-x-2">
                        <Checkbox
                          id={`qual-${qualification}`}
                          checked={newStep.requiredQualifications?.includes(qualification)}
                          onCheckedChange={(checked) => handleQualificationChange(qualification, checked as boolean)}
                        />
                        <Label htmlFor={`qual-${qualification}`} className="text-sm">{qualification}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRequired"
                    checked={newStep.isRequired}
                    onCheckedChange={(checked) => setNewStep(prev => ({ ...prev, isRequired: checked as boolean }))}
                  />
                  <Label htmlFor="isRequired">Étape obligatoire</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canRunInParallel"
                    checked={newStep.canRunInParallel}
                    onCheckedChange={(checked) => setNewStep(prev => ({ ...prev, canRunInParallel: checked as boolean }))}
                  />
                  <Label htmlFor="canRunInParallel">Peut être exécutée en parallèle</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStepDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={editingStep ? handleUpdateStep : handleAddStep}>
                  {editingStep ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Process Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {selectedProcess.name}
                {selectedProcess.isDefault && <Badge>Défaut</Badge>}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{selectedProcess.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{selectedProcess.estimatedTotalDuration}h</div>
              <div className="text-sm text-muted-foreground">Durée totale</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{selectedProcess.steps.length} étapes</span>
              <span>•</span>
              <span>{selectedProcess.steps.filter(s => s.isRequired).length} obligatoires</span>
              <span>•</span>
              <span>{selectedProcess.steps.filter(s => s.canRunInParallel).length} parallélisables</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Étapes du workflow</h3>
        
        {/* Visual Flow */}
        <Card className="p-6">
          <div className="flex items-center justify-center overflow-x-auto">
            <div className="flex items-center gap-4 min-w-fit">
              {selectedProcess.steps
                .sort((a, b) => a.order - b.order)
                .map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`px-3 py-2 rounded-lg text-sm font-medium ${step.color} whitespace-nowrap`}>
                      {step.name}
                      <div className="text-xs opacity-75 mt-1">
                        {step.estimatedDuration}h
                      </div>
                    </div>
                    {index < selectedProcess.steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </Card>

        {/* Step Details */}
        <div className="grid gap-4">
          {selectedProcess.steps
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <Card key={step.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded text-sm font-medium ${step.color}`}>
                          Étape {step.order}
                        </div>
                        <h4 className="font-semibold">{step.name}</h4>
                        {step.isRequired && <Badge variant="secondary">Obligatoire</Badge>}
                        {step.canRunInParallel && <Badge variant="outline">Parallélisable</Badge>}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Durée: {step.estimatedDuration}h</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>Qualifications: {step.requiredQualifications.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Move className="w-4 h-4 text-muted-foreground" />
                          <span>Dépendances: {step.dependencies.length > 0 ? step.dependencies.join(', ') : 'Aucune'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditStep(step)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Modifier
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteStep(step.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};