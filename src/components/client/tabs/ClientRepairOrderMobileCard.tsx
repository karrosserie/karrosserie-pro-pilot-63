import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  Eye, 
  Pencil, 
  Download, 
  Mail, 
  MoreHorizontal,
  Printer,
  Signature,
  FileCheck,
  ArrowRight,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RepairOrder } from '@/services/supabase/repair-orders';
import { calculateOrderAmount } from '@/components/repair-orders/utils/orderCalculations';

interface ClientRepairOrderMobileCardProps {
  order: RepairOrder;
  onView: (order: RepairOrder) => void;
  onEdit: (order: RepairOrder) => void;
  onDownload: (order: RepairOrder) => void;
  onPrint: (order: RepairOrder) => void;
  onSendEmail: (order: RepairOrder) => void;
  onSign: (order: RepairOrder) => void;
  onRequestDocuments: (order: RepairOrder) => void;
  onConvertToInvoice: (order: RepairOrder) => void;
  onDelete: (order: RepairOrder) => void;
}

const ClientRepairOrderMobileCard: React.FC<ClientRepairOrderMobileCardProps> = ({
  order,
  onView,
  onEdit,
  onDownload,
  onPrint,
  onSendEmail,
  onSign,
  onRequestDocuments,
  onConvertToInvoice,
  onDelete
}) => {
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return '-';
    }
  };

  const vehicleDisplay = order.vehicles 
    ? `${order.vehicles.car_brands?.name || ''} ${order.vehicles.car_models?.name || ''} - ${order.vehicles.license_plate}`
    : '-';

  const hasInvoice = order.invoices && order.invoices.length > 0;

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-semibold text-foreground">{order.reference}</p>
            <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
          </div>
          <StatusBadge status={order.status || 'En cours'} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">Véhicule:</span>
            <p className="font-medium truncate">{vehicleDisplay}</p>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground">Montant:</span>
            <p className="font-semibold text-primary">{formatAmount(calculateOrderAmount(order))}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onView(order)} title="Voir">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(order)} title="Modifier">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDownload(order)} title="Télécharger">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onSendEmail(order)} title="Envoyer">
              <Mail className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPrint(order)}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </DropdownMenuItem>
              {order.status !== 'Signé' && (
                <DropdownMenuItem onClick={() => onSign(order)}>
                  <Signature className="h-4 w-4 mr-2" />
                  Signature client
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onRequestDocuments(order)}>
                <FileCheck className="h-4 w-4 mr-2" />
                Demander docs
              </DropdownMenuItem>
              {!hasInvoice && (
                <DropdownMenuItem onClick={() => onConvertToInvoice(order)}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Convertir en facture
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(order)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientRepairOrderMobileCard;
