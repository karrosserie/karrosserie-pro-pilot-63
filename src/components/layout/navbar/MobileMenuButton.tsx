
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuButtonProps {
  onClick: () => void;
}

const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={onClick}
      className="lg:hidden mr-2 h-9 w-9 sm:h-10 sm:w-10"
    >
      <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
    </Button>
  );
};

export default MobileMenuButton;
