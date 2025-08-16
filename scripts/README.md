# Scripts d'Extraction d'Historique

Ce dossier contient des scripts pour extraire l'historique complet du projet Lovable.

## Utilisation

### Script Node.js (Recommandé)
```bash
# Installer Node.js si nécessaire
node scripts/extract-history.js
```

**Fonctionnalités:**
- ✅ Extraction de l'historique Git complet
- ✅ Analyse des fichiers et métadonnées
- ✅ Normalisation des noms d'auteurs
- ✅ Statistiques détaillées
- ✅ Détection des configurations Lovable
- ✅ Rapport au format Markdown

### Script Bash (Alternative)
```bash
# Rendre le script exécutable
chmod +x scripts/extract-history.sh

# Exécuter
./scripts/extract-history.sh
```

**Fonctionnalités:**
- ✅ Historique Git
- ✅ Statistiques des fichiers
- ✅ Structure du projet
- ✅ Contributeurs et modifications

## Fichiers générés

- `COMPLETE_CHANGELOG.md` - Historique complet détaillé
- Contient toutes les modifications avec:
  - Date et heure précises
  - Auteur normalisé (Geoffrey GOBEYN)
  - Description des modifications
  - Fichiers affectés
  - Statistiques du projet

## Normalisation des auteurs

Les scripts reconnaissent automatiquement:
- `geoffrey`, `gobeyn` → **Geoffrey GOBEYN**
- `lovable`, `ai`, `bot` → **Assistant IA Lovable**

## Prérequis

### Pour le script Node.js:
- Node.js installé
- Projet avec historique Git (optionnel)

### Pour le script Bash:
- Bash/Zsh
- Git (optionnel)
- `tree` pour l'arborescence (optionnel)

## Dépannage

Si l'historique Git n'est pas disponible:
1. Vérifiez que vous êtes dans un repo Git: `git status`
2. Les scripts fonctionnent aussi sans Git (analyse des fichiers seulement)
3. Consultez l'onglet "Edit History" dans Lovable pour l'historique complet

## Personnalisation

Modifiez les scripts pour:
- Changer le nom de l'auteur principal
- Ajouter d'autres formats d'export
- Filtrer certains types de fichiers
- Ajouter des statistiques personnalisées