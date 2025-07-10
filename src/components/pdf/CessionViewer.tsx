
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 5,
    lineHeight: 1.4,
  },
  bold: {
    fontWeight: 'bold',
  },
  addressBlock: {
    marginBottom: 10,
    padding: 5,
    border: 1,
    borderColor: '#000',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 20,
  },
  tableCell: {
    width: '16.66%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 5,
    textAlign: 'center',
  },
  tableCellLarge: {
    width: '33.33%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 5,
    textAlign: 'center',
  },
 conditions: {
    fontSize: 8,
    marginTop: 20,
    lineHeight: 1.3,
  },
  conditionItem: {
    marginBottom: 8,
  },
  conditionTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    borderTop: 1,
    paddingTop: 5,
  },
  signatureBlock: {
    marginTop: 20,
    textAlign: 'center',
  },
  pageBreak: {
    marginTop: 20,
  },
});

// Composant principal du PDF
export const CessionPDF = ({ cession }) => (
  <Document>
    {/* Page 1 - Notification de cession */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Conformément à l'article 1369-4 du Code civil, cette notification est également valablement effectuée par
          courriel à l'adresse suivante : ffc@clearbus.fr, avec accusé de réception électronique.
        </Text>
      </View>

      <View style={styles.addressBlock}>
        <Text style={styles.bold}>{cession.company.name}</Text>
        <Text>{cession.company.address}</Text>
        <Text>{cession.company.zipCode} {cession.company.city}</Text>
        <Text>{cession.company.email}</Text>
        <Text>{cession.company.phone}</Text>
      </View>

      <View style={styles.addressBlock}>
        <Text style={styles.bold}>{cession.insurance_company.name}</Text>
        <Text>{cession.insurance_company.address}</Text>
        <Text>{cession.insurance_company.zipCode} {cession.insurance_company.city}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Objet : Notification de cession de créance (Article 1324 du Code civil)</Text>
        <Text>N° sinistre : {cession.incident_number}</Text>
        <Text>N° contrat :  {cession.policy_number}</Text>
        <Text>PV expertise : {cession.report_number}</Text>
        <Text>{cession.company.city}, le {cession.date}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>Madame, Monsieur,</Text>
        <Text style={styles.paragraph}>
          Conformément aux dispositions des articles 1321 et suivants du Code civil et L.121-13 du Code des
          assurances, nous vous notifions par la présente la cession de créance intervenue ce jour entre :
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>CÉDANT</Text>
        <Text>{cession.client.name}</Text>
        <Text>{cession.client.address} {cession.client.zipCode} {cession.client.city}</Text>
        <Text>{cession.client.email}</Text>
        <Text>{cession.client.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Au profit de :</Text>
        <Text style={styles.subtitle}>CESSIONNAIRE</Text>
        <Text>{cession.company.name}</Text>
        <Text>{cession.company.address}</Text>
        <Text>{cession.company.zipCode} {cession.company.city}</Text>
        <Text>{cession.company.email}</Text>
        <Text>{cession.company.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>Concernant l'indemnisation des réparations du véhicule :</Text>
        <Text>{cession.vehicle.brand} {cession.vehicle.model}</Text>
        <Text>Immatriculation : {cession.vehicle.license_plate}</Text>
        <Text>N° Série : {cession.vehicle.vin}</Text>
        <Text>Suite au sinistre survenu le {cession.incident_date}.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>Cette cession est effectuée en vertu :</Text>
        <Text>- De l'article L.121-13 du Code des assurances</Text>
        <Text>- Des articles 1321 à 1326 du Code civil</Text>
        <Text>- Du PV d'expertise n°56354</Text>
        <Text>- Du privilège du garagiste (article 2332, 3° du Code civil)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          En conséquence, nous vous demandons de procéder au règlement de l'indemnité d'un montant de {cession.order.amount } € TTC
          directement sur notre compte bancaire :
        </Text>
        <Text>BANQUE : {cession.company.bank_account.bank }</Text>
        <Text>IBAN : {cession.company.bank_account.iban }</Text>
        <Text>BIC : {cession.company.bank_account.bic }</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>Vous trouverez ci-joint :</Text>
        <Text>1. Le contrat de cession de créance original</Text>
        <Text>2. L'ordre de réparation n° {cession.order.reference }</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Dans l'attente du règlement dans les délais légaux prescrits par l'article L.211-5-1 du Code des
          assurances, nous vous prions d'agréer, Madame, Monsieur, l'expression de notre considération distinguée.
        </Text>
      </View>

      <View style={styles.signatureBlock}>
        <Text>{cession.company.name }</Text>
        <Text>[Signature2/]</Text>
      </View>
    </Page>

    {/* Page 2 - Confirmation de cession */}
    <Page size="A4" style={styles.page}>
      <View style={styles.addressBlock}>
        <Text>{cession.client.name }</Text>
        <Text>{cession.client.address} {cession.client.zipCode} {cession.client.city}</Text>
        <Text>{cession.client.email }</Text>
        <Text>{cession.client.phone }</Text>
      </View>

      <View style={styles.addressBlock}>
        <Text style={styles.bold}>{cession.insurance_company.name}</Text>
        <Text>{cession.insurance_company.address}</Text>
        <Text>{cession.insurance_company.zipCode} {cession.insurance_company.city}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Objet : Confirmation de cession de créance - Dossier sinistre n° {cession.incident_number}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>Madame, Monsieur,</Text>
        <Text style={styles.paragraph}>
          Je soussigné(e) {cession.client.name }, assuré(e) sous le contrat n° {cession.policy_number}, vous confirme avoir cédé ma créance
          d'indemnisation à {cession.comppany.name } concernant les réparations de mon véhicule {cession.vehicle.brand} {cession.vehicle.model}
          immatriculé {cession.vehicle.license_plate}.
        </Text>
        <Text style={styles.paragraph}>
          En application de l'article L.121-13 du Code des assurances, je vous demande expressément de verser
          l'indemnité directement au réparateur.
        </Text>
        <Text style={styles.paragraph}>
          Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.
        </Text>
      </View>

      <View style={styles.section}>
        <Text>Fait à {cession.client.city}, le {cession.date}</Text>
      </View>

      <View style={styles.signatureBlock}>
        <Text>[Signature1/]</Text>
      </View>
    </Page>

    {/* Page 3 - Convention de cession */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>CONVENTION DE CESSION DE CRÉANCE D'INDEMNITÉ D'ASSURANCE</Text>
      <Text style={styles.paragraph}>(Articles 1321 et suivants du Code Civil)</Text>
      <Text style={styles.paragraph}>(Article L.121-13 du Code des assurances)</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Entre les soussignés:</Text>
        <Text style={styles.subtitle}>LE CÉDANT</Text>
        <Text>{cession.client.name}</Text>
        <Text>{cession.client.address} {cession.client.zipCode} {cession.client.city}</Text>
        <Text>{cession.client.email}</Text>
        <Text>{cession.client.phone}</Text>
        <Text>Ci-après dénommé "Le Client/Assuré"</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>ET</Text>
        <Text style={styles.subtitle}>LE CESSIONNAIRE</Text>
        <Text>{cession.company.name}</Text>
        <Text>{cession.company.address}</Text>
        <Text>{cession.company.zipCode} {cession.company.city}</Text>
        <Text>{cession.company.email}</Text>
        <Text>{cession.company.phone}</Text>
        <Text>Ci-après dénommé "Le Réparateur professionnel"</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>EXPOSÉ PRÉALABLE</Text>
        <Text style={styles.paragraph}>Conformément aux dispositions :</Text>
        <Text>- De l'article 1321 du Code civil établissant le principe et les effets de la cession de créance</Text>
        <Text>- De l'article L.121-13 du Code des assurances imposant le versement de l'indemnité pour la remise en état effective du bien assuré</Text>
        <Text>- De l'article R.121-5 du Code des assurances relatif aux modalités de règlement des indemnités d'assurance</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>IDENTIFICATION DU SINISTRE</Text>
        <Text>Compagnie d'assurance : {cession.insurance_company.name}</Text>
        <Text>N° de contrat : {cession.policy_number}</Text>
        <Text>Référence sinistre : {cession.incident_number} du {cession.incident_date}</Text>
        <Text>Expert mandaté : {cession.expert_name }</Text>
        <Text>Rapport d'expertise n° : {cession.report_number  }</Text>
        <Text>Montant validé : {cession.order.amount  }  € TTC</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>IDENTIFICATION DU VÉHICULE</Text>
        <Text>Véhicule {cession.vehicle.brand} {cession.vehicle.model}</Text>
        <Text>N° d'enregistrement {cession.vehicle.license_plate}</Text>
        <Text>Kilométrage {cession.vehicle.mileage} Km</Text>
      </View>
    </Page>

    {/* Page 4 - Articles de la convention */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>CONVENTION</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Article 1 : Objet et portée de la cession</Text>
        <Text style={styles.paragraph}>1.1 Le Client/Assuré déclare céder, sans réserve et de manière irrévocable, au Réparateur professionnel qui accepte, la créance d'indemnisation qu'il détient sur la compagnie d'assurance susvisée.</Text>
        <Text style={styles.paragraph}>1.2 Cette cession est consentie en application des articles 1321 et suivants du Code civil et L.121-13 du Code des assurances, pour garantir le paiement des réparations conformes au rapport d'expertise n° {cession.report_number}</Text>
        <Text style={styles.paragraph}>1.3 Le Réparateur professionnel est subrogé dans tous les droits, actions et privilèges du Cédant vis-à-vis de la compagnie d'assurance.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Article 2 : Montant et composition de la créance cédée</Text>
        <Text style={styles.paragraph}>La créance cédée correspond au montant total de {cession.order.amount} € TTC, comprenant :</Text>

      {cession.order.articles.map((article, index) => (
        <Text>- {article.description} :{article.total} € HT</Text>
      ))}

        <Text>- TVA : {cession.order.amountVat} € HT</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Article 3 : Garanties du Cédant</Text>
        <Text style={styles.paragraph}>Le Cédant garantit expressément, sous sa responsabilité :</Text>
        <Text>3.1 L'existence et la disponibilité de la créance cédée</Text>
        <Text>3.2 Sa qualité de titulaire légitime du contrat d'assurance</Text>
        <Text>3.3 L'absence de toute cession ou délégation antérieure</Text>
        <Text>3.4 L'absence de cause de déchéance de garantie</Text>
        <Text>3.5 La validité et le maintien des garanties d'assurance</Text>
        <Text>3.6 L'absence de contestation sur le montant de l'indemnité</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Article 4 : Obligations spécifiques de l'Assuré</Text>
        <Text style={styles.paragraph}>Le Client/Assuré s'engage irrévocablement à :</Text>
        <Text>4.1 Ne pas révoquer la présente cession</Text>
        <Text>4.2 Ne pas percevoir directement l'indemnité d'assurance</Text>
        <Text>4.3 Informer immédiatement le Réparateur de toute notification de l'assurance</Text>
        <Text>4.4 Coopérer pour la bonne exécution de la présente convention</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Article 5 : Notification et opposabilité</Text>
        <Text style={styles.paragraph}>5.1 La présente cession sera notifiée à la compagnie d'assurance par :</Text>
        <Text>- Lettre recommandée avec accusé de réception</Text>
        <Text>- Courriel avec accusé de réception</Text>
        <Text>- Télécopie avec accusé de réception</Text>
        <Text style={styles.paragraph}>5.2 Le Réparateur professionnel est expressément mandaté pour effectuer cette notification.</Text>
      </View>
    </Page>

     <Page size="A4" style={styles.page}>
      

      <View style={styles.section}>
        <Text style={styles.paragraph}>5.3 La notification mentionnera :</Text>
        <Text>- La référence du sinistre</Text>
        <Text>- Le montant de la créance cédée</Text>
        <Text>- Les coordonnées bancaires du Réparateur</Text>
        <Text>- La mention expresse de l'article L.121-13 du Code des assurances</Text>
         <Text style={styles.subtitle}>Article 6 : Privilège et droit de rétention</Text>
         <Text>6.1 Le Réparateur bénéficie du privilège spécial mobilier prévu par l'article 2332 3° du Code civil.</Text>
         <Text>6.2 Le Réparateur pourra exercer son droit de rétention jusqu'au complet paiement.</Text>
         <Text style={styles.subtitle}>Article 7 : Clause de substitution</Text>
         <Text>En cas d'invalidité d'une clause, celle-ci sera réputée non écrite sans affecter la validité des autres dispositions.</Text>
         <Text style={styles.subtitle}>Article 8 : Attribution de compétence</Text>
         <Text>Tout litige relèvera de la compétence exclusive du Tribunal Judiciaire de {cession.company.city}</Text>
      </View>

       <View style={styles.section}>
        <Text>Fait à {cession.client.city}, le {cession.date}</Text>
        <Text>En trois exemplaires originaux</Text>
      </View>

      <View style={styles.signatureBlock}>
        <Text>Le Cedant:</Text>
        <Text>[Signature1/]</Text>
        <Text>Lu et approuvé, </Text>
        <Text>Bon pour cession irrévocable de créance </Text>
        <Text>d'un montant de {cession.order.amount} € TTC </Text>
      </View>

       <View style={styles.signatureBlock}>
        <Text>Le Cessionnaire</Text>
        <Text>[Signature2/]</Text>
        <Text>Bon pour acceptation de cession</Text>
      </View>

       <View style={styles.section}>
        <Text>Vous trouverez ci-joint :</Text>
        <Text>1. La copie du rapport d'expertise</Text>
        <Text>2. La copie de la carte grise du véhicule</Text>
        <Text>3. La copie du permis de conduire de l'assuré</Text>
      </View>



      </Page>

      <Page>
      <Image src={cession.document_url }/>
      </Page>

      <Page>
      <Image src={cession.vehicle.registration_front_url }/>
      <Image src={cession.vehicle.registration_back_url }/>
      </Page>
      

       <Page>
        <Image src={cession.client.driver_license_front_url }/>
      <Image src={cession.client.driver_license_back_url }/>
       </Page>

    {/* Page 5 - Ordre de réparation */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Ordre de réparation</Text>

      <View style={styles.section}>
        <Text style={styles.bold}>{cession.company.name}</Text>
        <Text>ADRESSE : {cession.company.address} {cession.company.zipCode} {cession.company.city}</Text>
        <Text>TEL : {cession.company.phone}</Text>
        <Text>EMAIL : {cession.company.email}</Text>
        <Text>SIREN : {cession.company.siren}</Text>
        <Text>TVA : {cession.company.tva}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Details de l'ordre de réparation :</Text>
        <Text>O.R: N° {cession.order.reference}</Text>
        <Text>Véhicule: {cession.vehicle.brand} {cession.vehicle.model}</Text>
        <Text>Immatricule : {cession.vehicle.license_plate}</Text>
        <Text>Kilométrage : {cession.vehicle.mileage} Km</Text>
        <Text>Total:{cession.order.amount} €</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>ordre de réparation de</Text>
        <Text>{cession.client.name}</Text>
        <Text>TEL : {cession.client.phone}</Text>
        <Text>EMAIL : {cession.client.email}</Text>
        <Text>ADRESSE : {cession.client.address} {cession.client.zipCode} {cession.client.city}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>DÉLAI PRÉVISIONNEL:</Text>
        <Text>Date de début des travaux : {cession.order.start_date}</Text>
        <Text>Date de fin des travaux : {cession.order.end_date}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.bold}>Article</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.bold}>Quantité</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.bold}>Coût Unitaire</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.bold}>Remise</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.bold}>TVA</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.bold}>Total HT</Text>
          </View>
        </View>

        {cession.order.articles.map((article, index) => ( 
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text>{article.description}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>{article.quantity}</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>{article.unitCost} €</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>{article.discount} %</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>{article.vat} %</Text>
          </View>
          <View style={styles.tableCell}>
            <Text>{article.total} €</Text>
          </View>
        </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Notes</Text>
        <Text>zzzz</Text>
      </View>

      <View style={styles.signatureBlock}>
        <Text>Fait à {cession.company.city}, le {cession.date}</Text>
        <Text>{cession.company.name}</Text>
        <Text>[Signature1/]</Text>
      </View>
    </Page>

        {/* Page 2 - Conditions générales */}
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>CONDITIONS GÉNÉRALES</Text>
          </View>
    
          <View style={styles.conditions}>
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>1. Application des conditions générales</Text>
              <Text>Le présent ordre de réparation est soumis aux conditions générales de service de l'entreprise, dont le client reconnaît avoir pris connaissance et les avoir acceptées.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>2. Base légale</Text>
              <Text>Conformément à l'arrêté du 27 avril 1995 relatif à la vente et aux prestations de service dans le secteur de la réparation automobile, et aux articles R.311-1 et suivants du Code de la route.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>3. Garantie légale et obligation de résultat</Text>
              <Text>Les travaux réalisés bénéficient de la garantie légale de conformité et de la garantie des vices cachés. L'atelier s'engage à une obligation de résultat pour les réparations effectuées.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>4. Pièces remplacées et réserve de propriété</Text>
              <Text>Les pièces remplacées seront tenues à disposition du client pendant 48 heures et restent la propriété de l'atelier jusqu'au paiement intégral.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>5. Expertise</Text>
              <Text>Les travaux ne débuteront qu'après accord de l'expert et/ou de la compagnie d'assurance.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>6. Supplément de travaux</Text>
              <Text>Tout supplément de travaux nécessitera un accord préalable du client et un avenant signé si supérieur à 10% du devis initial.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>7. Délais et responsabilité</Text>
              <Text>En cas de retard dû à des circonstances indépendantes de notre volonté, le délai sera révisé sans indemnité compensatoire.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>8. Effets personnels et responsabilité</Text>
              <Text>L'entreprise décline toute responsabilité en cas de perte, vol ou détérioration d'objets personnels non mentionnés à la réception du véhicule.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>9. Protection des données personnelles</Text>
              <Text>Conformément au RGPD, le client dispose d'un droit d'accès, de rectification et de suppression de ses données.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>10. Droit de rétractation</Text>
              <Text>Le droit de rétractation de 14 jours ne s'applique pas aux prestations de réparation automobile.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>11. Conditions de paiement et pénalités de retard</Text>
              <Text>Le paiement est exigible à la réception du véhicule. Tout retard entraînera des pénalités légales.</Text>
            </View>
    
            <View style={styles.conditionItem}>
              <Text style={styles.conditionTitle}>12. Médiation et règlement des litiges</Text>
              <Text>En cas de litige, le client peut recourir au service de médiation de la consommation ou saisir la justice compétente.</Text>
            </View>
          </View>
    
          <View style={styles.footer}>
            <Text>{cession.company.name} - Siège social :{cession.company.address} {cession.company.zipCode} {cession.company.city} {cession.company.country} - RCS {cession.company.siren} - N° TVA intracommunautaire : {cession.company.tva} - Tel : {cession.company.phone} - Email : {cession.company.email}</Text>
          </View>
        </Page>

    {/* Page 6 - Attestation sur l'honneur */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>ATTESTATION SUR L'HONNEUR D'ABSENCE DE SURFACTURATION</Text>
      <Text style={styles.paragraph}>(Conformément à l'article L. 441-7 du Code de commerce)</Text>

      <View style={styles.addressBlock}>
        <Text style={styles.bold}>{cession.company.name}</Text>
        <Text>{cession.company.address}</Text>
        <Text>{cession.company.zipCode} {cession.company.city}</Text>
        <Text>{cession.company.email}</Text>
        <Text>{cession.company.phone}</Text>
      </View>

      <View style={styles.addressBlock}>
        <Text style={styles.bold}>A l'attention de :</Text>
        <Text>{cession.insurance_company.name}</Text>
        <Text>{cession.insurance_company.address}</Text>
        <Text>{cession.insurance_company.zipCode} {cession.insurance_company.city}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Objet : Attestation sur l'honneur certifiant l'absence de surfacturation</Text>
        <Text>N° sinistre : {cession.incident_number}</Text>
        <Text>N° contrat : {cession.policy_number}</Text>
        <Text>PV expertise : {cession.report_number}</Text>
        <Text>Véhicule : {cession.vehicle.license_plate}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          Nous attestons par la présente, conformément à l'article L. 441-7 du Code de commerce, que :
        </Text>
        <Text style={styles.paragraph}>
          1. Les travaux de réparation effectués sur le véhicule {cession.vehicle.brand} {cession.vehicle.model} (immatriculation {cession.vehicle.license_plate}, n° série {cession.vehicle.vin})
          dans le cadre du sinistre survenu le {cession.incident_date}, référencé sous le n° {cession.incident_number}, ont été facturés en stricte
          conformité avec les tarifs professionnels habituellement pratiqués par notre établissement.
        </Text>
        <Text style={styles.paragraph}>
          2. Aucune majoration abusive, surcoût injustifié ou pratique commerciale déloyale n'a été appliquée.
        </Text>
        <Text style={styles.paragraph}>
          3. Cette attestation est délivrée en toute honnêteté, sous réserve des sanctions pénales prévues par les
          articles L. 441-7 et L. 454-1 du Code de commerce en cas de déclaration frauduleuse.
        </Text>
      </View>

      <View style={styles.section}>
        <Text>Fait à {cession.company.city}, le {cession.date}</Text>
      </View>

      <View style={styles.signatureBlock}>
        <Text>{cession.company.name}</Text>
        <Text>[Signature2/]</Text>
      </View>
    </Page>
  </Document>
);

// Composant principal de l'application
const CessionViewer = () => {
 const cessionData = {
    reference: '1',
    date: '06/05/2025',
    incident_date:"",
    incident_number:"78788",
    policy_number :"56564",
    report_number:"7878768",
    expert_name:"Jean Michel",
    document_url:"",
    vehicle:{
      model:"I X1",
      brand:"BMW",
      license_plate : 'P837',
      mileage: '10000',
      fuel_level:"57",
      vin:"AAAA4656564654646",
      registration_document_front_url:"",
      registration_document_back_url:"",
    },
    company:{
      name:"DEMO GEOFFREY MOYA",
      address:"10 rue courteissade",
      zipCode :"13320",
      city:"Bouc bel air",
      country:"France",
      siren:"567890123",
      siret:"56789012300013",
      tva:"FR 567890123",
      phone:"+33650363126",
      email:"geoffrey.moya@gmail.com",
      bank_account:{
        bank:"BNB",
        iban:"FR67678658658657",
        bic:"azert"
      }
    },
    client: {
      name: 'aaa',
      telephone: '+33612345678',
      email: 'geo@geo.fr',
      adresse: 'zfrrzfgrzf',
      zipCode :"13320",
      city:"Bouc bel air",
      driver_license_front_url :"",
      driver_license_back_url :""
    },
    order :{
      reference:"1",
      articles: [
        {
          description: 'peinture',
          quantity: '1',
          discount: '0',
          unitCost: '500,00',
          vat: '20',
          total: '500,00'
        },
        {
          description: 'mastic',
          quantity: '1',
          discount: '0',
          unitCost: '1.000,00',
          vat: '20',
          total: '1.000,00'
        }
      ],
      amountHT: '1.500,00',
      amountVat: '300,00',
      amount: '1.800,00',
    },
    insurance_company:{
      name: 'IARD',
      adresse: '1 Rue Sainte',
      zipCode :"67000",
      city:"Strasbourg",
    }
   
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
           Cession de Créance d'Assurance
        </h1>
        
        

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Téléchargement du PDF</h2>
          
          <div className="text-center">
            <PDFDownloadLink
              document={<CessionPDF cession={cessionData} />}
              fileName="cession_creance.pdf"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Génération du PDF...' : 'Télécharger le PDF'
              }
            </PDFDownloadLink>
          </div>
          
         
        </div>
      </div>
    </div>
  );
};

export default CessionViewer;