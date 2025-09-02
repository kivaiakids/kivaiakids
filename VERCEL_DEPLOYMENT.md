# 🚀 Guide de Déploiement Vercel - KivaïaKids

## 📋 Stack Technique

**Type d'application :** Vite/React SPA (Single Page Application)
- **Framework :** React 18 + TypeScript
- **Build tool :** Vite 5.4.19
- **Routing :** React Router DOM (BrowserRouter)
- **Styling :** Tailwind CSS + Shadcn/ui
- **Backend :** Supabase (Auth + Database + Storage)

## 🔧 Configuration Vercel

### Fichier `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Pourquoi cette configuration ?

1. **Rewrites SPA** : Toutes les routes (`/about`, `/courses`, etc.) redirigent vers `/` pour que React Router gère le routing côté client
2. **Cache des assets** : Les fichiers dans `/assets/` sont mis en cache 1 an (immutable)
3. **Headers de sécurité** : Protection contre XSS, clickjacking, et MIME sniffing

## 🛠️ Problèmes Résolus

### ❌ Problème 1 : 404 au refresh des routes
**Cause :** SPA sans configuration de fallback
**Solution :** `vercel.json` avec rewrites vers `/`

### ❌ Problème 2 : Erreur FIDO2/WebAuthn
**Cause :** Aucun script problématique trouvé dans le codebase
**Status :** ✅ Pas de problème détecté

## 📁 Structure des Routes

Toutes ces routes sont gérées par React Router :
- `/` - Page d'accueil
- `/about` - À propos
- `/courses` - Apprendre une langue
- `/eveil-aux-langues` - Éveil aux langues
- `/pricing` - Nos offres
- `/terms` - Conditions générales
- `/auth` - Authentification
- `/profile` - Profil utilisateur
- `/admin/*` - Administration
- Et toutes les autres routes définies dans `App.tsx`

## 🧪 Tests de Validation

### Tests Locaux
```bash
# Build de production
npm run build

# Vérifier que dist/ contient index.html
ls -la dist/

# Tester en local (optionnel)
npm run preview
```

### Tests Vercel
1. **Déploiement Preview** : Vérifier que toutes les routes fonctionnent
2. **Test de refresh** : Aller sur `/about` et faire F5 → doit rester sur `/about`
3. **Test de navigation directe** : Aller directement sur `https://votre-site.vercel.app/about`
4. **Console** : Vérifier qu'il n'y a pas d'erreurs JavaScript

## 🔍 Monitoring

### Vérifications Post-Déploiement
- [ ] Toutes les routes accessibles directement (pas de 404)
- [ ] Refresh sur n'importe quelle route fonctionne
- [ ] Console sans erreurs JavaScript
- [ ] Performance Lighthouse stable
- [ ] Assets chargés correctement

### Logs à Surveiller
- Erreurs 404 sur des routes valides
- Erreurs JavaScript dans la console
- Problèmes de chargement des assets

## 🚨 Dépannage

### Si 404 persiste
1. Vérifier que `vercel.json` est à la racine
2. Redéployer sur Vercel
3. Vérifier les logs Vercel

### Si erreurs JavaScript
1. Vérifier la console du navigateur
2. Tester en mode incognito
3. Vérifier les variables d'environnement

### Si assets ne se chargent pas
1. Vérifier que `copyPublicDir: true` dans `vite.config.ts`
2. Vérifier les chemins dans `index.html`

## 📊 Performance

### Optimisations Actives
- **Code splitting** : Vendor et router séparés
- **Tree shaking** : Import ES6 uniquement
- **Minification** : esbuild pour la vitesse
- **Cache** : Assets mis en cache 1 an
- **Compression** : Gzip automatique Vercel

### Métriques Cibles
- **Lighthouse Mobile** : ≥ 95
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1

## 🔐 Sécurité

### Headers Appliqués
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Bonnes Pratiques
- Variables d'environnement dans Vercel (pas en dur)
- HTTPS forcé par Vercel
- CSP à considérer pour l'avenir

---

**Dernière mise à jour :** Janvier 2025
**Version :** 1.0.0
**Maintenu par :** Équipe KivaïaKids
