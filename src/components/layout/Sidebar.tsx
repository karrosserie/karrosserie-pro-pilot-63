
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Car, 
  FileText, 
  Home, 
  Users, 
  Clock, 
  Receipt, 
  Settings,
  CreditCard, 
  ChevronDown, 
  ChevronRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet
} from 'lucide-react';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  hasSubMenu?: boolean;
  subMenuItems?: { label: string; path: string }[];
}

const NavItem = ({ icon, label, path, isActive, hasSubMenu = false, subMenuItems = [] }: NavItemProps) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  
  const toggleSubMenu = (e: React.MouseEvent) => {
    if (hasSubMenu) {
      e.preventDefault();
      setIsSubMenuOpen(!isSubMenuOpen);
    }
  };

  return (
    <div className="mb-1">
      <Link
        to={path}
        onClick={toggleSubMenu}
        className={`flex items-center py-2 px-3 rounded-lg ${
          isActive 
            ? 'bg-karrosserie-orange bg-opacity-10 text-karrosserie-orange' 
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="mr-2">{icon}</span>
        <span className="flex-1">{label}</span>
        {hasSubMenu && (
          isSubMenuOpen 
            ? <ChevronDown className="h-4 w-4" /> 
            : <ChevronRight className="h-4 w-4" />
        )}
      </Link>
      
      {hasSubMenu && isSubMenuOpen && (
        <div className="ml-8 mt-1 space-y-1">
          {subMenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center py-1 px-3 rounded-md text-gray-600 hover:bg-gray-100 text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isMobile, isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  
  // Determine if a path is active - includes check for sub-paths as well
  const isActivePath = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: <Home className="app-icon" />, label: 'Tableau de bord', path: '/' },
    { icon: <Users className="app-icon" />, label: 'Clients', path: '/clients' },
    { icon: <Car className="app-icon" />, label: 'Véhicules', path: '/vehicles' },
    { 
      icon: <FileText className="app-icon" />, 
      label: 'Documents', 
      path: '/documents',
      hasSubMenu: true,
      subMenuItems: [
        { label: 'Rapports d\'expertise', path: '/documents/expertise' },
        { label: 'Devis', path: '/documents/devis' },
        { label: 'Ordres de réparation', path: '/documents/ordres' },
        { label: 'Factures', path: '/documents/factures' },
        { label: 'Avoirs', path: '/documents/avoirs' },
      ]
    },
    { icon: <CreditCard className="app-icon" />, label: 'Cession de créance', path: '/cessions' },
    { icon: <Clock className="app-icon" />, label: 'Véhicules de courtoisie', path: '/fleet' },
    { 
      icon: <DollarSign className="app-icon" />, 
      label: 'Paiements', 
      path: '/payments',
      hasSubMenu: true,
      subMenuItems: [
        { label: 'Encaissements', path: '/payments/receipts' },
        { label: 'Dépenses', path: '/payments/expenses' },
        { label: 'Gestion des comptes', path: '/payments/accounts' },
      ]
    },
    { icon: <Receipt className="app-icon" />, label: 'Comptabilité', path: '/accounting' },
    { icon: <Settings className="app-icon" />, label: 'Paramètres', path: '/settings' },
  ];

  // Handle overlay click
  const handleOverlayClick = () => {
    if (isMobile) {
      onClose();
    }
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transition-opacity"
          onClick={handleOverlayClick}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed lg:sticky top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:z-10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Always show logo in sidebar, regardless of its collapsed or open state */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-karrosserie-orange">
              Karrosserie<span className="text-karrosserie-gray ml-1">Pro</span>
            </span>
          </Link>
        </div>
        
        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <nav>
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={isActivePath(item.path)}
                hasSubMenu={item.hasSubMenu}
                subMenuItems={item.subMenuItems}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
