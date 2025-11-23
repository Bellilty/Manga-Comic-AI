# 🎨 Guide API Ideogram 3.0

## 📚 Liens Officiels

### Documentation

- **Documentation principale** : https://developer.ideogram.ai/
- **Guide de setup** : https://developer.ideogram.ai/ideogram-api/api-setup
- **Référence API** : https://developer.ideogram.ai/api-reference/api-reference

### Tarification

- **Page de pricing** : https://ideogram.ai/features/api-pricing
- **Conditions d'utilisation** : https://ideogram.ai/legal/api-tos

### Site principal

- **Ideogram.ai** : https://ideogram.ai/

---

## 💰 Prix Exact (Août 2025)

### Modèles 3.0 (Recommandés)

| Modèle          | Prix par image | Vitesse        | Qualité    | Usage             |
| --------------- | -------------- | -------------- | ---------- | ----------------- |
| **3.0 Flash**   | **$0.03**      | ⚡ Très rapide | Bonne      | Tests rapides     |
| **3.0 Turbo**   | **$0.03**      | ⚡ Rapide      | Bonne      | Production rapide |
| **3.0 Default** | **$0.06**      | 🐢 Moyenne     | Très bonne | **⭐ Recommandé** |
| **3.0 Quality** | **$0.09**      | 🐌 Lente       | Excellente | Qualité maximale  |

### 🎭 Modèles avec Character Reference (Cohérence Personnages)

**⚠️ IMPORTANT** : Pour ton projet de comics, ces modèles sont **ESSENTIELS** !

| Modèle                          | Prix par image | Avantage                       |
| ------------------------------- | -------------- | ------------------------------ |
| **3.0 Turbo + Character Ref**   | **$0.10**      | Cohérence personnages garantie |
| **3.0 Default + Character Ref** | **$0.15**      | **⭐ Meilleur compromis**      |
| **3.0 Quality + Character Ref** | **$0.20**      | Qualité max + cohérence        |

### 💡 Remises

- **Remises volume** : Disponibles pour engagements annuels
- **Contact** : partnership@ideogram.ai pour négocier
- **Rate limit** : 10 requêtes simultanées par défaut

### 💳 Recharge automatique

- **Seuil par défaut** : $10 (déclenche recharge)
- **Recharge par défaut** : $40
- **Modifiable** : Oui, dans le dashboard API

---

## 🔑 Comment Créer une Clé API

### Étape 1 : Créer un compte

1. Aller sur https://ideogram.ai/
2. Cliquer sur **"Sign Up"**
3. S'inscrire avec email ou compte Google

### Étape 2 : Accéder à l'API

1. Se connecter à ton compte
2. Cliquer sur l'**icône menu** (☰) en haut à droite
3. Sélectionner **"API (Beta)"** ou **"API Beta"**

### Étape 3 : Accepter les conditions

1. Lire l'accord et la politique de l'API
2. Accepter les conditions d'utilisation

### Étape 4 : Configurer le paiement

1. Cliquer sur **"Manage Payment"** ou **"Gérer le paiement"**
2. Choisir **Personnel** ou **Professionnel**
3. Ajouter les informations de paiement
4. ⚠️ **Note** : Tu seras facturé seulement lors de la création de ta première clé API

### Étape 5 : Créer la clé API

1. Cliquer sur **"Create API key"** ou **"Créer une clé API"**
2. Nommer ta clé (ex: "Comic AI Project")
3. Générer la clé
4. ⚠️ **IMPORTANT** : La clé complète ne sera affichée **QU'UNE SEULE FOIS** !
5. **Copier et sauvegarder** immédiatement dans un endroit sûr (`.env.local` par exemple)

### Étape 6 : Configurer la recharge (optionnel)

1. Cliquer sur **"Edit"** à côté des seuils
2. Modifier le seuil minimum (défaut: $10)
3. Modifier le montant de recharge (défaut: $40)
4. Cliquer sur **"Save"**

---

## 🚀 Utilisation de l'API

### Endpoint principal

```
POST https://api.ideogram.ai/api/v1/generate
```

### Headers requis

```json
{
  "Authorization": "Bearer TON_API_KEY",
  "Content-Type": "application/json"
}
```

### Exemple de requête (Text-to-Image)

```json
{
  "prompt": "A comic book page with 4 panels showing a knight in armor",
  "model": "3.0-default", // ou "3.0-turbo" ou "3.0-quality"
  "aspect_ratio": "16:9",
  "style": "comic book"
}
```

### Exemple avec Character Reference (⭐ Pour ton projet)

