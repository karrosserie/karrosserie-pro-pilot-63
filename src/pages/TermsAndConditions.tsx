import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="prose prose-sm max-w-none">
          <h1 className="text-3xl font-bold mb-6">CONDITIONS GÉNÉRALES D'UTILISATION</h1>
          <h2 className="text-2xl font-bold mb-4">KARROSSERIE PRO</h2>
          
          <p className="mb-4">
            <strong>Date d'entrée en vigueur :</strong> 1er janvier 2025<br />
            <strong>Dernière mise à jour :</strong> 1er janvier 2025
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">PRÉAMBULE</h2>
            <p className="mb-4">
              Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation 
              de la plateforme SaaS Karrosserie Pro (ci-après « la Plateforme » ou « le Service »), éditée et exploitée par :
            </p>
            <p className="mb-4">
              <strong>KPITAL LIMITED</strong><br />
              Société de droit irlandais<br />
              Siège social : Pod 2, l'ancienne gare, 15a Main Street, Blackrock, Dublin, Irlande<br />
              Numéro d'enregistrement : 763114
            </p>
            <p className="mb-4">
              (ci-après « Kpital », « nous », « notre » ou « nos »)
            </p>
            <p className="mb-4">
              En accédant à la Plateforme ou en utilisant nos Services, vous acceptez d'être lié par les présentes CGU. 
              Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 1 - DÉFINITIONS</h2>
            <p className="mb-4">Pour les besoins des présentes CGU, les termes suivants ont la signification qui leur est donnée ci-dessous :</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2"><strong>"Administrateur"</strong> : Utilisateur disposant des droits d'administration du Compte Client, habilité à gérer les accès et paramètres.</li>
              <li className="mb-2"><strong>"API"</strong> : Interface de programmation permettant l'interconnexion avec des services tiers, notamment pour le décodage VIN.</li>
              <li className="mb-2"><strong>"Client"</strong> : Personne physique ou morale ayant souscrit un abonnement à la Plateforme pour son usage professionnel.</li>
              <li className="mb-2"><strong>"Compte"</strong> : Espace personnel sécurisé permettant l'accès aux Services après authentification.</li>
              <li className="mb-2"><strong>"Contenu"</strong> : Ensemble des données, textes, images, documents, informations téléchargés ou générés via la Plateforme.</li>
              <li className="mb-2"><strong>"Données"</strong> : Informations de toute nature traitées par la Plateforme, incluant les données personnelles et professionnelles.</li>
              <li className="mb-2"><strong>"Plateforme" ou "Service"</strong> : Solution logicielle SaaS Karrosserie Pro accessible via karrosserie.pro et ses sous-domaines.</li>
              <li className="mb-2"><strong>"Utilisateur"</strong> : Toute personne physique autorisée par le Client à accéder à la Plateforme.</li>
            </ul>
          </section>

          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 3 - INSCRIPTION ET ACCÈS AUX SERVICES</h2>
            <h3 className="text-lg font-semibold mb-2">3.1 Éligibilité</h3>
            <p className="mb-4">
              La Plateforme est exclusivement destinée aux professionnels du secteur automobile. Le Client doit :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Être majeur et capable juridiquement</li>
              <li>Agir dans le cadre de son activité professionnelle</li>
              <li>Fournir des informations exactes et complètes</li>
              <li>Disposer des autorisations nécessaires pour engager son entreprise</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">3.2 Création de Compte</h3>
            <p className="mb-4">L'inscription s'effectue en ligne via le formulaire dédié. Le Client s'engage à :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Fournir des informations véridiques et à jour</li>
              <li>Maintenir la confidentialité de ses identifiants</li>
              <li>Notifier immédiatement toute utilisation non autorisée</li>
              <li>Assumer la responsabilité de toutes activités sous son Compte</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">3.3 Vérification</h3>
            <p className="mb-4">Kpital se réserve le droit de :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Vérifier l'exactitude des informations fournies</li>
              <li>Demander des justificatifs complémentaires</li>
              <li>Refuser ou suspendre l'accès en cas de doute sur l'authenticité</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">3.4 Gestion des Utilisateurs</h3>
            <p className="mb-4">
              L'Administrateur peut créer, modifier et supprimer des comptes Utilisateurs selon les besoins de son organisation. Il est responsable de :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>La gestion des droits d'accès</li>
              <li>La formation des Utilisateurs</li>
              <li>Le respect des CGU par tous les Utilisateurs</li>
            </ul>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 4 - DESCRIPTION DES SERVICES</h2>
            <h3 className="text-lg font-semibold mb-2">4.1 Fonctionnalités principales</h3>
            <p className="mb-4">La Plateforme offre les modules suivants :</p>
        
            <h4 className="text-md font-semibold mb-2">a) Gestion Clients et Véhicules</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Base de données clients complète</li>
              <li>Registre des véhicules avec décodage VIN automatique</li>
              <li>Historique des interventions</li>
              <li>Gestion documentaire (permis, cartes grises, photos)</li>
            </ul>
        
            <h4 className="text-md font-semibold mb-2">b) Gestion des Réparations</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Création et suivi des ordres de réparation</li>
              <li>Gestion des statuts et workflow</li>
              <li>Calculs automatiques (TVA, remises, totaux)</li>
              <li>Conversion en documents commerciaux</li>
            </ul>
        
            <h4 className="text-md font-semibold mb-2">c) Facturation et Documents Commerciaux</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Devis, factures, avoirs</li>
              <li>Numérotation automatique</li>
              <li>Personnalisation avec logo entreprise</li>
              <li>Export PDF et impressions</li>
            </ul>
        
            <h4 className="text-md font-semibold mb-2">d) Cessions de Créance</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Gestion des cessions aux compagnies d'assurance</li>
              <li>Suivi des statuts et validation</li>
              <li>Génération des documents légaux</li>
            </ul>
        
            <h4 className="text-md font-semibold mb-2">e) Outils d'Analyse</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Tableaux de bord</li>
              <li>Rapports d'activité</li>
              <li>Import de rapports d'expertise</li>
              <li>Statistiques et indicateurs clés</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">4.2 Disponibilité</h3>
            <p className="mb-4">
              Kpital s'engage à assurer une disponibilité du Service de 99,5% sur une base mensuelle, hors :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintenance planifiée (notifiée 48h à l'avance)</li>
              <li>Cas de force majeure</li>
              <li>Pannes des fournisseurs tiers (hébergement, réseau)</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">4.3 Support technique</h3>
            <p className="mb-4">Le support est accessible :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Par email : support@karrosserie.pro</li>
              <li>Via le système de tickets intégré</li>
              <li>Délai de réponse : 24h ouvrées pour les demandes standard</li>
              <li>Hotline prioritaire selon le niveau d'abonnement</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">4.4 Évolutions</h3>
            <p className="mb-4">Kpital améliore continuellement la Plateforme et peut :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Ajouter de nouvelles fonctionnalités</li>
              <li>Modifier les fonctionnalités existantes</li>
              <li>Retirer des fonctionnalités obsolètes</li>
              <li>Les changements majeurs sont notifiés avec un préavis de 30 jours.</li>
            </ul>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 5 - OBLIGATIONS DU CLIENT</h2>
            <h3 className="text-lg font-semibold mb-2">5.1 Utilisation conforme</h3>
            <p className="mb-4">Le Client s'engage à :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Utiliser la Plateforme conformément à sa destination</li>
              <li>Respecter les lois et règlements en vigueur</li>
              <li>Ne pas nuire au bon fonctionnement du Service</li>
              <li>Ne pas contourner les mesures de sécurité</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">5.2 Contenus</h3>
            <p className="mb-4">
              Le Client est seul responsable des Contenus qu'il upload, crée ou traite via la Plateforme. Il garantit :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Détenir tous les droits nécessaires</li>
              <li>Ne pas enfreindre les droits de tiers</li>
              <li>L'exactitude des informations saisies</li>
              <li>La conformité légale des documents générés</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">5.3 Sécurité</h3>
            <p className="mb-4">Le Client doit :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintenir la confidentialité des accès</li>
              <li>Utiliser des mots de passe robustes</li>
              <li>Former ses Utilisateurs aux bonnes pratiques</li>
              <li>Signaler immédiatement tout incident de sécurité</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">5.4 Sauvegardes</h3>
            <p className="mb-4">Bien que Kpital effectue des sauvegardes régulières, le Client est encouragé à :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Exporter régulièrement ses données importantes</li>
              <li>Conserver des copies de ses documents critiques</li>
              <li>Vérifier l'intégrité de ses archives</li>
            </ul>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 6 - PROPRIÉTÉ INTELLECTUELLE</h2>
            <h3 className="text-lg font-semibold mb-2">6.1 Propriété de la Plateforme</h3>
            <p className="mb-4">
              La Plateforme, incluant mais sans s'y limiter, le code source, les interfaces, les fonctionnalités, les logos, les marques et la documentation,
              est la propriété exclusive de Kpital ou de ses concédants. Toute reproduction, modification ou exploitation non autorisée est interdite.
            </p>
        
            <h3 className="text-lg font-semibold mb-2">6.2 Licence d'utilisation</h3>
            <p className="mb-4">
              Kpital accorde au Client une licence non exclusive, non transférable et révocable d'utilisation de la Plateforme pour la durée de l'abonnement,
              limitée à ses besoins professionnels internes.
            </p>
        
            <h3 className="text-lg font-semibold mb-2">6.3 Contenus du Client</h3>
            <p className="mb-4">Le Client conserve tous les droits sur ses Contenus. En utilisant la Plateforme, il accorde à Kpital une licence limitée pour :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Héberger et traiter les Contenus</li>
              <li>Les afficher dans le cadre du Service</li>
              <li>Effectuer des sauvegardes</li>
              <li>Les analyser pour améliorer le Service (données anonymisées)</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">6.4 Suggestions et Feedback</h3>
            <p className="mb-4">
              Toute suggestion, commentaire ou idée d'amélioration soumis à Kpital devient la propriété de Kpital qui peut l'utiliser librement sans compensation.
            </p>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 7 - PROTECTION DES DONNÉES</h2>
            <h3 className="text-lg font-semibold mb-2">7.1 Conformité RGPD</h3>
            <p className="mb-4">
              Kpital s'engage à traiter les données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois applicables.
              Notre Politique de Confidentialité détaille :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Les types de données collectées</li>
              <li>Les finalités du traitement</li>
              <li>Les mesures de sécurité</li>
              <li>Les droits des personnes concernées</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">7.2 Rôles et responsabilités</h3>
            <p className="mb-4">Kpital agit en tant que sous-traitant pour les données des clients finaux</p>
            <p className="mb-4">Le Client est responsable de traitement et doit respecter ses obligations légales</p>
            <p className="mb-4">Un accord de traitement des données (DPA) peut être fourni sur demande</p>
        
            <h3 className="text-lg font-semibold mb-2">7.3 Sécurité des données</h3>
            <p className="mb-4">Kpital met en œuvre des mesures techniques et organisationnelles appropriées :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Chiffrement des données en transit et au repos</li>
              <li>Contrôles d'accès stricts</li>
              <li>Audits de sécurité réguliers</li>
              <li>Formation du personnel</li>
              <li>Plan de réponse aux incidents</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">7.4 Localisation des données</h3>
            <p className="mb-4">
              Les données sont hébergées au sein de l'Union Européenne. Tout transfert hors UE respecte les mécanismes de protection appropriés
              (clauses contractuelles types, décisions d'adéquation).
            </p>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 8 - TARIFICATION ET PAIEMENT</h2>
            <h3 className="text-lg font-semibold mb-2">8.1 Abonnement</h3>
            <p className="mb-4">
              L'accès à la Plateforme est soumis à un abonnement mensuel ou annuel selon les tarifs en vigueur. Les prix sont :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Affichés hors taxes</li>
              <li>Payables d'avance</li>
              <li>Sujets à révision avec préavis de 60 jours</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">8.2 Modalités de paiement</h3>
            <p className="mb-4">Le paiement s'effectue par :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Prélèvement automatique SEPA</li>
              <li>Carte bancaire</li>
              <li>Virement bancaire (sur accord)</li>
              <li>Les factures sont émises mensuellement et disponibles dans le Compte.</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">8.3 Retard de paiement</h3>
            <p className="mb-4">En cas de défaut de paiement :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Rappel automatique à J+3</li>
              <li>Suspension du Service à J+15</li>
              <li>Résiliation à J+30</li>
              <li>Pénalités de retard au taux légal</li>
              <li>Frais de recouvrement à la charge du Client</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">8.4 Remboursement</h3>
            <p className="mb-4">Les abonnements sont non remboursables sauf :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Exercice du droit de rétractation (14 jours)</li>
              <li>Défaillance majeure du Service non résolue</li>
              <li>Accord exceptionnel de Kpital</li>
            </ul>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 9 - LIMITATION DE RESPONSABILITÉ</h2>
            <h3 className="text-lg font-semibold mb-2">9.1 Obligation de moyens</h3>
            <p className="mb-4">Kpital s'engage à fournir le Service avec diligence et selon les règles de l'art mais ne garantit pas :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>L'adéquation parfaite à tous les besoins spécifiques</li>
              <li>L'absence totale d'erreurs ou d'interruptions</li>
              <li>Les résultats obtenus par l'utilisation du Service</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">9.2 Exclusions</h3>
            <p className="mb-4">Kpital ne saurait être tenu responsable des :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Dommages indirects, pertes de profits ou d'opportunités</li>
              <li>Pertes de données dues à une négligence du Client</li>
              <li>Contenus créés ou uploadés par le Client</li>
              <li>Décisions prises sur la base des informations du Service</li>
              <li>Incompatibilités avec des systèmes tiers</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">9.3 Plafond de responsabilité</h3>
            <p className="mb-4">
              La responsabilité totale de Kpital est limitée au montant des sommes effectivement versées par le Client au cours des 12 derniers mois précédant l'incident.
            </p>
        
            <h3 className="text-lg font-semibold mb-2">9.4 Force majeure</h3>
            <p className="mb-4">Kpital est exonéré de toute responsabilité en cas de force majeure incluant mais sans s'y limiter :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Catastrophes naturelles</li>
              <li>Guerres, terrorisme, pandémies</li>
              <li>Grèves, lock-out</li>
              <li>Défaillances des infrastructures publiques</li>
              <li>Cyberattaques massives</li>
            </ul>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 10 - INDEMNISATION</h2>
            <h3 className="text-lg font-semibold mb-2">10.1 Par le Client</h3>
            <p className="mb-4">Le Client s'engage à indemniser, défendre et dégager Kpital de toute responsabilité en cas de :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violation des présentes CGU</li>
              <li>Utilisation non autorisée ou illégale du Service</li>
              <li>Infraction aux droits de tiers</li>
              <li>Contenus illicites ou non conformes</li>
              <li>Réclamations de ses clients finaux</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">10.2 Procédure</h3>
            <p className="mb-4">La partie demandant indemnisation doit :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Notifier promptement l'autre partie</li>
              <li>Fournir toute l'assistance raisonnable</li>
              <li>Permettre le contrôle de la défense</li>
              <li>Ne pas accepter de règlement sans accord</li>
            </ul>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 11 - CONFIDENTIALITÉ</h2>
            <h3 className="text-lg font-semibold mb-2">11.1 Informations confidentielles</h3>
            <p className="mb-4">Chaque partie s'engage à maintenir confidentielles les informations de l'autre partie incluant :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Données commerciales et financières</li>
              <li>Informations techniques et know-how</li>
              <li>Stratégies et projets</li>
              <li>Conditions contractuelles particulières</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">11.2 Exceptions</h3>
            <p className="mb-4">Ne sont pas considérées comme confidentielles les informations :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Déjà publiques sans violation</li>
              <li>Connues antérieurement sans obligation</li>
              <li>Développées indépendamment</li>
              <li>Divulguées avec autorisation</li>
              <li>Requises par la loi ou une autorité</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">11.3 Durée</h3>
            <p className="mb-4">L'obligation de confidentialité survit 5 ans après la fin de la relation contractuelle.</p>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 12 - DURÉE ET RÉSILIATION</h2>
            <h3 className="text-lg font-semibold mb-2">12.1 Durée</h3>
            <p className="mb-4">L'abonnement est conclu pour la période choisie (mensuelle ou annuelle) et se renouvelle automatiquement sauf résiliation.</p>
        
            <h3 className="text-lg font-semibold mb-2">12.2 Résiliation par le Client</h3>
            <p className="mb-4">Le Client peut résilier à tout moment :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Via son espace compte</li>
              <li>Par email avec préavis selon l'abonnement :</li>
              <li>Mensuel : 30 jours</li>
              <li>Annuel : 60 jours</li>
              <li>Sans pénalité mais sans remboursement</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">12.3 Résiliation par Kpital</h3>
            <p className="mb-4">Kpital peut résilier en cas de :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Non-paiement persistant</li>
              <li>Violation grave des CGU</li>
              <li>Utilisation frauduleuse ou abusive</li>
              <li>Décision stratégique (préavis 90 jours)</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">12.4 Effets de la résiliation</h3>
            <p className="mb-4">À la résiliation :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Accès immédiatement révoqué</li>
              <li>Export des données possible pendant 30 jours</li>
              <li>Suppression définitive après 90 jours</li>
              <li>Obligations de confidentialité maintenues</li>
            </ul>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 13 - DISPOSITIONS GÉNÉRALES</h2>
            <h3 className="text-lg font-semibold mb-2">13.1 Intégralité</h3>
            <p className="mb-4">
              Les présentes CGU, avec la Politique de Confidentialité et les conditions tarifaires, constituent l'intégralité de l'accord entre les parties et remplacent tous accords antérieurs.
            </p>
        
            <h3 className="text-lg font-semibold mb-2">13.2 Divisibilité</h3>
            <p className="mb-4">
              Si une disposition est déclarée invalide, les autres dispositions restent pleinement applicables. Les parties s'efforceront de remplacer la disposition invalide.
            </p>
        
            <h3 className="text-lg font-semibold mb-2">13.3 Non-renonciation</h3>
            <p className="mb-4">Le fait de ne pas exercer un droit ou recours ne constitue pas une renonciation à ce droit pour l'avenir.</p>
        
            <h3 className="text-lg font-semibold mb-2">13.4 Cession</h3>
            <p className="mb-4">Le Client ne peut céder ses droits sans accord écrit de Kpital. Kpital peut librement céder ses droits et obligations.</p>
        
            <h3 className="text-lg font-semibold mb-2">13.5 Notifications</h3>
            <p className="mb-4">Les notifications officielles se font :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Pour Kpital : legal@karrosserie.pro</li>
              <li>Pour le Client : email du Compte Administrateur</li>
              <li>Les notifications sont réputées reçues 24h après envoi.</li>
            </ul>
          </section>
        
          
          
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">ARTICLE 15 - CLAUSES SPÉCIFIQUES</h2>
            <h3 className="text-lg font-semibold mb-2">15.1 Utilisateurs du secteur automobile</h3>
            <p className="mb-4">
              La Plateforme est conçue spécifiquement pour les professionnels de la carrosserie automobile. L'utilisation pour d'autres secteurs est aux risques du Client.
            </p>
        
            <h3 className="text-lg font-semibold mb-2">15.2 Conformité réglementaire</h3>
            <p className="mb-4">
              Le Client reste seul responsable du respect des réglementations spécifiques à son activité (normes automobiles, environnementales, fiscales).
            </p>
        
            <h3 className="text-lg font-semibold mb-2">15.3 API et intégrations</h3>
            <p className="mb-4">L'utilisation des API est soumise à :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Limites de taux (rate limiting)</li>
              <li>Conditions des fournisseurs tiers</li>
              <li>Documentation technique séparée</li>
              <li>Possibles coûts additionnels</li>
            </ul>
        
            <h3 className="text-lg font-semibold mb-2">15.4 Formation et accompagnement</h3>
            <p className="mb-4">
              Kpital peut proposer des services de formation et d'accompagnement soumis à conditions et tarifications spécifiques.
            </p>
          </section>
        
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">CONTACT</h2>
            <p className="mb-2"><strong>KPITAL LIMITED</strong></p>
            <p className="mb-2">Service Juridique</p>
            <p className="mb-2">Email : legal@karrosserie.pro</p>
            <p className="mb-2">Adresse : Pod 2, l'ancienne gare, 15a Main Street, Blackrock, Dublin, Irlande</p>
            <p className="mb-2">Support Client : support@karrosserie.pro</p>
            <p className="mb-4">Service Commercial : contact@karrosserie.pro</p>
          </section>

          <p className="text-center text-sm text-muted-foreground mt-8 mb-4">
            En utilisant Karrosserie Pro, vous reconnaissez avoir lu, compris et accepté l'intégralité des présentes 
            Conditions Générales d'Utilisation.
          </p>
          <p className="text-center text-sm text-muted-foreground mb-8">
            <strong>Version 1.0 - Janvier 2025</strong>
          </p>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TermsAndConditions;
