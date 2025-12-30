import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  User, 
  Car, 
  Phone, 
  Mail, 
  MapPin,
  FileText,
  MessageSquare,
  Clock,
  History
} from 'lucide-react';
import { useDossier } from '@/hooks/useDossiers';
import { DOSSIER_STATUS_CONFIG, DossierOverallStatus } from '@/types/dossier';
import { cn } from '@/lib/utils';
import { DossierTimeline } from '@/components/dossiers/DossierTimeline';
import { DossierDocuments } from '@/components/dossiers/DossierDocuments';
import { DossierMessageries } from '@/components/dossiers/DossierMessageries';
import { DossierHistory } from '@/components/dossiers/DossierHistory';

const DossierDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chronologie');

  const { data: dossier, isLoading, error } = useDossier(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Dossier non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le dossier demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/dossiers')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux dossiers
          </Button>
        </div>
      </div>
    );
  }

  const client = dossier.clients;
  const vehicle = dossier.vehicles;
  const status = dossier.overall_status as DossierOverallStatus;
  const statusConfig = status ? DOSSIER_STATUS_CONFIG[status] : null;

  const clientName = client 
    ? client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() 
    : 'Client inconnu';

  const vehicleInfo = vehicle 
    ? `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''}`.trim() 
    : null;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dossiers')}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            Dossier {dossier.reference || vehicle?.license_plate || 'N/A'}
          </h1>
          {statusConfig && (
            <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0')}>
              {statusConfig.label}
            </Badge>
          )}
        </div>
      </div>

      {/* Summary Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Info */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2 text-foreground">
              <User className="h-4 w-4 text-primary" />
              Client
            </h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{clientName}</p>
              {client?.phone && (
                <a 
                  href={`tel:${client.phone}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {client.phone}
                </a>
              )}
              {client?.email && (
                <a 
                  href={`mailto:${client.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {client.email}
                </a>
              )}
              {(client?.address || client?.city) && (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {[client.address, client.postal_code, client.city].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2 text-foreground">
              <Car className="h-4 w-4 text-primary" />
              Véhicule
            </h3>
            <div className="space-y-2 text-sm">
              {vehicle?.license_plate && (
                <Badge variant="outline" className="font-mono text-sm">
                  {vehicle.license_plate}
                </Badge>
              )}
              {vehicleInfo && (
                <p className="font-medium text-foreground">{vehicleInfo}</p>
              )}
              {vehicle?.vin && (
                <p className="text-muted-foreground">
                  VIN: <span className="font-mono">{vehicle.vin}</span>
                </p>
              )}
              {vehicle?.mileage && (
                <p className="text-muted-foreground">
                  Kilométrage: {vehicle.mileage.toLocaleString()} km
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional dossier info */}
        {(dossier.claim_number || dossier.policy_number) && (
          <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {dossier.claim_number && (
              <div>
                <span className="text-muted-foreground">N° Sinistre:</span>
                <p className="font-medium">{dossier.claim_number}</p>
              </div>
            )}
            {dossier.policy_number && (
              <div>
                <span className="text-muted-foreground">N° Police:</span>
                <p className="font-medium">{dossier.policy_number}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="chronologie" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Chronologie</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="messageries" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messageries</span>
          </TabsTrigger>
          <TabsTrigger value="historique" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chronologie" className="mt-6">
          <DossierTimeline dossier={dossier} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DossierDocuments dossier={dossier} />
        </TabsContent>

        <TabsContent value="messageries" className="mt-6">
          <DossierMessageries dossierId={dossier.id} />
        </TabsContent>

        <TabsContent value="historique" className="mt-6">
          <DossierHistory dossier={dossier} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DossierDetail;
