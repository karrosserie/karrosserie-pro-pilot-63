import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import DocumentUploadWorkflow from "@/components/documents/upload/DocumentUploadWorkflow";
import { supabase } from "@/integrations/supabase/client";

export default function DocumentUploadFlow() {
  const { token } = useParams<{ token: string }>();
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [companyName, setCompanyName] = useState("Carrosserie Liguori");
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<{
    client_id: string | null;
    vehicule_id: string | null;
    company_id: string | null;
  } | null>(null);
  const [missingDocuments, setMissingDocuments] = useState<string[]>([]);

  useEffect(() => {
    const fetchTokenDataAndCheckDocuments = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Récupérer le token depuis la table tokens
        const { data: tokenResult, error: tokenError } = await supabase
          .from('tokens')
          .select('company_id, client_id, vehicule_id')
          .eq('id', token)
          .single();

        if (tokenError || !tokenResult?.company_id) {
          console.error('Erreur lors de la récupération du token:', tokenError);
          setLoading(false);
          return;
        }

        setTokenData({
          client_id: tokenResult.client_id,
          vehicule_id: tokenResult.vehicule_id,
          company_id: tokenResult.company_id
        });

        // Récupérer le nom de l'entreprise depuis la table company_info
        const { data: companyData, error: companyError } = await supabase
          .from('company_info')
          .select('name')
          .eq('id', tokenResult.company_id)
          .single();

        if (companyError || !companyData) {
          console.error('Erreur lors de la récupération de l\'entreprise:', companyError);
          setLoading(false);
          return;
        }

        setCompanyName(companyData.name);

        // Vérifier les documents manquants
        const missing: string[] = [];

        // Vérifier les documents du client (permis de conduire)
        if (tokenResult.client_id) {
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('driver_license_front_url, driver_license_back_url')
            .eq('id', tokenResult.client_id)
            .single();

          if (!clientError && clientData) {
            if (!clientData.driver_license_front_url) {
              missing.push('driver_license_front');
            }
            if (!clientData.driver_license_back_url) {
              missing.push('driver_license_back');
            }
          } else {
            // Si erreur ou pas de client, on considère que les deux documents manquent
            missing.push('driver_license_front', 'driver_license_back');
          }
        }

        // Vérifier les documents du véhicule (carte grise)
        if (tokenResult.vehicule_id) {
          const { data: vehicleData, error: vehicleError } = await supabase
            .from('vehicles')
            .select('registration_document_front_url, registration_document_back_url')
            .eq('id', tokenResult.vehicule_id)
            .single();

          if (!vehicleError && vehicleData) {
            if (!vehicleData.registration_document_front_url) {
              missing.push('registration_front');
            }
            if (!vehicleData.registration_document_back_url) {
              missing.push('registration_back');
            }
          } else {
            // Si erreur ou pas de véhicule, on considère que les deux documents manquent
            missing.push('registration_front', 'registration_back');
          }
        }

        setMissingDocuments(missing);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenDataAndCheckDocuments();
  }, [token]);

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowWorkflow(true);
  };

  const handleBackToStart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowWorkflow(false);
  };

  const handleComplete = async (documents: { [key: string]: File }) => {
    console.log("Documents uploaded:", documents);
    
    if (!tokenData) {
      console.error("Token data not available");
      return;
    }

    try {
      setLoading(true);

      const updatePromises = [];

      // Upload et mise à jour des documents du permis de conduire
      if (tokenData.client_id) {
        const clientUpdates: { driver_license_front_url?: string; driver_license_back_url?: string } = {};

        if (documents.driver_license_front) {
          const { data: frontUrl } = supabase.storage
            .from('documents')
            .getPublicUrl(`${tokenData.client_id}/driver-license/front_${Date.now()}.jpg`);
          
          await supabase.storage
            .from('documents')
            .upload(`${tokenData.client_id}/driver-license/front_${Date.now()}.jpg`, documents.driver_license_front);
          
          clientUpdates.driver_license_front_url = frontUrl.publicUrl;
        }

        if (documents.driver_license_back) {
          const { data: backUrl } = supabase.storage
            .from('documents')
            .getPublicUrl(`${tokenData.client_id}/driver-license/back_${Date.now()}.jpg`);
          
          await supabase.storage
            .from('documents')
            .upload(`${tokenData.client_id}/driver-license/back_${Date.now()}.jpg`, documents.driver_license_back);
          
          clientUpdates.driver_license_back_url = backUrl.publicUrl;
        }

        if (Object.keys(clientUpdates).length > 0) {
          updatePromises.push(
            supabase
              .from('clients')
              .update(clientUpdates)
              .eq('id', tokenData.client_id)
          );
        }
      }

      // Upload et mise à jour des documents du véhicule
      if (tokenData.vehicule_id) {
        const vehicleUpdates: { registration_document_front_url?: string; registration_document_back_url?: string } = {};

        if (documents.registration_front) {
          const { data: frontUrl } = supabase.storage
            .from('documents')
            .getPublicUrl(`${tokenData.vehicule_id}/registration/front_${Date.now()}.jpg`);
          
          await supabase.storage
            .from('documents')
            .upload(`${tokenData.vehicule_id}/registration/front_${Date.now()}.jpg`, documents.registration_front);
          
          vehicleUpdates.registration_document_front_url = frontUrl.publicUrl;
        }

        if (documents.registration_back) {
          const { data: backUrl } = supabase.storage
            .from('documents')
            .getPublicUrl(`${tokenData.vehicule_id}/registration/back_${Date.now()}.jpg`);
          
          await supabase.storage
            .from('documents')
            .upload(`${tokenData.vehicule_id}/registration/back_${Date.now()}.jpg`, documents.registration_back);
          
          vehicleUpdates.registration_document_back_url = backUrl.publicUrl;
        }

        if (Object.keys(vehicleUpdates).length > 0) {
          updatePromises.push(
            supabase
              .from('vehicles')
              .update(vehicleUpdates)
              .eq('id', tokenData.vehicule_id)
          );
        }
      }

      // Exécuter toutes les mises à jour
      await Promise.all(updatePromises);

      console.log("Documents sauvegardés avec succès");
      
      // Notifier la carrosserie que le client a terminé l'upload de ses documents
      try {
        await supabase.functions.invoke('notify-company-documents-complete', {
          body: {
            clientId: tokenData.client_id,
            companyId: tokenData.company_id
          }
        });
        console.log("Notification envoyée à la carrosserie");
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de la notification:", emailError);
        // On ne fait pas échouer le processus si l'email ne peut pas être envoyé
      }
      
      setShowWorkflow(false);
      
      // Mettre à jour l'état pour afficher directement l'écran de confirmation
      setMissingDocuments([]);
      
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des documents:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showWorkflow) {
    return (
      <DocumentUploadWorkflow
        onBack={handleBackToStart}
        onComplete={handleComplete}
        missingDocuments={missingDocuments}
        tokenData={tokenData}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-karrosserie-orange rounded-full flex items-center justify-center mx-auto shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Header with icon and title */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-karrosserie-orange rounded-full flex items-center justify-center mx-auto shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {companyName}
          </h1>
          <h2 className="text-xl font-semibold text-foreground">
            Téléversement de documents
          </h2>
        </div>

        {/* Start button */}
        <Button
          type="button" 
          onClick={handleStart}
          className="bg-karrosserie-orange hover:bg-karrosserie-orange/90 text-white w-full max-w-sm mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
          disabled={missingDocuments.length === 0}
        >
          {missingDocuments.length === 0 ? 'Tous les documents sont présents' : 'Commencer'}
        </Button>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {missingDocuments.length === 0 
            ? 'Tous vos documents sont déjà enregistrés dans notre système.'
            : 'Afin de traiter votre dossier rapidement, nous avons besoin de quelques documents.'
          }
        </p>

        {/* Document list - Only show if there are missing documents */}
        {missingDocuments.length > 0 && (
          <div className="space-y-4 text-left">
            <h3 className="font-semibold text-foreground">
              Veuillez préparer :
            </h3>
            <div className="space-y-3">
              {(() => {
                const needsDriverLicense = missingDocuments.includes('driver_license_front') || missingDocuments.includes('driver_license_back');
                const needsRegistration = missingDocuments.includes('registration_front') || missingDocuments.includes('registration_back');
                let counter = 0;
                
                return (
                  <>
                    {needsDriverLicense && (
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-sm">
                          {++counter}
                        </span>
                        <span className="text-muted-foreground">
                          Votre permis de conduire
                        </span>
                      </div>
                    )}
                    {needsRegistration && (
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-karrosserie-orange text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 shadow-sm">
                          {++counter}
                        </span>
                        <span className="text-muted-foreground">
                          Votre carte grise
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Footer note - Only show if there are missing documents */}
        {missingDocuments.length > 0 && (
          <p className="text-muted-foreground text-sm italic">
            Assurez-vous d'être dans un endroit bien éclairé pour prendre des photos nettes.
          </p>
        )}

        {/* Success message if no documents are missing */}
        {missingDocuments.length === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              ✅ Tous vos documents sont déjà enregistrés dans notre système. Aucune action supplémentaire n'est requise.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}