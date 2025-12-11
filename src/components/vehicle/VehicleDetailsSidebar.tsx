import React from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Car,
  FileText,
  Calculator,
  Wrench,
  Receipt,
  CreditCard,
  Banknote,
  ClipboardList,
  Camera,
  PaintBucket
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  count: number;
}

interface VehicleDetailsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sidebarItems: SidebarItem[];
}

export const VehicleDetailsSidebar: React.FC<VehicleDetailsSidebarProps> = ({
  activeTab,
  onTabChange,
  sidebarItems
}) => {
  return (
    <>
      {/* Version mobile - onglets horizontaux scrollables */}
      <div className="md:hidden w-full border-b border-gray-200 bg-gray-50 overflow-x-auto">
        <div className="flex p-2 gap-1 min-w-max">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-karrosserie-orange/10 text-karrosserie-orange border border-karrosserie-orange/20"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon 
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    isActive ? "text-karrosserie-orange" : "text-gray-500"
                  )}
                />
                <span className="hidden sm:inline">{item.label}</span>
                {item.count > 0 && (
                  <Badge 
                    className="text-[10px] min-w-[18px] h-4 flex items-center justify-center bg-karrosserie-orange text-white font-medium"
                  >
                    {item.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Version desktop - sidebar verticale */}
      <div className="hidden md:block w-56 lg:w-64 border-r border-gray-200 bg-gray-50 h-full flex-shrink-0">
        <div className="p-3 lg:p-4">
          <h3 className="font-semibold text-gray-900 mb-3 lg:mb-4 text-sm lg:text-base">Navigation</h3>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-karrosserie-orange/10 text-karrosserie-orange border border-karrosserie-orange/20"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Icon 
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive ? "text-karrosserie-orange" : "text-gray-500"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  
                  {item.count > 0 && (
                    <Badge 
                      className={cn(
                        "text-xs min-w-[20px] h-5 flex items-center justify-center text-white font-medium",
                        isActive 
                          ? "bg-karrosserie-orange text-white" 
                          : "bg-karrosserie-orange text-white"
                      )}
                    >
                      {item.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

// Configuration des icônes pour chaque section véhicule
export const getVehicleSidebarItems = (
  vehicleReports: any[],
  vehicleQuotes: any[],
  vehicleOrders: any[],
  vehicleInvoices: any[],
  vehicleCredits: any[],
  vehicleReceipts: any[],
  totalPhotos: number = 0,
  paintReportsCount: number = 0
): SidebarItem[] => [
  {
    id: 'details',
    label: 'Informations véhicule',
    icon: Car,
    count: 0
  },
  {
    id: 'expertise',
    label: 'Rapports d\'expertise',
    icon: FileText,
    count: vehicleReports.length
  },
  {
    id: 'quotes',
    label: 'Devis',
    icon: Calculator,
    count: vehicleQuotes.length
  },
  {
    id: 'repair-orders',
    label: 'Ordres de réparation',
    icon: Wrench,
    count: vehicleOrders.length
  },
  {
    id: 'paint-weighing',
    label: 'Pesées peinture',
    icon: PaintBucket,
    count: paintReportsCount
  },
  {
    id: 'invoices',
    label: 'Factures',
    icon: Receipt,
    count: vehicleInvoices.length
  },
  {
    id: 'credits',
    label: 'Avoirs',
    icon: CreditCard,
    count: vehicleCredits.length
  },
  {
    id: 'receipts',
    label: 'Encaissements',
    icon: Banknote,
    count: vehicleReceipts.length
  },
  {
    id: 'images',
    label: 'Images',
    icon: Camera,
    count: totalPhotos
  }
];