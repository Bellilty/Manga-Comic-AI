# 🔧 Configuration des Variables d'Environnement

## Variables Requises

Crée un fichier `.env.local` à la racine du projet avec les variables suivantes :

```bash
# OpenAI API Key (pour GPT-4o-mini - génération de texte)
# Obtenir une clé : https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...

# Ideogram API Key (pour génération d'images)
# Obtenir une clé : https://ideogram.ai/ (Menu > API Beta)
# Voir IDEOGRAM_API_GUIDE.md pour les instructions complètes
IDEOGRAM_API_KEY=ideogram_...
```

## Comment Obtenir les Clés

### OpenAI API Key
1. Aller sur https://platform.openai.com/
2. Se connecter ou créer un compte
3. Aller dans "API keys"
4. Créer une nouvelle clé secrète
5. Copier la clé (commence par `sk-`)

### Ideogram API Key
1. Aller sur https://ideogram.ai/
2. Se connecter ou créer un compte
3. Cliquer sur le menu (☰) en haut à droite
4. Sélectionner "API (Beta)"
5. Configurer le paiement
6. Créer une clé API
7. ⚠️ **Copier immédiatement** (affichée une seule fois)

Voir `IDEOGRAM_API_GUIDE.md` pour les instructions détaillées.

## Variables Optionnelles

```bash
# Hugging Face Token (plus nécessaire, mais gardé pour compatibilité)
# HF_TOKEN=hf_...
```

## Sécurité

⚠️ **NE JAMAIS** commiter `.env.local` dans Git !
- Le fichier est déjà dans `.gitignore`
- Ne partage jamais tes clés API publiquement

