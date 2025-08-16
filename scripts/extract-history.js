#!/usr/bin/env node

/**
 * Script d'extraction de l'historique complet du projet Lovable
 * Utilise: node scripts/extract-history.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class HistoryExtractor {
  constructor() {
    this.projectRoot = process.cwd();
    this.outputFile = 'COMPLETE_CHANGELOG.md';
    this.changes = [];
    this.fileStats = new Map();
  }

  async run() {
    console.log('🔍 Extraction de l\'historique complet du projet...');
    
    try {
      await this.extractGitHistory();
      await this.extractFileStats();
      await this.extractLovableMetadata();
      await this.generateReport();
      
      console.log(`✅ Historique généré dans ${this.outputFile}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'extraction:', error.message);
    }
  }

  async extractGitHistory() {
    console.log('📋 Extraction de l\'historique Git...');
    
    try {
      // Vérifier si on est dans un repo git
      await execAsync('git rev-parse --git-dir');
      
      // Extraire l'historique complet avec détails
      const { stdout: gitLog } = await execAsync(`
        git log --pretty=format:"%H|%an|%ae|%ad|%s|%b" --date=iso --all
      `);
      
      const commits = gitLog.split('\n').filter(line => line.trim());
      
      for (const commit of commits) {
        const [hash, author, email, date, subject, body] = commit.split('|');
        
        // Extraire les fichiers modifiés pour ce commit
        const { stdout: filesChanged } = await execAsync(`git show --name-status ${hash}`);
        const files = this.parseFilesChanged(filesChanged);
        
        this.changes.push({
          type: 'git',
          hash: hash.substring(0, 8),
          author: this.normalizeAuthor(author, email),
          date: new Date(date),
          subject,
          body: body || '',
          files
        });
      }
      
      console.log(`   ✓ ${commits.length} commits extraits`);
    } catch (error) {
      console.log('   ⚠ Pas de repo Git ou erreur Git:', error.message);
    }
  }

  parseFilesChanged(gitOutput) {
    const lines = gitOutput.split('\n');
    const files = [];
    
    for (const line of lines) {
      if (line.match(/^[AMD]\s+/)) {
        const [status, file] = line.split('\t');
        files.push({
          status: this.getStatusLabel(status),
          file: file
        });
      }
    }
    
    return files;
  }

  getStatusLabel(status) {
    const labels = {
      'A': 'Ajouté',
      'M': 'Modifié', 
      'D': 'Supprimé',
      'R': 'Renommé',
      'C': 'Copié'
    };
    return labels[status] || status;
  }

  async extractFileStats() {
    console.log('📊 Analyse des fichiers du projet...');
    
    const srcDir = path.join(this.projectRoot, 'src');
    if (fs.existsSync(srcDir)) {
      await this.analyzeDirectory(srcDir);
    }
    
    console.log(`   ✓ ${this.fileStats.size} fichiers analysés`);
  }

  async analyzeDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await this.analyzeDirectory(fullPath);
      } else if (entry.isFile() && this.isSourceFile(entry.name)) {
        const stats = fs.statSync(fullPath);
        const relativePath = path.relative(this.projectRoot, fullPath);
        
        this.fileStats.set(relativePath, {
          created: stats.birthtime,
          modified: stats.mtime,
          size: stats.size,
          extension: path.extname(entry.name)
        });
      }
    }
  }

  isSourceFile(filename) {
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json', '.md'];
    return extensions.some(ext => filename.endsWith(ext));
  }

  async extractLovableMetadata() {
    console.log('🔧 Recherche de métadonnées Lovable...');
    
    // Chercher des fichiers de configuration Lovable
    const configFiles = [
      '.lovable',
      '.lovable.json',
      'lovable.config.js',
      'package.json'
    ];
    
    for (const configFile of configFiles) {
      const configPath = path.join(this.projectRoot, configFile);
      if (fs.existsSync(configPath)) {
        try {
          const content = fs.readFileSync(configPath, 'utf8');
          this.analyzeLovableConfig(configFile, content);
        } catch (error) {
          console.log(`   ⚠ Erreur lecture ${configFile}:`, error.message);
        }
      }
    }
  }

  analyzeLovableConfig(filename, content) {
    try {
      if (filename === 'package.json') {
        const pkg = JSON.parse(content);
        if (pkg.lovable || pkg.dependencies?.['@lovable/cli']) {
          this.changes.push({
            type: 'config',
            author: 'Système Lovable',
            date: new Date(fs.statSync(path.join(this.projectRoot, filename)).mtime),
            subject: 'Configuration Lovable détectée',
            body: `Configuration du projet: ${JSON.stringify(pkg.lovable || 'CLI détecté', null, 2)}`,
            files: [{ status: 'Analysé', file: filename }]
          });
        }
      }
    } catch (error) {
      console.log(`   ⚠ Erreur analyse ${filename}:`, error.message);
    }
  }

  normalizeAuthor(author, email) {
    // Normaliser les noms d'auteurs
    const authorMap = {
      'geoffrey': 'Geoffrey GOBEYN',
      'gobeyn': 'Geoffrey GOBEYN',
      'lovable': 'Assistant IA Lovable',
      'ai': 'Assistant IA Lovable'
    };
    
    const lowerAuthor = author.toLowerCase();
    for (const [key, value] of Object.entries(authorMap)) {
      if (lowerAuthor.includes(key)) {
        return value;
      }
    }
    
    // Si email contient des indices
    if (email && email.includes('geoffrey')) {
      return 'Geoffrey GOBEYN';
    }
    
    return author;
  }

  async generateReport() {
    console.log('📝 Génération du rapport...');
    
    // Trier les changements par date (plus récent en premier)
    this.changes.sort((a, b) => b.date - a.date);
    
    let report = this.generateHeader();
    report += this.generateSummary();
    report += this.generateDetailedHistory();
    report += this.generateFileAnalysis();
    report += this.generateFooter();
    
    fs.writeFileSync(this.outputFile, report, 'utf8');
  }

  generateHeader() {
    return `# Historique Complet du Projet

**Généré le**: ${new Date().toLocaleString('fr-FR')}
**Outil**: Script d'extraction automatique Lovable
**Auteur du projet**: Geoffrey GOBEYN

---

`;
  }

  generateSummary() {
    const totalChanges = this.changes.length;
    const gitCommits = this.changes.filter(c => c.type === 'git').length;
    const authors = [...new Set(this.changes.map(c => c.author))];
    
    return `## Résumé du Projet

- **Total des modifications**: ${totalChanges}
- **Commits Git**: ${gitCommits}
- **Contributeurs**: ${authors.join(', ')}
- **Fichiers source**: ${this.fileStats.size}

---

`;
  }

  generateDetailedHistory() {
    let section = `## Historique Détaillé

`;

    for (const change of this.changes) {
      section += `### ${change.date.toLocaleDateString('fr-FR')} à ${change.date.toLocaleTimeString('fr-FR')}
**Auteur**: ${change.author}
**Type**: ${change.type === 'git' ? 'Commit Git' : 'Configuration'}
${change.hash ? `**Hash**: \`${change.hash}\`` : ''}

**Modification**: ${change.subject}

`;

      if (change.body && change.body.trim()) {
        section += `**Description**:
\`\`\`
${change.body.trim()}
\`\`\`

`;
      }

      if (change.files && change.files.length > 0) {
        section += `**Fichiers affectés**:
`;
        for (const file of change.files) {
          section += `- ${file.status}: \`${file.file}\`
`;
        }
        section += `
`;
      }

      section += `---

`;
    }

    return section;
  }

  generateFileAnalysis() {
    let section = `## Analyse des Fichiers

### Statistiques par extension

`;

    const extStats = new Map();
    for (const [file, stats] of this.fileStats) {
      const ext = stats.extension || 'sans extension';
      if (!extStats.has(ext)) {
        extStats.set(ext, { count: 0, totalSize: 0 });
      }
      extStats.get(ext).count++;
      extStats.get(ext).totalSize += stats.size;
    }

    for (const [ext, stats] of extStats) {
      section += `- **${ext}**: ${stats.count} fichiers (${(stats.totalSize / 1024).toFixed(2)} KB)
`;
    }

    section += `
### Fichiers récemment modifiés

`;

    const recentFiles = [...this.fileStats.entries()]
      .sort((a, b) => b[1].modified - a[1].modified)
      .slice(0, 10);

    for (const [file, stats] of recentFiles) {
      section += `- \`${file}\` - ${stats.modified.toLocaleDateString('fr-FR')} ${stats.modified.toLocaleTimeString('fr-FR')}
`;
    }

    return section + `
`;
  }

  generateFooter() {
    return `---

## Notes

- Ce rapport a été généré automatiquement
- Les timestamps peuvent varier selon la source (Git vs système de fichiers)
- Pour plus de détails, consultez l'historique Git: \`git log --graph --oneline --all\`
- L'historique Lovable complet est disponible dans l'interface via l'onglet "Edit History"

## Commandes utiles

\`\`\`bash
# Historique Git détaillé
git log --pretty=format:"%h - %an, %ar : %s" --graph

# Statistiques des contributeurs
git shortlog -sn

# Fichiers les plus modifiés
git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -20
\`\`\`
`;
  }
}

// Exécution du script
if (require.main === module) {
  const extractor = new HistoryExtractor();
  extractor.run().catch(console.error);
}

module.exports = HistoryExtractor;