```json
{
  "prompt": "Page 2 of the comic, knight continues his journey",
  "model": "3.0-default",
  "character_reference_image": "https://url-to-character-ref.png", // Image du personnage
  "reference_image": "https://url-to-page1.png", // Page précédente (style)
  "style_strength": 0.7 // 0.0 à 1.0
}
```

### Exemple avec image de référence (Style Transfer sans Character Ref)

```json
{
  "prompt": "Page 2 of the comic, same style as page 1",
  "model": "3.0-default",
  "reference_image": "https://url-to-page1.png", // URL de l'image précédente
  "style_strength": 0.7 // 0.0 à 1.0
}
```

### Paramètres disponibles

- `prompt` : Description textuelle (requis)
- `model` : `"3.0-flash"`, `"3.0-turbo"`, `"3.0-default"`, ou `"3.0-quality"`
- `aspect_ratio` : `"1:1"`, `"16:9"`, `"9:16"`, etc.
- `style` : Style artistique
- `character_reference_image` : **⭐ URL de l'image du personnage** (pour cohérence garantie)
- `reference_image` : URL de l'image de référence (pour style visuel)
- `style_strength` : Force du transfert de style (0.0 à 1.0)
- `seed` : Seed pour reproductibilité

### ⚠️ Important : Character Reference

- Si tu utilises `character_reference_image`, tu seras facturé au tarif "Character Reference"
- C'est **recommandé** pour ton projet de comics pour garantir la cohérence
- Tu peux combiner `character_reference_image` + `reference_image` pour cohérence totale

---

## ⚡ Vitesse de Génération

- **3.0 Turbo** : ~5-10 secondes
- **3.0 Default** : ~10-15 secondes
- **3.0 Quality** : ~15-25 secondes

---

## 🎯 Fonctionnalités pour Comics/Manga

### ✅ Supporté

