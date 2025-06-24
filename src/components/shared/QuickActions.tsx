
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Phone, Mail, MessageSquare, FileText, Calculator, Car, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut: string;
  action: () => void;
  color: string;
}

const QuickActions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const actions: QuickAction[] = [
    {
      id: 'call',
      label: 'Appeler client',
      icon: Phone,
      shortcut: 'Cmd+1',
      action: () => console.log('Call client'),
      color: 'bg-green-500 hover:bg-green-600 text-white'
    },
    {
      id: 'email',
      label: 'Envoyer email',
      icon: Mail,
      shortcut: 'Cmd+2',
      action: () => console.log('Send email'),
      color: 'bg-blue-500 hover:bg-blue-600 text-white'
    },
    {
      id: 'sms',
      label: 'Envoyer SMS',
      icon: MessageSquare,
      shortcut: 'Cmd+3',
      action: () => console.log('Send SMS'),
      color: 'bg-purple-500 hover:bg-purple-600 text-white'
    },
    {
      id: 'quote',
      label: 'Nouveau devis',
      icon: Calculator,
      shortcut: 'Cmd+4',
      action: () => console.log('New quote'),
      color: 'bg-orange-500 hover:bg-orange-600 text-white'
    },
    {
      id: 'vehicle',
      label: 'Ajouter véhicule',
      icon: Car,
      shortcut: 'Cmd+5',
      action: () => console.log('Add vehicle'),
      color: 'bg-indigo-500 hover:bg-indigo-600 text-white'
    },
    {
      id: 'client',
      label: 'Nouveau client',
      icon: Users,
      shortcut: 'Cmd+6',
      action: () => console.log('New client'),
      color: 'bg-teal-500 hover:bg-teal-600 text-white'
    }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    
    const rect = dragRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Constrain to viewport
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;
      
      setPosition({
        x: Math.max(20, Math.min(newX, maxX)),
        y: Math.max(20, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div 
      ref={dragRef}
      className="fixed z-50"
      style={{ 
        right: `${position.x}px`, 
        bottom: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {isOpen && (
        <Card className="mb-4 p-4 shadow-xl border-2 bg-white">
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`${action.color} flex flex-col items-center justify-center h-20 w-24 relative group`}
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                  }}
                >
                  <IconComponent className="h-5 w-5 mb-1" />
                  <span className="text-xs text-center leading-tight">
                    {action.label}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {action.shortcut}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </Card>
      )}

      <Button
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={handleMouseDown}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default QuickActions;
