
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Car, Plus, FileText, Euro, Calendar, MapPin, Trash2, Edit, Eye, File } from 'lucide-react';
import { useFleetViolations } from '@/hooks/use-fleet-violations';
import { FleetViolationForm } from './FleetViolationForm';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const FleetViolations: React.FC = () => {
  const { violations, isLoading, deleteViolation } = useFleetViolations();
  const [showForm, setShowForm] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente':
        return 'bg-orange-100 text-orange-800';
      case 'Payée':
        return 'bg-green-100 text-green-800';
      case 'Contestée':
        return 'bg-blue-100 text-blue-800';
      case 'Annulée':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const handleEdit = (violation: any) => {
    setSelectedViolation(violation);
    setShowForm(true);
  };

  const handleViewDocument = (documentUrl: string) => {
    window.open(documentUrl, '_blank');
  };

  const getDocumentIcon = (url: string) => {
    if (url.toLowerCase().includes('.pdf')) {
      return <File className="h-4 w-4" />;
    }
    return <Eye className="h-4 w-4" />;
  };

  const handleDelete = async (violationId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette contravention ?')) {
      await deleteViolation.mutateAsync(violationId);
    }
  };

  if (isLoading) {
    return (
      <div className="card-container">
        <h2 className="text-lg font-semibold text-foreground mb-4">Contraventions</h2>
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Contraventions</h2>
        <Button onClick={() => {
          setSelectedViolation(null);
          setShowForm(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une contravention
        </Button>
      </div>
      
      {!violations || violations.length === 0 ? (
        <div className="text-center py-8">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Aucune contravention enregistrée</p>
          <Button variant="outline" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter la première contravention
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {violations.map((violation) => (
            <div key={violation.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">
                      {violation.violation_type}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {violation.license_plate} • {violation.fleet_vehicles?.car_brands?.name} {violation.fleet_vehicles?.car_models?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(violation.payment_status)}>
                    {violation.payment_status}
                  </Badge>
                  {violation.document_url && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDocument(violation.document_url!)}
                      title="Voir le document"
                    >
                      {getDocumentIcon(violation.document_url)}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(violation)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(violation.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {format(new Date(violation.violation_date), 'dd MMMM yyyy', { locale: fr })}
                  {violation.violation_time && ` à ${violation.violation_time}`}
                </div>
                
                {violation.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {violation.location}
                  </div>
                )}
                
                <div className="flex items-center text-muted-foreground">
                  <Euro className="h-4 w-4 mr-2" />
                  {violation.fine_amount}€
                </div>
              </div>
              
              {violation.borrower_name && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Emprunteur: {violation.borrower_name}
                  {violation.borrower_phone && ` • ${violation.borrower_phone}`}
                </div>
              )}
              
              {violation.reference_number && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Référence: {violation.reference_number}
                  {violation.due_date && ` • Échéance: ${format(new Date(violation.due_date), 'dd/MM/yyyy', { locale: fr })}`}
                </div>
              )}
              
              {violation.notes && (
                <div className="mt-2 text-sm text-muted-foreground italic">
                  {violation.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <FleetViolationForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setSelectedViolation(null);
        }}
        violation={selectedViolation}
      />
    </div>
  );
};

export default FleetViolations;