- ✅ **Texte lisible** dans les images (meilleur que FLUX/DALL-E)
- ✅ **Image-to-image** avec référence (cohérence visuelle)
- ✅ **Style transfer** (maintenir le style entre pages)
- ✅ **Génération de page complète** (multi-panneaux)
- ✅ **Cohérence des personnages** (via référence d'image)

### 📝 Endpoints disponibles

- `POST /generate` : Génération d'image
- `POST /remix` : Remix d'image existante
- `POST /edit` : Édition d'image
- `POST /reframe` : Recadrage
- `POST /replace-background` : Remplacement d'arrière-plan

---

## 🎯 Comment Choisir le Modèle ?

### Pour ton Projet (Comics/Manga avec Cohérence)

#### ✅ **Option 1 : 3.0 Default avec Character Reference** (⭐ RECOMMANDÉ)

**Quand l'utiliser** :

- ✅ Tu veux **garantir la cohérence des personnages** entre les pages
- ✅ Tu as besoin d'une **qualité très bonne** (pas maximale)
- ✅ Tu veux un **bon compromis prix/qualité**

**Prix** : $0.15 par image
**Coût pour 4 pages** : 4 × $0.15 = **$0.60**

**Avantages** :

- ✅ Cohérence des personnages **garantie** (95%+)
- ✅ Texte lisible dans les images
- ✅ Qualité très bonne
- ✅ Vitesse acceptable (~10-15s)

---

#### ✅ **Option 2 : 3.0 Turbo avec Character Reference** (Budget)

**Quand l'utiliser** :

- ✅ Tu veux la cohérence mais avec un **budget serré**
- ✅ Tu acceptes une qualité légèrement inférieure
- ✅ Tu veux la **vitesse maximale**

**Prix** : $0.10 par image
**Coût pour 4 pages** : 4 × $0.10 = **$0.40**

**Avantages** :

- ✅ Cohérence des personnages garantie
- ✅ Prix le plus bas avec cohérence
- ✅ Très rapide (~5-10s)

**Inconvénients** :

- ⚠️ Qualité légèrement inférieure à Default

---

#### ✅ **Option 3 : 3.0 Quality avec Character Reference** (Premium)

**Quand l'utiliser** :

- ✅ Tu veux la **qualité maximale** + cohérence
- ✅ Le budget n'est pas un problème
- ✅ Tu peux attendre un peu plus

**Prix** : $0.20 par image
**Coût pour 4 pages** : 4 × $0.20 = **$0.80**

**Avantages** :

- ✅ Qualité **excellente**
- ✅ Cohérence des personnages garantie
- ✅ Détails parfaits

**Inconvénients** :

- ⚠️ Plus cher
- ⚠️ Plus lent (~15-25s)

---

#### ❌ **Option 4 : Sans Character Reference** (NON RECOMMANDÉ pour toi)

**Pourquoi éviter** :

- ❌ Pas de garantie de cohérence des personnages
- ❌ Les personnages peuvent changer d'apparence entre pages
- ❌ Même avec `reference_image`, la cohérence n'est pas garantie

**Utilise seulement si** :

- Tu génères des images isolées (pas de série)
- Tu n'as pas besoin de cohérence

---

## 💡 Recommandation Finale pour ton Projet

### 🎯 **3.0 Default avec Character Reference** ($0.15/image)

**Pourquoi** :

1. ✅ **Cohérence garantie** : Les personnages restent identiques entre pages
2. ✅ **Texte lisible** : Meilleur rendu de texte que FLUX
3. ✅ **Qualité très bonne** : Suffisant pour des comics professionnels
4. ✅ **Prix raisonnable** : $0.60 pour 4 pages
5. ✅ **Vitesse acceptable** : ~10-15 secondes par page

### 📋 Stratégie de Génération

1. **Page 1** :

   - Modèle : `3.0-default` avec Character Reference
   - Upload une image de référence du personnage (ou génère-la d'abord)
   - Prompt : Description complète de la page 1

2. **Page 2+** :
   - Modèle : `3.0-default` avec Character Reference
   - `character_reference_image` : Image du personnage de la page 1
   - `reference_image` : Page précédente (pour style visuel)
   - Prompt : Description de la nouvelle page

### 💰 Coût Estimé

| Nombre de pages | Coût (Default + Character Ref) |
| --------------- | ------------------------------ |
| 3 pages         | $0.45                          |
| 4 pages         | $0.60                          |
| 5 pages         | $0.75                          |
| 10 pages        | $1.50                          |

---

## 🔒 Sécurité

⚠️ **NE JAMAIS** commiter ta clé API dans Git !

- Utilise `.env.local` :
  ```
  IDEOGRAM_API_KEY=ton_api_key_ici
  ```
- Ajoute `.env.local` à `.gitignore`

---

## 📞 Support

- **Email** : email@ideogram.ai
- **Documentation** : https://developer.ideogram.ai/

---

## 🧪 Tester Ideogram (Playground)

### Option 1 : Interface Web Ideogram (⭐ RECOMMANDÉ)

**Le plus simple** : Utilise directement le site Ideogram pour tester !

1. **Aller sur** : https://ideogram.ai/
2. **Créer un compte gratuit** (email ou Google)
3. **Générer des images directement** dans l'interface web
4. **Tester les fonctionnalités** :
   - Text-to-image
   - Remix (avec image de référence)
   - Character Reference
   - Différents modèles (Turbo, Default, Quality)

**Avantages** :

- ✅ **Gratuit** pour tester (générations limitées)
- ✅ Interface visuelle intuitive
- ✅ Pas besoin d'API key pour tester
- ✅ Tu peux voir la qualité avant d'intégrer l'API

**Limite** : Générations limitées en gratuit, mais suffisant pour tester

---

### Option 2 : Playgrounds Tiers

#### Runware

- **URL** : https://runware.ai/models
- **Fonctionnalités** : Ideogram 3.0, Remix, Edit, Reframe
- **Note** : Nécessite un compte

#### RunComfy

- **URL** : https://www.runcomfy.com/playground/ideogram/ideogram-v3/api
- **Fonctionnalités** : Playground avec documentation API
- **Note** : Interface technique

---

### Option 3 : Tester l'API Directement

Une fois ta clé API créée, tu peux tester avec `curl` :

```bash
curl -X POST https://api.ideogram.ai/api/v1/generate \
  -H "Authorization: Bearer TON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A comic book page with 4 panels showing a knight",
    "model": "3.0-default",
    "aspect_ratio": "16:9"
  }'
```

Ou avec un script Node.js simple :

```javascript
const response = await fetch("https://api.ideogram.ai/api/v1/generate", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.IDEOGRAM_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "A comic book page with 4 panels",
    model: "3.0-default",
    aspect_ratio: "16:9",
  }),
});
```

---

## ✅ Prochaines Étapes

1. ✅ **Tester sur ideogram.ai** (interface web gratuite)
2. ✅ Créer un compte Ideogram
3. ✅ Configurer le paiement
4. ✅ Générer la clé API
5. ✅ Tester avec un appel API simple
6. ✅ Intégrer dans le code du projet

**Prêt à intégrer ?** 🚀
