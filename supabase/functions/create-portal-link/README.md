# Stripe Customer Portal - Fonction Edge Supabase

## 📋 Vue d'ensemble

Cette fonction Edge Supabase permet aux utilisateurs de gérer leur abonnement Premium via le portail client Stripe. Elle crée automatiquement des clients Stripe si nécessaire et génère des sessions de portail sécurisées.

## 🚀 Déploiement

### 1. Variables d'environnement

Créez un fichier `.env` dans ce dossier avec :

```bash
# Clé secrète Stripe (production ou test)
STRIPE_SECRET_KEY=sk_test_... ou sk_live_...

# URL Supabase (récupérée depuis le dashboard)
SUPABASE_URL=https://your-project.supabase.co

# Clé de service Supabase (récupérée depuis le dashboard)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Déploiement de la fonction

```bash
# Depuis le dossier racine du projet
supabase functions deploy create-portal-link

# Ou depuis ce dossier
supabase functions deploy create-portal-link --project-ref YOUR_PROJECT_REF
```

### 3. Vérification du déploiement

```bash
supabase functions list
```

## 🔐 Sécurité

- **JWT Verification** : Chaque requête doit inclure un token Bearer valide
- **Service Role** : Utilise la clé de service pour les opérations de base de données
- **CORS** : Headers CORS configurés pour les requêtes cross-origin
- **Input Validation** : Validation des méthodes HTTP et des en-têtes

## 📊 Fonctionnalités

### Création automatique de clients Stripe
- Si `profiles.stripe_customer_id` est null, crée un nouveau client Stripe
- Sauvegarde automatique de l'ID client dans la base de données
- Métadonnées incluant l'ID utilisateur Supabase

### Gestion des sessions de portail
- Création de sessions Stripe Billing Portal
- URL de retour configurée vers `/account`
- Gestion des erreurs avec messages en français

## 🧪 Test

### Test local
```bash
supabase functions serve create-portal-link --env-file .env
```

### Test avec curl
```bash
curl -X POST http://localhost:54321/functions/v1/create-portal-link \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## 📝 Logs

La fonction génère des logs détaillés pour :
- Erreurs d'authentification
- Création de clients Stripe
- Erreurs de création de sessions de portail
- Erreurs générales

## 🔧 Dépannage

### Erreurs communes

1. **"Token d'autorisation manquant"**
   - Vérifiez que l'en-tête Authorization est présent
   - Format : `Bearer <JWT_TOKEN>`

2. **"Configuration Stripe invalide"**
   - Vérifiez que `STRIPE_SECRET_KEY` est définie
   - Assurez-vous que la clé est valide

3. **"Configuration serveur invalide"**
   - Vérifiez `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`
   - Assurez-vous que les variables sont correctement définies

### Vérification des variables

```bash
# Dans la fonction déployée
supabase functions logs create-portal-link --follow
```

## 📚 Intégration Frontend

### Hook personnalisé
```typescript
import { useStripePortal } from '@/hooks/use-stripe-portal';

const { openPortal, isLoading } = useStripePortal();

// Utilisation
<Button onClick={openPortal} disabled={isLoading}>
  {isLoading ? 'Ouverture...' : 'Gérer mon abonnement'}
</Button>
```

### Variables d'environnement Frontend
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
```

## 🎯 Cas d'usage

1. **Utilisateur Premium** : Accès au portail pour gérer l'abonnement
2. **Nouvel utilisateur** : Création automatique du client Stripe
3. **Gestion de facturation** : Modification des méthodes de paiement
4. **Annulation** : Annulation d'abonnement via Stripe

## 🔄 Mise à jour

Pour mettre à jour la fonction :

```bash
# Modifier le code
# Puis redéployer
supabase functions deploy create-portal-link
```
