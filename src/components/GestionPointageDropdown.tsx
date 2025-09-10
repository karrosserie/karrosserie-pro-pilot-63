import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Clock, Play, Pause, LogOut } from 'lucide-react';

interface GestionPointageDropdownProps {
  aPointe: boolean;
  enPause: boolean;
  onPointer: () => void;
  onPause: () => void;
  onDepart: () => void;
}

export const GestionPointageDropdown: React.FC<GestionPointageDropdownProps> = ({
  aPointe,
  enPause,
  onPointer,
  onPause,
  onDepart
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Pointage
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!aPointe ? (
          <DropdownMenuItem onClick={onPointer}>
            <Clock className="h-4 w-4 mr-2" />
            Pointer l'arrivée
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onClick={onPause}>
              {enPause ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Reprendre le travail
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Prendre une pause
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDepart}>
              <LogOut className="h-4 w-4 mr-2" />
              Pointer le départ
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};