import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, Download, Eye, Pencil, Trash, Play, Loader2 } from 'lucide-react';
import { Cession } from '@/services/supabase/cessions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { repairOrdersService } from '@/services/supabase/repair-orders';
import { validateCessionProcedureData } from '@/components/cessions/form/utils/dataValidation';
import { CessionPreview } from './CessionPreview';
import { generateAndUploadCessionPDF } from '@/services/pdf/pdfService';
import { updateCession } from '@/services/supabase/cessions';
import { useCompany } from '@/hooks/use-company';
import { useInsuranceCompanies } from '@/hooks/use-insurance-companies';
import { sendForSignature } from '@/services/api/signatureService';
import { companyService } from '@/services/supabase/company';
import { supabase } from '@/integrations/supabase/client';
import { clientsService } from '@/services/supabase/clients';
import { useTableSorting } from '@/hooks/use-table-sorting';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';

interface CessionsTableProps {
  cessions: Cession[];
  isLoading: boolean;
  onEditCession: (cession: Cession) => void;
  onDeleteCession: (id: string) => void;
}

export const CessionsTable = ({
  cessions,
  isLoading,
  onEditCession,
  onDeleteCession
}: CessionsTableProps) => {
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedCession, setSelectedCession] = useState<Cession | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const { companyData } = useCompany();
  const { insuranceCompanies } = useInsuranceCompanies();
  const { sortedData, sortConfig, handleSort } = useTableSorting(cessions, 'created_at');

  
  const parseValidationError = (validationError: string) => {
    const lines = validationError.split('\n').filter(line => line.trim() !== '');
    const sections: { title: string; items: string[] }[] = [];
    let currentSection: { title: string; items: string[] } | null = null;
    
    lines.forEach(line => {
      if (line.includes('Fiche client :')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Fiche client', items: [] };
      } else if (line.includes('Fiche véhicule :')) {
        if (currentSection) sections.push(currentSection);
        currentSection = { title: 'Fiche véhicule', items: [] };
      } else if (line.trim().startsWith('- ')) {
        if (currentSection) {
          currentSection.items.push(line.trim().substring(2));
        }
      }
    });
    
    if (currentSection) sections.push(currentSection);
    return sections;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'bg-gray-100 text-gray-800';
      case 'en_attente_signature':
        return 'bg-yellow-100 text-yellow-800';
      case 'signee':
        return 'bg-green-100 text-green-800';
      case 'signature_refusee':
        return 'bg-red-100 text-red-800';
      case 'lettre_recommandee_envoyee':
        return 'bg-blue-100 text-blue-800';
      case 'lettre_recommandee_recue':
        return 'bg-indigo-100 text-indigo-800';
      case 'lettre_recommandee_non_recuperee':
        return 'bg-orange-100 text-orange-800';
      case 'lettre_recommandee_refusee':
        return 'bg-red-100 text-red-800';
      case 'lettre_recommandee_presentee':
        return 'bg-purple-100 text-purple-800';
      case 'payee':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'en_attente_signature':
        return 'En attente de signature';
      case 'signee':
        return 'Signée';
      case 'signature_refusee':
        return 'Signature refusée';
      case 'lettre_recommandee_envoyee':
        return 'Lettre recommandée envoyée';
      case 'lettre_recommandee_recue':
        return 'Lettre recommandée reçue';
      case 'lettre_recommandee_non_recuperee':
        return 'Lettre recommandée non récupérée';
      case 'lettre_recommandee_refusee':
        return 'Lettre recommandée refusée';
      case 'lettre_recommandee_presentee':
        return 'Lettre recommandée présentée';
      case 'payee':
        return 'Payée';
      default:
        return status;
    }
  };

  const formatRepairOrderDisplay = (cession: Cession) => {
    if (!cession.repair_orders) {
      return cession.repair_order_id ? `Ordre lié (ID: ${cession.repair_order_id})` : '-';
    }
    
    const order = cession.repair_orders;
    const clientName = order.clients ? 
      `${order.clients.first_name} ${order.clients.last_name}` : 
      'Client non assigné';
    
    const vehicleInfo = order.vehicles ? 
      `${order.vehicles.car_brands?.name || 'Marque inconnue'} ${order.vehicles.car_models?.name || 'Modèle inconnu'} - ${order.vehicles.license_plate}` : 
      'Véhicule non assigné';
    
    const orderDate = order.created_at ? 
      format(new Date(order.created_at), 'dd/MM/yyyy', { locale: fr }) : '';
    
    return `Ordre n°${order.reference} du ${orderDate} - ${clientName} - ${vehicleInfo}`;
  };

  const handleDownloadPDF = (cession: Cession) => {
    if (!cession.document_url) {
      toast({
        title: "PDF non disponible",
        description: "Aucun PDF n'a été généré pour cette cession. Veuillez d'abord initialiser la procédure.",
        variant: "destructive",
      });
      return;
    }

    // Ouvrir le PDF dans un nouvel onglet
    window.open(cession.document_url, '_blank');
  };

  const handleInitializeProcedure = async (cession: Cession) => {
    console.log('Initializing procedure for cession:', cession.id);
    
    // Vérifier qu'il y a un repair_order_id
    if (!cession.repair_order_id) {
      toast({
        title: "Erreur",
        description: "Aucun ordre de réparation n'est associé à cette cession.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Récupérer les données complètes de l'ordre de réparation avec client et véhicule
      const repairOrderData = await repairOrdersService.getById(cession.repair_order_id);
      
      // Valider que toutes les photos sont présentes (validation complète pour la procédure)
      const validationError = validateCessionProcedureData(
        repairOrderData,
        repairOrderData.clients,
        repairOrderData.vehicles
      );
      
      if (validationError) {
        setErrorMessage(validationError);
        setErrorDialogOpen(true);
        return;
      }
      
      // Si toutes les validations passent, procéder à la génération du PDF
      toast({
        title: "Validation réussie",
        description: "Génération du PDF en cours...",
      });

      // Trouver la compagnie d'assurance sélectionnée
      const selectedInsuranceCompany = insuranceCompanies.find(
        company => company.id === cession.insurance_company_id
      );

      if (!selectedInsuranceCompany) {
        toast({
          title: "Erreur",
          description: "Compagnie d'assurance introuvable.",
          variant: "destructive",
        });
        return;
      }

      // Générer et uploader le PDF
      const pdfUrl = await generateAndUploadCessionPDF(
        cession,
        companyData,
        selectedInsuranceCompany,
        repairOrderData.clients,
        repairOrderData.vehicles
      );

      // Mettre à jour la cession avec l'URL du PDF
      await updateCession(cession.id, {
        document_url: pdfUrl
      });

      toast({
        title: "PDF généré avec succès",
        description: "Le document de cession a été généré et sauvegardé.",
      });

      console.log('PDF generated and saved:', pdfUrl);

      // Appeler l'API de signature après la génération du PDF
      try {
        toast({
          title: "Envoi pour signature",
          description: "Envoi du document pour signature en cours...",
        });

        // Récupérer les données complètes du client avec l'oodrive_recipient_id
        const fullClientData = await clientsService.getById(repairOrderData.clients.id);
        
        const signatureResponse = await sendForSignature(
          cession.id,
          pdfUrl,
          companyData,
          fullClientData
        );

        console.log('Signature response received:', signatureResponse);
        console.log('Contract object:', signatureResponse.contract);
        console.log('Contract ID:', signatureResponse.contract?.contract_id);
        console.log('Recipients array:', signatureResponse.recipients);
        console.log('Recipients length:', signatureResponse.recipients?.length);

        // Vérifier la présence du contract_id dans l'objet contract
        if (signatureResponse.contract?.contract_id) {
          console.log('Contract ID found:', signatureResponse.contract.contract_id);
          
          // Sauvegarder l'ID du contrat dans la cession
          await updateCession(cession.id, {
            oodrive_contract_id: signatureResponse.contract.contract_id.toString(),
            status: 'en_attente_signature'
          });

          console.log('Cession updated with contract ID');

          // Vérifier si nous avons suffisamment de recipients
          if (signatureResponse.recipients && signatureResponse.recipients.length >= 2) {
            console.log('Recipients found, updating company and client...');
            
            // Sauvegarder l'ID du premier recipient (entreprise) dans company_info
            if (companyData?.id && repairOrderData.company_id) {
              console.log('Updating company with recipient ID:', signatureResponse.recipients[0].id);
              try {
                await companyService.updateCompanyInfo(repairOrderData.company_id, {
                  ...companyData,
                  oodrive_recipient_id: signatureResponse.recipients[0].id.toString()
                });
                console.log('Company updated successfully');
              } catch (companyError) {
                console.error('Error updating company:', companyError);
              }
            } else {
              console.log('Missing company data or company ID:', { companyData: !!companyData, companyId: repairOrderData.company_id });
            }

            // Sauvegarder l'ID du second recipient (client) dans clients
            if (repairOrderData.clients?.id) {
              console.log('=== CLIENT UPDATE DEBUG ===');
              
              try {
                // D'abord récupérer les données complètes du client
                const fullClientData = await clientsService.getById(repairOrderData.clients.id);
                
                console.log('Client data BEFORE update:', {
                  id: fullClientData.id,
                  driver_license_front_url: fullClientData.driver_license_front_url,
                  driver_license_back_url: fullClientData.driver_license_back_url,
                  oodrive_recipient_id: fullClientData.oodrive_recipient_id
                });
                
                console.log('Updating client with recipient ID:', signatureResponse.recipients[1].id);
                
                // Utiliser une mise à jour très spécifique qui ne touche QUE au champ oodrive_recipient_id
                const { data: updatedClient, error } = await supabase
                  .from('clients')
                  .update({ 
                    oodrive_recipient_id: signatureResponse.recipients[1].id.toString() 
                  })
                  .eq('id', repairOrderData.clients.id)
                  .select('id, driver_license_front_url, driver_license_back_url, oodrive_recipient_id')
                  .single();

                if (error) {
                  console.error('Error updating client via Supabase:', error);
                } else {
                  console.log('Client updated successfully via Supabase');
                  console.log('Client data AFTER update:', updatedClient);
                }
              } catch (clientError) {
                console.error('Error updating client:', clientError);
              }
            } else {
              console.log('Missing client ID:', repairOrderData.clients?.id);
            }

            toast({
              title: "Document envoyé",
              description: "Le document a été envoyé pour signature avec succès et tous les identifiants ont été sauvegardés.",
            });
          } else {
            console.log('Insufficient recipients in response:', signatureResponse.recipients?.length || 0);
            toast({
              title: "Document envoyé partiellement",
              description: "Le document a été envoyé et l'ID du contrat sauvegardé, mais les identifiants des destinataires n'ont pas pu être sauvegardés.",
              variant: "destructive",
            });
          }
        } else {
          console.log('No contract ID in contract object');
          toast({
            title: "Erreur",
            description: "Le document a été envoyé mais aucun identifiant de contrat n'a été retourné.",
            variant: "destructive",
          });
        }

      } catch (signatureError) {
        console.error('Error sending for signature:', signatureError);
        toast({
          title: "Erreur d'envoi",
          description: `Erreur lors de l'envoi pour signature: ${signatureError.message}`,
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Error during procedure initialization:', error);
      toast({
        title: "Erreur",
        description: `Erreur lors de la génération du PDF: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) {
    return (
      <div className="card-container">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-karrosserie-orange"></div>
        </div>
      </div>
    );
  }

  console.log('Rendering table with cessions:', cessions);

  return (
    <div className="card-container">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHeader sortKey="created_at" sortConfig={sortConfig} onSort={handleSort}>
              Date
            </SortableTableHeader>
            <SortableTableHeader sortKey="repair_order" sortConfig={sortConfig} onSort={handleSort}>
              Ordre de réparation
            </SortableTableHeader>
            <SortableTableHeader sortKey="insurance" sortConfig={sortConfig} onSort={handleSort}>
              Assurance
            </SortableTableHeader>
            <SortableTableHeader sortKey="status" sortConfig={sortConfig} onSort={handleSort}>
              Statut
            </SortableTableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((cession) => (
              <React.Fragment key={cession.id}>
                <TableRow className="border-b-0">
                  <TableCell>
                    {format(new Date(cession.created_at), 'dd/MM/yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {formatRepairOrderDisplay(cession)}
                  </TableCell>
                  <TableCell>
                    {cession.insurance_companies ? 
                      cession.insurance_companies.name 
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(cession.status || '')}`}>
                      {getStatusLabel(cession.status || '')}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-0">
                  <TableCell colSpan={4} className="py-3 border-t-0">
                    <div className="flex flex-wrap gap-2 justify-end px-4">
                      {cession.status === 'en_attente' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedCession(cession);
                            setPreviewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Aperçu
                        </Button>
                      )}
                      {cession.status !== 'en_attente' && cession.status !== 'en_attente_signature' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadPDF(cession)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                      )}
                      {cession.status === 'en_attente' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditCession(cession)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      )}
                      {cession.status === 'en_attente' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleInitializeProcedure(cession)}
                          disabled={isGeneratingPDF}
                        >
                          {isGeneratingPDF ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Génération...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Initialiser
                            </>
                          )}
                        </Button>
                      )}
                      {cession.status === 'en_attente' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 border-red-500 hover:border-red-700"
                          onClick={() => onDeleteCession(cession.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="font-medium text-gray-900">Aucun résultat</h3>
                  <p className="text-gray-500 mt-1">
                    Aucune cession de créance correspondant à votre recherche n'a été trouvée.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Documents manquants</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                <p>Des informations obligatoires sont manquantes :</p>
                {parseValidationError(errorMessage).map((section, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-sm">{section.title} :</h4>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">
                  Veuillez compléter ces informations avant de pouvoir créer une cession de créance.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-karrosserie-orange hover:bg-karrosserie-orange/90">
              Compris
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CessionPreview 
        cession={selectedCession}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
};
