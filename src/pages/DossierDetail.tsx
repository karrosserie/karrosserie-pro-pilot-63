import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronRight,
  User, 
  Car, 
  Phone, 
  Mail, 
  MapPin,
  Building2,
  FileText,
  MessageSquare,
  Clock,
  History,
  Edit,
  Archive,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDossier, useArchiveDossier } from '@/hooks/useDossiers';
import { DOSSIER_STATUS_CONFIG, DossierOverallStatus } from '@/types/dossier';
import { cn } from '@/lib/utils';
import { DossierTimeline } from '@/components/dossiers/DossierTimeline';
import { DossierDocuments } from '@/components/dossiers/DossierDocuments';
import { DossierMessageries } from '@/components/dossiers/DossierMessageries';
import { DossierHistory } from '@/components/dossiers/DossierHistory';
import { toast } from 'sonner';

const DossierDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chronologie');

  const { data: dossier, isLoading, error } = useDossier(id);
  const archiveDossier = useArchiveDossier();

  const handleArchive = async () => {
    if (!dossier?.id) return;
    try {
      await archiveDossier.mutateAsync(dossier.id);
      toast.success('Dossier archivé avec succès');
      navigate('/dossiers');
    } catch (error) {
      toast.error('Erreur lors de l\'archivage');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6 space-y-6 max-w-[1400px]">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6 max-w-[1400px]">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">Dossier non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le dossier demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/dossiers')} variant="outline">
            Retour aux dossiers
          </Button>
        </div>
      </div>
    );
  }

  const client = dossier.clients;
  const vehicle = dossier.vehicles;
  const insurance = dossier.insurance_companies;
  const status = dossier.overall_status as DossierOverallStatus;
  const statusConfig = status ? DOSSIER_STATUS_CONFIG[status] : null;

  const clientName = client 
    ? client.company_name || `${client.first_name || ''} ${client.last_name || ''}`.trim() 
    : 'Client inconnu';

  const vehicleInfo = vehicle 
    ? `${vehicle.car_brands?.name || ''} ${vehicle.car_models?.name || ''}`.trim() 
    : null;

  const dossierReference = dossier.reference || `DOS-${dossier.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Breadcrumb */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 md:px-6 py-4 max-w-[1400px]">
          <nav className="flex items-center gap-2 text-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => navigate('/dossiers')}
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <Link 
              to="/dossiers" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dossiers
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{dossierReference}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4 md:px-6 space-y-6 max-w-[1400px]">
        {/* Summary Card */}
        <Card className="p-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground mb-2">{dossierReference}</h1>
              {statusConfig && (
                <Badge className={cn(statusConfig.bgColor, statusConfig.color, 'border-0')}>
                  {statusConfig.label}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Modifier
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleArchive}
              >
                <Archive className="h-4 w-4" />
                Archiver
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Générer PDF</DropdownMenuItem>
                  <DropdownMenuItem>Envoyer par email</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* 3-Column Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Client Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <User className="h-4 w-4 text-[hsl(var(--karrosserie-orange))]" />
                Client
              </div>
              <p className="font-medium text-foreground">{clientName}</p>
              {client?.phone && (
                <p className="text-sm text-muted-foreground">{client.phone}</p>
              )}
              {client?.email && (
                <p className="text-sm text-muted-foreground">{client.email}</p>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Car className="h-4 w-4 text-[hsl(var(--karrosserie-orange))]" />
                Véhicule
              </div>
              {vehicle?.license_plate && (
                <p className="font-medium text-foreground">{vehicle.license_plate}</p>
              )}
              {vehicleInfo && (
                <p className="text-sm text-muted-foreground">{vehicleInfo}</p>
              )}
              {vehicle?.vin && (
                <p className="text-sm text-muted-foreground">
                  VIN: {vehicle.vin.length > 10 ? `${vehicle.vin.slice(0, 10)}...` : vehicle.vin}
                </p>
              )}
            </div>

            {/* Insurance Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Building2 className="h-4 w-4 text-[hsl(var(--karrosserie-orange))]" />
                Assurance
              </div>
              {insurance?.name ? (
                <p className="font-medium text-foreground">{insurance.name}</p>
              ) : (
                <p className="text-muted-foreground italic text-sm">Non renseignée</p>
              )}
              {dossier.policy_number && (
                <p className="text-sm text-muted-foreground">
                  Police: {dossier.policy_number}
                </p>
              )}
              {dossier.claim_number && (
                <p className="text-sm text-muted-foreground">
                  Sinistre: {dossier.claim_number}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex bg-muted p-1 rounded-lg h-auto">
            <TabsTrigger 
              value="chronologie" 
              className="px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md text-sm"
            >
              Chronologie
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md text-sm"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="messageries" 
              className="px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md text-sm"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger 
              value="historique" 
              className="px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md text-sm"
            >
              Historique
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
    </div>
  );
};

export default DossierDetail;
