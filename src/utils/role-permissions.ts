import { UserRole } from '@/hooks/use-user-role';

export interface RolePermissions {
  allowedPaths: string[];
  defaultPath: string;
}

export const rolePermissions: Record<NonNullable<UserRole>, RolePermissions> = {
  'Propriétaire': {
    allowedPaths: ['*'], // Accès complet
    defaultPath: '/'
  },
  'Responsable': {
    allowedPaths: [
      '/',
      '/activity',
      '/ai-assistant', 
      '/profile',
      '/clients',
      '/vehicles',
      '/fleet',
      '/accounting',
      '/cessions',
      '/settings',
      '/help',
      '/planning',
      '/documents/*',
      '/payments/*'
    ],
    defaultPath: '/'
  },
  'Carrossier': {
    allowedPaths: ['/planning', '/profile', '/settings'],
    defaultPath: '/planning'
  },
  'Carrossier-vehicule de courtoisie': {
    allowedPaths: ['/planning', '/fleet', '/profile', '/settings'],
    defaultPath: '/planning'
  },
  'Responsable administratif': {
    allowedPaths: ['/admin/accounts', '/settings', '/profile'],
    defaultPath: '/admin/accounts'
  }
};

export function hasAccessToPath(role: UserRole, path: string): boolean {
  if (!role || !(role in rolePermissions)) {
    return false;
  }

  const permissions = rolePermissions[role];
  
  // Check if role has full access
  if (permissions.allowedPaths.includes('*')) {
    return true;
  }

  // Check exact matches
  if (permissions.allowedPaths.includes(path)) {
    return true;
  }

  // Check wildcard matches
  return permissions.allowedPaths.some(allowedPath => {
    if (allowedPath.endsWith('/*')) {
      const basePath = allowedPath.slice(0, -2);
      return path.startsWith(basePath);
    }
    return false;
  });
}

export function getDefaultPath(role: UserRole): string {
  if (!role || !(role in rolePermissions)) {
    return '/';
  }
  return rolePermissions[role].defaultPath;
}

export function getFilteredNavItems(role: UserRole, navItems: any[]): any[] {
  if (!role) return [];
  
  if (role === 'Propriétaire') {
    return navItems; // Propriétaire voit tout
  }

  return navItems.filter(item => {
    // Check if the main path is allowed
    if (!hasAccessToPath(role, item.path)) {
      return false;
    }

    // If item has submenu, filter submenu items
    if (item.hasSubMenu && item.subMenuItems) {
      const filteredSubItems = item.subMenuItems.filter((subItem: any) => 
        hasAccessToPath(role, subItem.path)
      );
      
      // Only show parent if it has accessible subitems
      if (filteredSubItems.length === 0) {
        return false;
      }
      
      // Update the item with filtered subitems
      item.subMenuItems = filteredSubItems;
    }

    return true;
  });
}