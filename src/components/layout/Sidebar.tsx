
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Euro,
  TrendingUp,
  TrendingDown,
  Wallet,
  Bot,
  X,
  HelpCircle,
  Calendar,
  Shield,
  MessageSquare,
  Scale,
  LayoutDashboard
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/hooks/use-admin';
import { useUserRole } from '@/hooks/use-user-role';
import { useSystemAlerts } from '@/hooks/use-system-alerts';

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
  openMenuPath: string | null;
  onMenuToggle: (path: string | null) => void;
  badgeCount?: number;
}

const NavItem = ({ icon, label, path, isActive, hasSubMenu = false, subMenuItems = [], onClose, openMenuPath, onMenuToggle, badgeCount }: NavItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if any submenu item is active to determine if submenu should be open by default
  const hasActiveSubItem = hasSubMenu && subMenuItems.some(item => location.pathname === item.path);
  const isSubMenuOpen = openMenuPath === path || hasActiveSubItem;
  
  // Update global menu state when location changes to ensure active submenu stays open
  React.useEffect(() => {
    if (hasSubMenu && hasActiveSubItem && openMenuPath !== path) {
      onMenuToggle(path);
    }
  }, [location.pathname, hasSubMenu, hasActiveSubItem, path, openMenuPath, onMenuToggle]);
  
  const handleClick = (e: React.MouseEvent) => {
    if (hasSubMenu) {
      e.preventDefault();
      
      if (isSubMenuOpen) {
        // Si le menu est ouvert, le fermer
        onMenuToggle(null);
      } else {
        // Si le menu est fermé, l'ouvrir et rediriger vers le premier sous-onglet
        onMenuToggle(path);
        if (subMenuItems.length > 0) {
          navigate(subMenuItems[0].path);
        }
      }
    } else if (onClose) {
      // Pour les éléments sans sous-menu, fermer la sidebar mobile et fermer tous les menus
      onMenuToggle(null);
      onClose();
    }
  };

  return (
    <div className="mb-1">
      <Link
        to={hasSubMenu ? '#' : path}
        onClick={handleClick}
        className={`flex items-center py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
          isActive 
            ? 'bg-karrosserie-orange/10 text-karrosserie-orange border border-karrosserie-orange/20' 
            : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
        }`}
      >
        <span className="mr-3 flex-shrink-0">{icon}</span>
        <span className="flex-1 truncate">{label}</span>
        {badgeCount !== undefined && badgeCount > 0 && (
          <Badge className="ml-2 bg-karrosserie-orange hover:bg-karrosserie-orange text-white">
            {badgeCount}
          </Badge>
        )}
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
          {subMenuItems.map((item, index) => {
            const isSubItemActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => {
                  // Fermer tous les menus et la sidebar mobile
                  onMenuToggle(null);
                  if (onClose) onClose();
                }}
                className={`flex items-center py-2 px-3 rounded-md text-sm transition-colors ${
                  isSubItemActive 
                    ? 'bg-karrosserie-orange/20 text-karrosserie-orange font-medium border border-karrosserie-orange/30' 
                    : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isMobile, isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { isAdmin } = useAdmin();
  const { userRole, isCarrossierCourtesy, isCarrossier, isResponsable, isResponsableAdmin } = useUserRole();
  const { alerts } = useSystemAlerts();
  
  // État global pour gérer quel menu déroulant est ouvert
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  
  // Compter les alertes non traitées
  const unhandledAlertsCount = alerts.length;
  
  const isActivePath = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Routes temporairement désactivées (facile à réactiver)
  const DISABLED_ROUTES = ['/planning'];

  // Définir tous les éléments de navigation
  const allNavItems = [
    { icon: <LayoutDashboard className="app-icon" />, label: 'Dashboard', path: '#' },
    { icon: <Bot className="app-icon" />, label: 'Tour de contrôle', path: '/ai-assistant' },
    { icon: <Home className="app-icon" />, label: 'Vue synthétique', path: '/' },
    { icon: <MessageSquare className="app-icon" />, label: 'Messageries', path: '/messageries' },
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
        { label: 'Bon de commande', path: '/documents/bon-commande' },
      ]
    },
    { 
      icon: <Euro className="app-icon" />, 
      label: 'Paiements', 
      path: '/payments',
      hasSubMenu: true,
      subMenuItems: [
        { label: 'Gestion des paiements et transactions', path: '/payments/management' },
        { label: 'Relance de paiement', path: '/payments/relances' },
        { label: 'Comptabilité', path: '/payments/accounting' },
      ]
    },
    { icon: <CreditCard className="app-icon" />, label: 'Cession de créance', path: '/cessions' },
    { 
      icon: <Scale className="app-icon" />, 
      label: 'Contentieux Tribunal', 
      path: '/contentieux',
      hasSubMenu: true,
      subMenuItems: [
        { label: 'Création d\'un dossier judiciaire', path: '/contentieux/creation-dossier' },
        { label: 'Dépôt de dossier', path: '/contentieux/depot-dossier' },
      ]
    },
    { icon: <Clock className="app-icon" />, label: 'Véhicules de courtoisie', path: '/fleet' },
    { icon: <HelpCircle className="app-icon" />, label: 'Aide', path: '/help' },
    ...(isAdmin ? [{ icon: <Shield className="app-icon" />, label: 'Accès aux comptes', path: '/admin/accounts' }] : []),
    { icon: <Settings className="app-icon" />, label: 'Paramètres', path: '/settings' },
  ];

  // Filtrer les routes désactivées
  const enabledNavItems = allNavItems.filter(item => !DISABLED_ROUTES.includes(item.path));

  // Filtrer les éléments selon le rôle de l'utilisateur
  let navItems = enabledNavItems;

  if (isCarrossier) {
    // Carrossier : seulement planning
    navItems = allNavItems.filter(item => 
      item.path === '/planning'
    );
  } else if (isCarrossierCourtesy) {
    // Carrossier-véhicule de courtoisie : planning et véhicules de courtoisie
    navItems = allNavItems.filter(item => 
      item.path === '/planning' || 
      item.path === '/fleet'
    );
  } else if (isResponsable) {
    // Responsable : tableau de bord, clients, véhicules, planning, véhicules de courtoisie, messageries
    navItems = allNavItems.filter(item => 
      item.path === '/' ||
      item.path === '/clients' ||
      item.path === '/vehicles' ||
      item.path === '/planning' ||
      item.path === '/messageries' ||
      item.path === '/fleet' ||
      item.path === '/settings' ||
      item.path === '/help'
    );
  } else if (isResponsableAdmin) {
    // Responsable administratif : documents, paiements, tableau de bord, assistant IA, cession de créance, comptabilité, messageries
    navItems = allNavItems.filter(item => 
      item.path === '/' ||
      item.path === '/ai-assistant' ||
      item.path === '/messageries' ||
      item.path === '/documents' ||
      item.path === '/payments' ||
      item.path === '/cessions' ||
      item.path === '/settings' ||
      item.path === '/help'
    );
  }

  const [isTablet, setIsTablet] = useState(false);

  // Détecter si on est sur tablette
  React.useEffect(() => {
    const checkIsTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkIsTablet();
    window.addEventListener('resize', checkIsTablet);
    return () => window.removeEventListener('resize', checkIsTablet);
  }, []);

  const handleOverlayClick = () => {
    if (isMobile || isTablet) {
      onClose();
    }
  };
  
  return (
    <>
      {/* Mobile and Tablet overlay */}
      {(isMobile || isTablet) && isOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transition-opacity lg:hidden"
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
                openMenuPath={openMenuPath}
                onMenuToggle={setOpenMenuPath}
                badgeCount={item.path === '/ai-assistant' ? unhandledAlertsCount : undefined}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
