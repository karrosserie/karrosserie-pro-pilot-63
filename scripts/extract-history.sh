#!/bin/bash

# Script d'extraction d'historique complet pour projet Lovable
# Usage: ./scripts/extract-history.sh

set -e

echo "🔍 Extraction de l'historique complet du projet Lovable..."

OUTPUT_FILE="COMPLETE_CHANGELOG.md"
PROJECT_NAME=$(basename "$(pwd)")
AUTHOR_NAME="Geoffrey GOBEYN"

# Fonction pour normaliser les auteurs
normalize_author() {
    local author="$1"
    case "$author" in
        *geoffrey*|*gobeyn*) echo "$AUTHOR_NAME" ;;
        *lovable*|*ai*|*bot*) echo "Assistant IA Lovable" ;;
        *) echo "$author" ;;
    esac
}

# Créer le header du fichier
cat > "$OUTPUT_FILE" << EOF
# Historique Complet du Projet: $PROJECT_NAME

**Généré le**: $(date '+%d/%m/%Y à %H:%M:%S')
**Outil**: Script d'extraction automatique
**Auteur principal**: $AUTHOR_NAME

---

## Résumé du Projet

EOF

# Statistiques générales
if command -v git &> /dev/null && git rev-parse --git-dir > /dev/null 2>&1; then
    TOTAL_COMMITS=$(git rev-list --all --count)
    CONTRIBUTORS=$(git shortlog -sn | wc -l)
    FIRST_COMMIT=$(git log --reverse --pretty=format:"%ad" --date=short | head -1)
    LAST_COMMIT=$(git log -1 --pretty=format:"%ad" --date=short)
    
    cat >> "$OUTPUT_FILE" << EOF
- **Total des commits**: $TOTAL_COMMITS
- **Contributeurs**: $CONTRIBUTORS
- **Premier commit**: $FIRST_COMMIT
- **Dernier commit**: $LAST_COMMIT
EOF
fi

# Statistiques des fichiers
TOTAL_FILES=$(find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.css" -o -name "*.scss" \) 2>/dev/null | wc -l)
cat >> "$OUTPUT_FILE" << EOF
- **Fichiers source**: $TOTAL_FILES

---

## Historique Git Détaillé

EOF

# Extraction de l'historique Git si disponible
if command -v git &> /dev/null && git rev-parse --git-dir > /dev/null 2>&1; then
    echo "📋 Extraction de l'historique Git..."
    
    # Historique détaillé avec fichiers modifiés
    git log --pretty=format:"### %ad%n**Auteur**: %an <%ae>%n**Hash**: \`%H\`%n**Modification**: %s%n%n**Description**:%n\`\`\`%n%b%n\`\`\`%n" --date=format:'%d/%m/%Y à %H:%M:%S' --reverse | while IFS= read -r line; do
        if [[ $line =~ \*\*Auteur\*\*:\ (.+)\ \<(.+)\> ]]; then
            author=$(normalize_author "${BASH_REMATCH[1]}")
            echo "**Auteur**: $author <${BASH_REMATCH[2]}>"
        else
            echo "$line"
        fi
    done >> "$OUTPUT_FILE"
    
    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
else
    echo "⚠ Aucun historique Git disponible" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
fi

# Analyse des fichiers du projet
echo "📊 Analyse des fichiers du projet..."

cat >> "$OUTPUT_FILE" << EOF
## Analyse des Fichiers

### Structure du projet

EOF

if [ -d "src" ]; then
    echo "\`\`\`" >> "$OUTPUT_FILE"
    tree src -I 'node_modules|.git|dist|build' 2>/dev/null || find src -type f | sed 's|[^/]*/|- |g' >> "$OUTPUT_FILE"
    echo "\`\`\`" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
fi

# Statistiques par type de fichier
cat >> "$OUTPUT_FILE" << EOF
### Statistiques par extension

EOF

if [ -d "src" ]; then
    find src -type f -name "*.*" | sed 's/.*\.//' | sort | uniq -c | sort -nr | while read count ext; do
        echo "- **.$ext**: $count fichiers" >> "$OUTPUT_FILE"
    done
    echo "" >> "$OUTPUT_FILE"
fi

# Fichiers récemment modifiés
cat >> "$OUTPUT_FILE" << EOF
### Fichiers récemment modifiés

EOF

find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec ls -lt {} + 2>/dev/null | head -10 | while read -r line; do
    file=$(echo "$line" | awk '{print $9}')
    date=$(echo "$line" | awk '{print $6, $7, $8}')
    echo "- \`$file\` - $date" >> "$OUTPUT_FILE"
done

echo "" >> "$OUTPUT_FILE"

# Commandes Git utiles si disponible
if command -v git &> /dev/null && git rev-parse --git-dir > /dev/null 2>&1; then
    cat >> "$OUTPUT_FILE" << EOF
## Statistiques des Contributeurs

EOF

    git shortlog -sn | while read count author; do
        normalized_author=$(normalize_author "$author")
        echo "- **$normalized_author**: $count commits" >> "$OUTPUT_FILE"
    done
    
    echo "" >> "$OUTPUT_FILE"
    
    cat >> "$OUTPUT_FILE" << EOF
## Fichiers les plus modifiés

EOF

    git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10 | while read count file; do
        if [ -n "$file" ]; then
            echo "- \`$file\` - $count modifications" >> "$OUTPUT_FILE"
        fi
    done
    
    echo "" >> "$OUTPUT_FILE"
fi

# Footer avec commandes utiles
cat >> "$OUTPUT_FILE" << EOF
---

## Commandes Utiles

### Git
\`\`\`bash
# Historique complet avec graphique
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

# Voir les changements d'un commit spécifique
git show <hash>

# Statistiques détaillées
git log --stat

# Historique d'un fichier spécifique
git log -p <fichier>
\`\`\`

### Analyse du projet
\`\`\`bash
# Compter les lignes de code
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Trouver les plus gros fichiers
find src -name "*.ts" -o -name "*.tsx" -exec wc -l {} + | sort -n

# Rechercher dans le code
grep -r "pattern" src/
\`\`\`

## Notes

- Ce rapport a été généré automatiquement le $(date '+%d/%m/%Y à %H:%M:%S')
- Pour l'historique Lovable complet, consultez l'onglet "Edit History" dans l'interface
- Les timestamps Git peuvent différer des timestamps système
- Utilisez \`git log\` pour plus de détails sur l'historique

EOF

echo "✅ Historique complet généré dans $OUTPUT_FILE"
echo "📄 Fichier créé: $(wc -l < "$OUTPUT_FILE") lignes"

# Optionnel: ouvrir le fichier
if command -v code &> /dev/null; then
    echo "🔧 Ouverture dans VS Code..."
    code "$OUTPUT_FILE"
elif command -v cat &> /dev/null; then
    echo "👀 Aperçu des premières lignes:"
    head -20 "$OUTPUT_FILE"
fi