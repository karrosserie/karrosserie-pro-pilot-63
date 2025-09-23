import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle2, ChevronDown, ChevronRight, Clock, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskInstruction {
  number: number;
  task: string;
}

interface DetailedInstructions {
  instructions: TaskInstruction[];
  received_at: string;
  task_type_confirmed: string;
  source: string;
}

interface TaskInstructionsProps {
  instructions: DetailedInstructions;
  className?: string;
}

export const TaskInstructions: React.FC<TaskInstructionsProps> = ({ 
  instructions, 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const handleStepToggle = (stepNumber: number) => {
    const newCheckedSteps = new Set(checkedSteps);
    if (newCheckedSteps.has(stepNumber)) {
      newCheckedSteps.delete(stepNumber);
    } else {
      newCheckedSteps.add(stepNumber);
    }
    setCheckedSteps(newCheckedSteps);
  };

  const formatReceivedTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const completedSteps = checkedSteps.size;
  const totalSteps = instructions.instructions.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Bot className="w-4 h-4 text-primary" />
                Instructions IA détaillées
                <Badge variant="secondary" className="text-xs">
                  {completedSteps}/{totalSteps}
                </Badge>
              </CardTitle>
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
        
        {isOpen && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Clock className="w-3 h-3" />
            Reçu le {formatReceivedTime(instructions.received_at)}
          </div>
        )}
      </CardHeader>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Barre de progression */}
            {totalSteps > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progression</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Liste des instructions */}
            <div className="space-y-3">
              {instructions.instructions.map((instruction) => {
                const isChecked = checkedSteps.has(instruction.number);
                
                return (
                  <div
                    key={instruction.number}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-md border transition-all duration-200 cursor-pointer",
                      isChecked 
                        ? "bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700" 
                        : "bg-background border-border hover:bg-muted/30"
                    )}
                    onClick={() => handleStepToggle(instruction.number)}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center",
                        isChecked 
                          ? "bg-green-600 text-white" 
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <span className="text-xs font-medium">{instruction.number}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p 
                        className={cn(
                          "text-sm leading-relaxed",
                          isChecked 
                            ? "text-muted-foreground line-through" 
                            : "text-foreground"
                        )}
                      >
                        {instruction.task}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Métadonnées */}
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Type de tâche confirmé: {instructions.task_type_confirmed}</span>
                <Badge variant="outline" className="text-xs">
                  {instructions.source}
                </Badge>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};