# Guide Premium et Intégration Stripe 🚀

## Vue d'ensemble

Ce guide explique comment configurer et utiliser le système Premium de KivaïaKids avec l'intégration Stripe pour gérer les abonnements des utilisateurs.

## 🗄️ Structure de la base de données

### Table `subscriptions`

La table `subscriptions` stocke toutes les informations sur les abonnements premium :

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('monthly', 'annual')),
  status subscription_status NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

### Colonne `stripe_customer_id` dans `profiles`

Ajoutée pour lier les profils utilisateurs aux customers Stripe.

## 🔧 Configuration Stripe

### 1. Créer les produits et prix

Dans votre dashboard Stripe, créez :

**Produit : KivaïaKids Premium**
- **Prix mensuel** : 9,90€/mois
- **Prix annuel** : 99€/an

### 2. Configurer les webhooks

Ajoutez ces endpoints webhook dans Stripe :

```
https://votre-domaine.com/api/stripe/webhooks
```

**Événements à écouter :**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.created`

### 3. Récupérer les clés API

- **Clé publique** : `pk_test_...` (pour le frontend)
- **Clé secrète** : `sk_test_...` (pour les webhooks)
- **Webhook secret** : `whsec_...` (pour vérifier les signatures)

## 🚀 Déploiement des migrations

### 1. Exécuter les migrations

```bash
# Dans le dossier supabase/migrations/
supabase db push
```

### 2. Vérifier la création

```sql
-- Vérifier que la table existe
SELECT * FROM information_schema.tables 
WHERE table_name = 'subscriptions';

-- Vérifier les politiques RLS
SELECT * FROM pg_policies 
WHERE tablename = 'subscriptions';
```

## 📱 Utilisation du système Premium

### 1. Hook `usePremium`

```typescript
import { usePremium } from '@/hooks/use-premium';

const { isPremium, subscription, loading } = usePremium();
```

**Propriétés :**
- `isPremium` : Boolean indiquant si l'utilisateur a un abonnement actif
- `subscription` : Détails de l'abonnement (plan, dates, statut)
- `loading` : État de chargement
- `refreshPremiumStatus()` : Fonction pour rafraîchir le statut

### 2. Vérification du statut Premium

Le hook vérifie automatiquement :
- L'existence d'un abonnement actif
- La validité de la période de facturation
- La mise à jour automatique des statuts expirés

### 3. Gestion des webhooks

Le système traite automatiquement :
- **Création d'abonnement** : Nouvel enregistrement dans `subscriptions`
- **Mise à jour** : Modification du statut et des dates
- **Annulation** : Changement du statut vers 'canceled'

## 🔒 Sécurité et RLS

### Politiques Row Level Security

```sql
-- Utilisateurs voient leurs propres abonnements
CREATE POLICY "Users can view own subscriptions" 
ON subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- Seuls les admins peuvent modifier
CREATE POLICY "Only admins can modify subscriptions" 
ON subscriptions FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND role = 'admin'
));
```

## 📊 Monitoring et maintenance

### 1. Vérifier les abonnements actifs

```sql
SELECT 
  p.email,
  s.plan,
  s.status,
  s.current_period_end,
  s.created_at
FROM subscriptions s
JOIN profiles p ON s.user_id = p.id
WHERE s.status = 'active';
```

### 2. Abonnements expirés

```sql
SELECT 
  p.email,
  s.plan,
  s.current_period_end
FROM subscriptions s
JOIN profiles p ON s.user_id = p.id
WHERE s.current_period_end < NOW() 
AND s.status = 'active';
```

### 3. Statistiques des plans

```sql
SELECT 
  plan,
  COUNT(*) as count,
  status
FROM subscriptions 
GROUP BY plan, status;
```

## 🐛 Dépannage

### Problèmes courants

#### 1. Webhook non reçu
- Vérifier l'URL du webhook dans Stripe
- Contrôler les logs d'erreur
- Tester avec l'outil de test Stripe

#### 2. Abonnement non créé
- Vérifier que le customer Stripe existe
- Contrôler les permissions RLS
- Vérifier les logs de la base de données

#### 3. Statut Premium incorrect
- Rafraîchir le statut avec `refreshPremiumStatus()`
- Vérifier la validité des dates dans la base
- Contrôler la synchronisation avec Stripe

### Logs et debugging

```typescript
// Activer les logs détaillés
console.log('Statut Premium:', isPremium);
console.log('Détails abonnement:', subscription);
console.log('Chargement:', loading);
```

## 🔄 Mise à jour et maintenance

### 1. Ajouter de nouveaux plans

1. Créer le prix dans Stripe
2. Ajouter le plan dans l'enum `subscription_status`
3. Mettre à jour la fonction `determinePlan()`

### 2. Modifier les prix

1. Créer un nouveau prix dans Stripe
2. Mettre à jour les liens de paiement
3. Migrer les abonnements existants si nécessaire

### 3. Sauvegarde et restauration

```bash
# Sauvegarde de la table subscriptions
pg_dump -t subscriptions votre_base > subscriptions_backup.sql

# Restauration
psql votre_base < subscriptions_backup.sql
```

## 📚 Ressources additionnelles

- [Documentation Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Guide RLS Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [API Supabase](https://supabase.com/docs/reference/javascript/select)

## 🎯 Prochaines étapes

1. **Tests en production** : Vérifier le bon fonctionnement des webhooks
2. **Monitoring** : Mettre en place des alertes pour les échecs
3. **Analytics** : Tracker les conversions et rétentions
4. **Support client** : Interface pour gérer les abonnements

---

**Note** : Ce système est conçu pour être robuste et sécurisé. Assurez-vous de tester en environnement de développement avant la mise en production.
