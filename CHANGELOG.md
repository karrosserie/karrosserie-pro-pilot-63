# Changelog du Projet

Ce fichier répertorie les modifications apportées au projet. 

**Note**: Ce changelog est basé sur l'historique de conversation visible et ne contient que les modifications récentes. Pour un historique complet, consultez l'historique Git du projet.

## Modifications Récentes

### 2025-01-31
**Utilisateur**: Geoffrey GOBEYN
**Modification**: Correction du problème WebSocket dans use-expertise-reports.ts
- Désactivation temporaire des abonnements en temps réel pour éviter l'erreur "ws does not work in the browser"
- Ajout d'un TODO pour ré-implémenter avec une gestion WebSocket compatible navigateur
- Fichiers modifiés: `src/hooks/use-expertise-reports.ts`

### 2025-01-31  
**Utilisateur**: Geoffrey GOBEYN
**Modification**: Amélioration de la vue Employé dans Planning atelier
- Ajout d'une condition pour afficher le bouton "Démarrer" uniquement si le véhicule est à l'étape correspondante
- Implémentation de la vérification du champ `current_step` de la table `vehicle_workflow_steps`
- Ajout d'une icône "oeil" au bouton "Détails" dans les cards de la vue Employé
- Fichiers modifiés: `src/pages/Planning.tsx`

### 2025-01-31
**Utilisateur**: Geoffrey GOBEYN  
**Modification**: Rafraîchissement automatique des données lors du changement d'onglets
- Implémentation du rafraîchissement des données quand l'utilisateur change d'onglet dans la page "Planning atelier"
- Ajout de la fonction `refreshAllData()` pour recharger toutes les données de planification
- Conversion du composant `Tabs` en composant contrôlé avec gestion de l'état `activeTab`
- Fichiers modifiés: `src/pages/Planning.tsx`

---

## Format des Entrées

Chaque modification suit le format suivant :
- **Date**: Date de la modification
- **Utilisateur**: Nom de l'utilisateur ayant demandé la modification
- **Modification**: Description courte de ce qui a été modifié
- **Détails**: Liste des changements spécifiques
- **Fichiers modifiés**: Liste des fichiers affectés

## Notes

- Les modifications listées ci-dessus sont basées sur l'historique de conversation visible
- Pour un historique complet, consultez les commits Git du projet
- Les heures exactes peuvent être retrouvées dans l'historique Git
- Seules les modifications majeures sont répertoriées ici