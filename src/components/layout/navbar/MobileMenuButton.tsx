
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
      className="lg:hidden h-10 w-10 sm:h-11 sm:w-11 hover:bg-gray-100/80 transition-colors"
    >
      <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
    </Button>
  );
};

export default MobileMenuButton;
