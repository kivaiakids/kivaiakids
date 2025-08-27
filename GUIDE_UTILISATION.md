# Guide d'utilisation - Gestion des utilisateurs KivaïaKids

## 🎯 Vue d'ensemble

La page de gestion des utilisateurs permet aux administrateurs de gérer tous les comptes utilisateurs de la plateforme KivaïaKids, y compris la promotion et la rétrogradation des rôles.

## 🔐 Accès

- **URL** : `/admin/manage-users`
- **Permissions** : Administrateurs uniquement
- **Navigation** : Administration → Gérer les utilisateurs

## ✨ Fonctionnalités principales

### 1. **Vue d'ensemble des utilisateurs**
- Liste complète de tous les utilisateurs inscrits
- Affichage des informations : nom, email, rôle, date de création
- Avatars personnalisés ou initiales par défaut

### 2. **Recherche et filtrage**
- **Recherche** : Par nom, prénom ou email (en temps réel)
- **Filtre par rôle** : Tous, Administrateurs, Étudiants
- **Tri** : Par date de création, email, prénom, nom
- **Ordre** : Croissant ou décroissant

### 3. **Gestion des rôles**
- **Promouvoir Admin** : Transformer un étudiant en administrateur
- **Rétrograder** : Transformer un administrateur en étudiant
- **Sécurité** : Impossible de modifier son propre rôle

### 4. **Statistiques en temps réel**
- Total des utilisateurs
- Nombre d'administrateurs
- Nombre d'étudiants

## 🚀 Comment utiliser

### **Promouvoir un utilisateur en admin**
1. Naviguez vers `/admin/manage-users`
2. Trouvez l'utilisateur dans la liste
3. Cliquez sur le bouton **"Promouvoir Admin"** (bleu)
4. Confirmez l'action
5. L'utilisateur devient administrateur

### **Rétrograder un administrateur**
1. Trouvez l'administrateur dans la liste
2. Cliquez sur le bouton **"Rétrograder"** (rouge)
3. Confirmez l'action
4. L'utilisateur redevient étudiant

### **Rechercher un utilisateur**
1. Utilisez la barre de recherche en haut
2. Tapez le nom, prénom ou email
3. Les résultats se filtrent automatiquement

### **Filtrer par rôle**
1. Utilisez le menu déroulant "Filtrer par rôle"
2. Choisissez : Tous, Administrateurs, ou Étudiants
3. La liste se met à jour instantanément

## ⚠️ **Sécurité et limitations**

### **Protections en place**
- ✅ Seuls les administrateurs peuvent accéder à cette page
- ✅ Impossible de modifier son propre rôle
- ✅ Vérification des permissions côté serveur
- ✅ Logs des actions effectuées

### **Règles importantes**
- 🔒 **Un administrateur ne peut pas se rétrograder lui-même**
- 🔒 **Un utilisateur ne peut pas se promouvoir lui-même**
- 🔒 **Seuls les administrateurs existants peuvent promouvoir d'autres utilisateurs**

## 🎨 Interface utilisateur

### **Indicateurs visuels**
- 👑 **Couronne** : Administrateur
- 👤 **Personne** : Étudiant
- 🟦 **Bleu** : Bouton de promotion
- 🔴 **Rouge** : Bouton de rétrogradation
- 🟦 **Badge "Vous"** : Utilisateur connecté (non modifiable)

### **États des boutons**
- **Actif** : Bouton cliquable avec couleur appropriée
- **Désactivé** : Badge "Vous" pour l'utilisateur connecté
- **Hover** : Effets visuels au survol

## 🔧 Dépannage

### **Problèmes courants**

#### **"Impossible de mettre à jour le rôle"**
- Vérifiez que vous êtes bien connecté en tant qu'administrateur
- Vérifiez que la base de données est accessible
- Contactez l'équipe technique si le problème persiste

#### **"Action non autorisée"**
- Vous essayez de modifier votre propre rôle
- Utilisez un autre compte administrateur pour cette action

#### **Page non accessible**
- Vérifiez que vous êtes connecté
- Vérifiez que votre compte a le rôle "admin"
- Contactez un autre administrateur si nécessaire

## 📱 Responsive design

- **Desktop** : Interface complète avec tous les filtres
- **Tablet** : Adaptation des colonnes et boutons
- **Mobile** : Interface optimisée pour petits écrans

## 🔄 Mise à jour automatique

- Les statistiques se mettent à jour en temps réel
- La liste des utilisateurs se rafraîchit automatiquement
- Les changements de rôle sont immédiatement visibles

---

**Support technique** : Contactez l'équipe KivaïaKids pour toute question ou problème.
