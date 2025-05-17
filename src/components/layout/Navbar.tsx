
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  return (
    <div className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="lg:hidden mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-karrosserie-orange">
              Karrosserie<span className="text-karrosserie-gray ml-1">Pro</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center relative max-w-md w-full mx-4">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-karrosserie-orange"
          />
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-600"
          >
            <Search className="h-5 w-5 md:hidden" />
            <Bell className="h-5 w-5 hidden md:block" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-600"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
