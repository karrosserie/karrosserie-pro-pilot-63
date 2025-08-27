import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  MarkerType,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Car, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';

interface KarrosseriePlanningProps {
  employees: any[];
  vehicles: any[];
  schedules: any[];
  onScheduleUpdate?: (scheduleData: any) => void;
}

// Node personnalisé pour les employés
const EmployeeNode = ({ data }: any) => {
  const { employee, schedules, isAvailable } = data;
  
  return (
    <div className={`p-4 border rounded-lg bg-white shadow-lg min-w-[200px] ${
      isAvailable ? 'border-green-500' : 'border-orange-500'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4" />
        <span className="font-medium">{employee.team_member?.first_name} {employee.team_member?.last_name}</span>
        <Badge variant={isAvailable ? "default" : "secondary"}>
          {isAvailable ? 'Disponible' : 'Occupé'}
        </Badge>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="font-medium text-muted-foreground">Qualifications:</div>
        {employee.qualifications?.slice(0, 2).map((qual: string, idx: number) => (
          <div key={idx} className="text-xs bg-muted px-2 py-1 rounded">
            {qual}
          </div>
        ))}
      </div>
      
      {schedules.length > 0 && (
        <div className="mt-2 pt-2 border-t">
          <div className="text-xs text-muted-foreground">Prochaine tâche:</div>
          <div className="text-xs font-medium">{schedules[0]?.task_type}</div>
        </div>
      )}
      
      <div className="flex justify-between mt-2">
        <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white" 
             style={{ position: 'absolute', top: '-6px', left: '-6px' }} />
        <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white" 
             style={{ position: 'absolute', top: '-6px', right: '-6px' }} />
        <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white" 
             style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }} />
      </div>
    </div>
  );
};

// Node personnalisé pour les véhicules
const VehicleNode = ({ data }: any) => {
  const { vehicle, currentStep, urgency } = data;
  
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-orange-500 bg-orange-50';
      default: return 'border-green-500 bg-green-50';
    }
  };
  
  return (
    <div className={`p-4 border rounded-lg shadow-lg min-w-[180px] ${getUrgencyColor(urgency)}`}>
      <div className="flex items-center gap-2 mb-2">
        <Car className="w-4 h-4" />
        <span className="font-medium">{vehicle.license_plate}</span>
        {urgency === 'high' && <AlertTriangle className="w-4 h-4 text-red-500" />}
      </div>
      
      <div className="space-y-1 text-xs">
        <div>{vehicle.car_brands?.name} {vehicle.car_models?.name}</div>
        <div className="text-muted-foreground">
          Client: {vehicle.clients?.first_name} {vehicle.clients?.last_name}
        </div>
      </div>
      
      <div className="mt-2">
        <Badge variant="outline" className="text-xs">
          {currentStep}
        </Badge>
      </div>
      
      <div className="flex justify-between mt-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white" 
             style={{ position: 'absolute', top: '-6px', left: '-6px' }} />
        <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-white" 
             style={{ position: 'absolute', top: '-6px', right: '-6px' }} />
      </div>
    </div>
  );
};

// Node personnalisé pour les étapes de workflow
const WorkflowStepNode = ({ data }: any) => {
  const { step, duration, isActive, isCompleted } = data;
  
  return (
    <div className={`p-3 border rounded-lg shadow-lg min-w-[150px] ${
      isCompleted ? 'bg-green-50 border-green-500' : 
      isActive ? 'bg-blue-50 border-blue-500' : 
      'bg-gray-50 border-gray-300'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <Wrench className="w-4 h-4" />
        <span className="font-medium text-sm">{step}</span>
        {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
      </div>
      
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>{duration}</span>
      </div>
      
      <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white" 
           style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white" 
           style={{ position: 'absolute', bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }} />
    </div>
  );
};

const nodeTypes = {
  employee: EmployeeNode,
  vehicle: VehicleNode,
  workflowStep: WorkflowStepNode,
};

const KarrosseriePlanning: React.FC<KarrosseriePlanningProps> = ({
  employees = [],
  vehicles = [],
  schedules = [],
  onScheduleUpdate
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedView, setSelectedView] = useState<'workflow' | 'resources' | 'timeline'>('workflow');

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `${params.source}-${params.target}`,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      
      // Trigger callback for schedule update
      if (onScheduleUpdate) {
        onScheduleUpdate({
          source: params.source,
          target: params.target,
          type: 'assignment'
        });
      }
    },
    [onScheduleUpdate, setEdges],
  );

  // Générer les nodes et edges selon la vue sélectionnée
  useEffect(() => {
    const generateNodesAndEdges = () => {
      let newNodes: Node[] = [];
      let newEdges: Edge[] = [];

      if (selectedView === 'workflow') {
        // Vue workflow: étapes de traitement
        const workflowSteps = [
          'Accueil & Préparation',
          'Remplacement/Débosselage',
          'Préparation peinture',
          'Mise en peinture',
          'Finitions & remontage',
          'Clôture & livraison'
        ];

        workflowSteps.forEach((step, index) => {
          newNodes.push({
            id: `step-${index}`,
            type: 'workflowStep',
            position: { x: index * 200, y: 100 },
            data: {
              step,
              duration: `${2 + index}h`,
              isActive: index === 2, // Exemple
              isCompleted: index < 2,
            },
          });

          if (index > 0) {
            newEdges.push({
              id: `step-${index - 1}-step-${index}`,
              source: `step-${index - 1}`,
              target: `step-${index}`,
              type: 'smoothstep',
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
            });
          }
        });

        // Ajouter les véhicules dans le workflow
        vehicles.slice(0, 3).forEach((vehicle, index) => {
          newNodes.push({
            id: `vehicle-${vehicle.id}`,
            type: 'vehicle',
            position: { x: index * 300 + 50, y: 250 },
            data: {
              vehicle,
              currentStep: workflowSteps[Math.min(index + 1, workflowSteps.length - 1)],
              urgency: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
            },
          });
        });

      } else if (selectedView === 'resources') {
        // Vue ressources: employés et leurs affectations
        employees.forEach((employee, index) => {
          const employeeSchedules = schedules.filter(s => s.employee_id === employee.id);
          const isAvailable = employeeSchedules.length === 0 || 
                             !employeeSchedules.some(s => s.status === 'En cours');

          newNodes.push({
            id: `employee-${employee.id}`,
            type: 'employee',
            position: { x: (index % 3) * 300, y: Math.floor(index / 3) * 200 },
            data: {
              employee,
              schedules: employeeSchedules,
              isAvailable,
            },
          });
        });

        // Connecter les employés aux véhicules assignés
        schedules.forEach((schedule, index) => {
          if (schedule.vehicle_id && schedule.employee_id) {
            newEdges.push({
              id: `schedule-${index}`,
              source: `employee-${schedule.employee_id}`,
              target: `vehicle-${schedule.vehicle_id}`,
              type: 'smoothstep',
              animated: schedule.status === 'En cours',
              label: schedule.task_type,
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
            });
          }
        });

      } else if (selectedView === 'timeline') {
        // Vue timeline: organisation temporelle
        const today = new Date();
        const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
        
        timeSlots.forEach((time, index) => {
          newNodes.push({
            id: `time-${index}`,
            type: 'workflowStep',
            position: { x: index * 150, y: 50 },
            data: {
              step: time,
              duration: '2h',
              isActive: index === 2,
              isCompleted: index < 2,
            },
          });
        });

        // Placer les employés dans la timeline
        employees.slice(0, 4).forEach((employee, empIndex) => {
          newNodes.push({
            id: `timeline-employee-${employee.id}`,
            type: 'employee',
            position: { x: empIndex * 200, y: 150 + empIndex * 100 },
            data: {
              employee,
              schedules: schedules.filter(s => s.employee_id === employee.id),
              isAvailable: true,
            },
          });
        });
      }

      setNodes(newNodes);
      setEdges(newEdges);
    };

    generateNodesAndEdges();
  }, [selectedView, employees, vehicles, schedules, setNodes, setEdges]);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Karrosserie Planning
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedView === 'workflow' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('workflow')}
            >
              Workflow
            </Button>
            <Button
              variant={selectedView === 'resources' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('resources')}
            >
              Ressources
            </Button>
            <Button
              variant={selectedView === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedView('timeline')}
            >
              Timeline
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[600px] w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="top-right"
            className="bg-gray-50"
          >
            <MiniMap 
              zoomable 
              pannable 
              className="!bg-white !border !border-gray-200 !rounded-lg"
            />
            <Controls className="!bg-white !border !border-gray-200 !rounded-lg" />
            <Background 
              gap={20}
              size={1}
              className="bg-gray-100"
            />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};

export default KarrosseriePlanning;