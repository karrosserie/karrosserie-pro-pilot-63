
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
  Wallet,
  Bot,
  X,
  HelpCircle,
  Calendar
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
  onClose?: () => void;
}

const NavItem = ({ icon, label, path, isActive, hasSubMenu = false, subMenuItems = [], onClose }: NavItemProps) => {
  const location = useLocation();
  
  // Check if any submenu item is active to determine if submenu should be open by default
  const hasActiveSubItem = hasSubMenu && subMenuItems.some(item => location.pathname === item.path);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(hasActiveSubItem);
  
  // Update submenu state when location changes
  React.useEffect(() => {
    if (hasSubMenu) {
      const shouldBeOpen = subMenuItems.some(item => location.pathname === item.path);
      setIsSubMenuOpen(shouldBeOpen);
    }
  }, [location.pathname, hasSubMenu, subMenuItems]);
  
  const toggleSubMenu = (e: React.MouseEvent) => {
    if (hasSubMenu) {
      e.preventDefault();
      setIsSubMenuOpen(!isSubMenuOpen);
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="mb-1">
      <Link
        to={path}
        onClick={toggleSubMenu}
        className={`flex items-center py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
          isActive 
            ? 'bg-karrosserie-orange bg-opacity-10 text-karrosserie-orange' 
            : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
        }`}
      >
        <span className="mr-3 flex-shrink-0">{icon}</span>
        <span className="flex-1 truncate">{label}</span>
        {hasSubMenu && (
          <span className="ml-2 flex-shrink-0">
            {isSubMenuOpen 
              ? <ChevronDown className="h-4 w-4" /> 
              : <ChevronRight className="h-4 w-4" />
            }
          </span>
        )}
      </Link>
      
      {hasSubMenu && isSubMenuOpen && (
        <div className="ml-8 mt-1 space-y-1">
          {subMenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={onClose}
              className="flex items-center py-2 px-3 rounded-md text-gray-600 hover:bg-gray-100 active:bg-gray-200 text-sm transition-colors"
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
  
  const isActivePath = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: <Home className="app-icon" />, label: 'Tableau de bord', path: '/' },
    { icon: <Bot className="app-icon" />, label: 'Assistant IA', path: '/ai-assistant' },
    { icon: <Users className="app-icon" />, label: 'Clients', path: '/clients' },
    { icon: <Car className="app-icon" />, label: 'Véhicules', path: '/vehicles' },
    { icon: <Calendar className="app-icon" />, label: 'Planning', path: '/planning' },
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
    { icon: <HelpCircle className="app-icon" />, label: 'Aide', path: '/help' },
    { icon: <Settings className="app-icon" />, label: 'Paramètres', path: '/settings' },
  ];

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
        className={`fixed lg:sticky top-0 left-0 h-full w-80 sm:w-72 lg:w-64 bg-white border-r border-gray-200 z-50 lg:z-10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header with close button on mobile */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center" onClick={isMobile ? onClose : undefined}>
            <span className="text-xl font-bold text-karrosserie-orange">
              Karrosserie<span className="text-karrosserie-gray ml-1">Pro</span>
            </span>
          </Link>
          {isMobile && (
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={isActivePath(item.path)}
                hasSubMenu={item.hasSubMenu}
                subMenuItems={item.subMenuItems}
                onClose={isMobile ? onClose : undefined}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
