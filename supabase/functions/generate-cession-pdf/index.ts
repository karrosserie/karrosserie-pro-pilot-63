import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CessionPDFRequest {
  cessionId: string;
  repairOrderData: any;
  clientData: any;
  vehicleData: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { cessionId, repairOrderData, clientData, vehicleData }: CessionPDFRequest = await req.json();

    // Get cession data
    const { data: cession, error: cessionError } = await supabase
      .from('cessions')
      .select('*, insurance_companies(name), bank_accounts(*)')
      .eq('id', cessionId)
      .single();

    if (cessionError || !cession) {
      throw new Error('Cession not found');
    }

    // Generate PDF content using @react-pdf/renderer
    const { default: React } = await import('https://esm.sh/react@18.3.1');
    const { Document, Page, Text, View, StyleSheet, pdf } = await import('https://esm.sh/@react-pdf/renderer@4.3.0');

    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontSize: 11,
        fontFamily: 'Helvetica',
      },
      title: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'uppercase',
      },
      subtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
      },
      text: {
        marginBottom: 5,
        lineHeight: 1.4,
      },
      header: {
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000000',
        paddingVertical: 10,
        marginBottom: 20,
      },
      section: {
        marginBottom: 15,
      },
      signature: {
        marginTop: 30,
        textAlign: 'center',
      },
      amount: {
        fontSize: 12,
        fontWeight: 'bold',
      },
    });

    const currentDate = new Date().toLocaleDateString('fr-FR');
    const incidentDate = cession.incident_date ? new Date(cession.incident_date).toLocaleDateString('fr-FR') : '';
    
    // Page 1: Attestation sur l'honneur
    const AttestationPage = () => (
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            ATTESTATION SUR L'HONNEUR D'ABSENCE DE SURFACTURATION
          </Text>
        </View>
        
        <Text style={styles.text}>(Conformément à l'article L. 441-7 du Code de commerce)</Text>
        
        <View style={styles.section}>
          <Text style={styles.subtitle}>KORPORATE</Text>
          <Text style={styles.text}>25 COURS PIERRE PUGET</Text>
          <Text style={styles.text}>13006 MARSEILLE</Text>
          <Text style={styles.text}>ggobeyn@outlook.fr</Text>
          <Text style={styles.text}>+33646465242</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>À l'attention de :</Text>
          <Text style={styles.text}>{cession.insurance_companies?.name || 'ACTIVE ASSURANCES'}</Text>
          <Text style={styles.text}>8-10 RUE DE LA FERME</Text>
          <Text style={styles.text}>92100 BOULOGNE-BILLANCOURT</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>Objet : Attestation sur l'honneur certifiant l'absence de surfacturation</Text>
          <Text style={styles.text}>N° sinistre : {cession.incident_number || '00125A'}</Text>
          <Text style={styles.text}>N° contrat : {cession.policy_number || '7718265A'}</Text>
          <Text style={styles.text}>PV expertise : {cession.report_number || 'AE25008924'}</Text>
          <Text style={styles.text}>Véhicule : {vehicleData?.license_plate || 'ED-684-JH'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            Nous attestons par la présente, conformément à l'article L. 441-7 du Code de commerce, que :
          </Text>
          <Text style={styles.text}>
            1. Les travaux de réparation effectués sur le véhicule {vehicleData?.car_brands?.name} {vehicleData?.car_models?.name} 
            (immatriculation {vehicleData?.license_plate}), n° série) dans le cadre du sinistre survenu le {incidentDate}, 
            référencé sous le n°{cession.incident_number}, ont été facturés en stricte conformité avec :
          </Text>
          <Text style={styles.text}>○ Les tarifs professionnels habituellement pratiqués par notre établissement ;</Text>
          <Text style={styles.text}>○ Les préconisations techniques du constructeur {vehicleData?.car_brands?.name} ;</Text>
          <Text style={styles.text}>○ Les dispositions du rapport d'expertise n° {cession.report_number} ;</Text>
          <Text style={styles.text}>○ Les règles de l'art en vigueur dans le secteur de la réparation automobile.</Text>
          
          <Text style={styles.text}>
            2. Aucune majoration abusive, surcoût injustifié ou pratique commerciale déloyale n'a été appliquée. 
            Les montants facturés correspondent intégralement :
          </Text>
          <Text style={styles.text}>○ Au coût des pièces détachées (neuves ou d'occasion selon accord) ;</Text>
          <Text style={styles.text}>○ Au temps de main d'œuvre réellement consacré ;</Text>
          <Text style={styles.text}>○ Aux prestations annexes nécessaires à la remise en état du véhicule.</Text>
          
          <Text style={styles.text}>
            3. Cette attestation est délivrée en toute honnêteté, sous réserve des sanctions pénales prévues par les 
            articles L. 441-7 et L. 454-1 du Code de commerce en cas de déclaration frauduleuse.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text style={styles.text}>Fait à MARSEILLE, le {currentDate}</Text>
          <Text style={styles.text}>KORPORATE</Text>
          <Text style={styles.text}>Approuvé par MUSSO DORIAN</Text>
        </View>
      </Page>
    );

    // Page 2: Notification de cession
    const NotificationPage = () => (
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.text}>
            Conformément à l'article 1369-4 du Code civil, cette notification est également valablement effectuée par 
            courrier à l'adresse suivante : ffc@clearbus.fr, avec accusé de réception électronique.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>KORPORATE</Text>
          <Text style={styles.text}>25 COURS PIERRE PUGET</Text>
          <Text style={styles.text}>13006 MARSEILLE</Text>
          <Text style={styles.text}>ggobeyn@outlook.fr</Text>
          <Text style={styles.text}>+33646465242</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>{cession.insurance_companies?.name || 'ACTIVE ASSURANCES'}</Text>
          <Text style={styles.text}>8-10 RUE DE LA FERME</Text>
          <Text style={styles.text}>92100 BOULOGNE-BILLANCOURT</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>Objet : Notification de cession de créance (Article 1324 du Code civil)</Text>
          <Text style={styles.text}>N° sinistre : {cession.incident_number}</Text>
          <Text style={styles.text}>N° contrat : {cession.policy_number}</Text>
          <Text style={styles.text}>PV expertise : {cession.report_number}</Text>
        </View>

        <Text style={styles.text}>MARSEILLE, le {currentDate}</Text>
        <Text style={styles.text}>Madame, Monsieur,</Text>

        <View style={styles.section}>
          <Text style={styles.text}>
            Conformément aux dispositions des articles 1321 et suivants du Code civil et L.121-13 du Code des 
            assurances, nous vous notifions par la présente la cession de créance intervenue ce jour entre :
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>CÉDANT</Text>
          <Text style={styles.text}>{clientData?.first_name} {clientData?.last_name}</Text>
          <Text style={styles.text}>{clientData?.address}</Text>
          <Text style={styles.text}>{clientData?.postal_code} {clientData?.city}</Text>
          <Text style={styles.text}>{clientData?.email}</Text>
          <Text style={styles.text}>{clientData?.phone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>Au profit de :</Text>
          <Text style={styles.subtitle}>CESSIONNAIRE</Text>
          <Text style={styles.text}>KORPORATE</Text>
          <Text style={styles.text}>25 COURS PIERRE PUGET</Text>
          <Text style={styles.text}>13006 MARSEILLE</Text>
          <Text style={styles.text}>ggobeyn@outlook.fr</Text>
          <Text style={styles.text}>+33646465242</Text>
        </View>
      </Page>
    );

    // Page 3: Détails de l'indemnisation
    const IndemnisationPage = () => (
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.text}>Concernant l'indemnisation des réparations du véhicule :</Text>
          <Text style={styles.text}>{vehicleData?.car_brands?.name} {vehicleData?.car_models?.name}</Text>
          <Text style={styles.text}>Immatriculation : {vehicleData?.license_plate}</Text>
          <Text style={styles.text}>N° Série :</Text>
        </View>

        <Text style={styles.text}>Suite au sinistre survenu le {incidentDate}.</Text>

        <View style={styles.section}>
          <Text style={styles.text}>Cette cession est effectuée en vertu :</Text>
          <Text style={styles.text}>- De l'article L.121-13 du Code des assurances</Text>
          <Text style={styles.text}>- Des articles 1321 à 1326 du Code civil</Text>
          <Text style={styles.text}>- Du PV d'expertise n°{cession.report_number}</Text>
          <Text style={styles.text}>- Du privilège du garagiste (article 2332, 3° du Code civil)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            En conséquence, nous vous demandons de procéder au règlement de l'indemnité d'un montant de 1 094,79 € TTC 
            directement sur notre compte bancaire :
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>BANQUE : {cession.bank_accounts?.bank || 'CIC'}</Text>
          <Text style={styles.text}>IBAN : {cession.bank_accounts?.iban || 'FR76 0123 4567 8901 2345 6789 123'}</Text>
          <Text style={styles.text}>BIC : {cession.bank_accounts?.bic || 'CICFRPP'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>Vous trouverez ci-joint :</Text>
          <Text style={styles.text}>1. Le contrat de cession de créance original</Text>
          <Text style={styles.text}>2. L'ordre de réparation n°{repairOrderData?.reference}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            Dans l'attente du règlement dans les délais légaux prescrits par l'article L.211-5-1 du Code des 
            assurances, nous vous prions d'agréer, Madame, Monsieur, l'expression de notre considération distinguée.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text style={styles.text}>KORPORATE</Text>
          <Text style={styles.text}>Approuvé par MUSSO DORIAN</Text>
        </View>
      </Page>
    );

    // Page 4: Confirmation de cession
    const ConfirmationPage = () => (
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.text}>{clientData?.first_name} {clientData?.last_name}</Text>
          <Text style={styles.text}>{clientData?.address}</Text>
          <Text style={styles.text}>{clientData?.postal_code} {clientData?.city}</Text>
          <Text style={styles.text}>{clientData?.email}</Text>
          <Text style={styles.text}>{clientData?.phone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>{cession.insurance_companies?.name || 'ACTIVE ASSURANCES'}</Text>
          <Text style={styles.text}>8-10 RUE DE LA FERME</Text>
          <Text style={styles.text}>92100 BOULOGNE-BILLANCOURT</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>Objet : Confirmation de cession de créance - Dossier sinistre n°{cession.incident_number}</Text>
        </View>

        <Text style={styles.text}>Madame, Monsieur,</Text>

        <View style={styles.section}>
          <Text style={styles.text}>
            Je soussigné(e) {clientData?.first_name} {clientData?.last_name}, assuré(e) sous le contrat n°{cession.policy_number}, 
            vous confirme avoir cédé ma créance d'indemnisation à KORPORATE concernant les réparations de mon véhicule 
            {vehicleData?.car_brands?.name} {vehicleData?.car_models?.name} immatriculé {vehicleData?.license_plate}.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            En application de l'article L.121-13 du Code des assurances, je vous demande expressément de verser 
            l'indemnité directement au réparateur.
          </Text>
          <Text style={styles.text}>
            Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.
          </Text>
        </View>

        <View style={styles.signature}>
          <Text style={styles.text}>Fait à MARSEILLE, le {currentDate}</Text>
          <Text style={styles.text}>Approuvé par KORPORATE Entreprise</Text>
        </View>
      </Page>
    );

    // Page 5: Convention de cession
    const ConventionPage1 = () => (
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            CONVENTION DE CESSION DE CRÉANCE D'INDEMNITÉ D'ASSURANCE
          </Text>
        </View>

        <Text style={styles.text}>(Articles 1321 et suivants du Code Civil)</Text>
        <Text style={styles.text}>(Article L.121-13 du Code des assurances)</Text>

        <View style={styles.section}>
          <Text style={styles.text}>Entre les soussignés:</Text>
          <Text style={styles.subtitle}>LE CÉDANT</Text>
          <Text style={styles.text}>{clientData?.first_name} {clientData?.last_name}</Text>
          <Text style={styles.text}>{clientData?.address}</Text>
          <Text style={styles.text}>{clientData?.postal_code} {clientData?.city}</Text>
          <Text style={styles.text}>{clientData?.email}</Text>
          <Text style={styles.text}>{clientData?.phone}</Text>
          <Text style={styles.text}>Ci-après dénommé "Le Client/Assuré"</Text>
        </View>

        <Text style={styles.text}>ET</Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>LE CESSIONNAIRE</Text>
          <Text style={styles.text}>KORPORATE</Text>
          <Text style={styles.text}>25 COURS PIERRE PUGET</Text>
          <Text style={styles.text}>13006 MARSEILLE</Text>
          <Text style={styles.text}>ggobeyn@outlook.fr</Text>
          <Text style={styles.text}>+33646465242</Text>
          <Text style={styles.text}>Ci-après dénommé "Le Réparateur professionnel"</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>EXPOSÉ PRÉALABLE</Text>
          <Text style={styles.text}>Conformément aux dispositions :</Text>
          <Text style={styles.text}>- De l'article 1321 du Code civil établissant le principe et les effets de la cession de créance</Text>
          <Text style={styles.text}>- De l'article L.121-13 du Code des assurances imposant le versement de l'indemnité pour la remise en état effectif du bien assuré</Text>
        </View>

        <Text style={styles.text}>Le Client/Assuré entend céder sa créance d'indemnité d'assurance au Réparateur professionnel.</Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>IDENTIFICATION DU SINISTRE</Text>
          <Text style={styles.text}>Compagnie d'assurance : {cession.insurance_companies?.name}</Text>
          <Text style={styles.text}>N° de contrat : {cession.policy_number}</Text>
          <Text style={styles.text}>Référence sinistre : {cession.incident_number} du {incidentDate}</Text>
          <Text style={styles.text}>Expert mandaté : {cession.expert_name || 'DEVAUX MATTHIEU'}</Text>
          <Text style={styles.text}>Rapport d'expertise n° : {cession.report_number}</Text>
          <Text style={styles.amount}>Montant validé : 1 094,79 € TTC</Text>
        </View>
      </Page>
    );

    // Create the PDF document
    const MyDocument = () => (
      <Document>
        <AttestationPage />
        <NotificationPage />
        <IndemnisationPage />
        <ConfirmationPage />
        <ConventionPage1 />
      </Document>
    );

    // Generate PDF
    const pdfStream = await pdf(React.createElement(MyDocument)).toBuffer();

    // Upload to Supabase Storage
    const fileName = `cession-${cessionId}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(`cessions/${fileName}`, pdfStream, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload error: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(`cessions/${fileName}`);

    // Update cession with document URL
    const { error: updateError } = await supabase
      .from('cessions')
      .update({ 
        document_url: publicUrl,
        status: 'en_attente_signature' 
      })
      .eq('id', cessionId);

    if (updateError) {
      throw new Error(`Update error: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        document_url: publicUrl,
        message: 'PDF généré avec succès'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);