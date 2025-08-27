# Guide du profil utilisateur - KivaïaKids

## 🎯 Vue d'ensemble

La page de profil utilisateur permet à chaque utilisateur connecté de consulter et modifier ses informations personnelles, gérer sa photo de profil et accéder rapidement aux fonctionnalités de la plateforme.

## 🔐 Accès

- **URL** : `/profile`
- **Permissions** : Utilisateurs connectés uniquement
- **Navigation** : 
  - **Desktop** : Cliquer sur le nom/prénom dans le header
  - **Mobile** : Cliquer sur la section utilisateur dans le menu burger

## ✨ Fonctionnalités principales

### 1. **Informations personnelles**
- **Prénom et nom** : Affichage et modification
- **Email** : Affichage en lecture seule (non modifiable)
- **Date d'inscription** : Affichage de la date de création du compte
- **Mode édition** : Bouton "Modifier" pour changer les informations

### 2. **Avatar**
- **Affichage** : Emoji sélectionné ou initiales par défaut
- **Sélection** : 4 avatars prédéfinis avec emojis (😊, 🎨, ⭐, 🚀)
- **Changement** : Clic sur un avatar pour le sélectionner
- **Stockage** : URL de l'avatar sauvegardée en base de données

### 3. **Gestion du rôle**
- **Badge admin** : Couronne dorée pour les administrateurs
- **Affichage du statut** : "Administrateur" ou "Étudiant"
- **Description** : Explication des permissions associées

### 4. **Interface épurée**
- **Design simplifié** : Interface plus claire et moins encombrée
- **Focus sur l'essentiel** : Informations personnelles et avatar uniquement

## 🚀 Comment utiliser

### **Accéder à son profil**
1. **Connectez-vous** à votre compte
2. **Cliquez sur votre nom** dans le header (desktop)
3. **Ou utilisez le menu mobile** et cliquez sur votre section utilisateur

### **Modifier ses informations**
1. Cliquez sur le bouton **"Modifier"** (bleu)
2. **Changez le prénom et/ou nom** dans les champs
3. Cliquez sur **"Sauvegarder"** pour confirmer
4. Ou **"Annuler"** pour abandonner les modifications

### **Changer son avatar**
1. **Cliquez sur un avatar** parmi les 4 disponibles
2. **Attendez la sauvegarde** (indicateur de chargement)
3. **L'avatar est mis à jour** automatiquement

### **Avatars disponibles**
- **😊 Avatar 1** : Emoji souriant (bleu/indigo)
- **🎨 Avatar 2** : Emoji artiste (vert/émeraude)
- **⭐ Avatar 3** : Emoji étoile (violet/violette)
- **🚀 Avatar 4** : Emoji fusée (orange/rouge)

## 🎨 Interface utilisateur

### **Layout principal**
- **2 colonnes** : Informations personnelles (gauche) + Sidebar (droite)
- **Design responsive** : Adaptation mobile et desktop
- **Thème bleu** : Couleurs cohérentes avec l'identité KivaïaKids

### **Cartes d'information**
- **Informations personnelles** : Carte principale avec mode édition
- **Avatar** : Sélection parmi 4 avatars prédéfinis
- **Rôle** : Affichage du statut avec icône appropriée

### **Indicateurs visuels**
- 👑 **Couronne dorée** : Badge admin sur l'avatar
- 🟡 **Badge Admin** : Statut administrateur visible
- 🔵 **Bouton Modifier** : Accès à l'édition des informations
- 😊🎨⭐🚀 **Avatars** : 4 emojis disponibles pour personnaliser son profil

## 🔧 Fonctionnalités techniques

### **Gestion des données**
- **Synchronisation** : Mise à jour en temps réel avec la base de données
- **Validation** : Vérification des données avant sauvegarde
- **Gestion d'erreurs** : Messages d'erreur et de succès

### **Avatars prédéfinis**
- **4 emojis disponibles** : 😊, 🎨, ⭐, 🚀
- **Sélection simple** : Clic pour changer d'avatar
- **Stockage léger** : URL simple en base de données
- **Rendu uniforme** : Affichage cohérent sur tous les appareils

### **Sécurité**
- **Authentification** : Accès uniquement pour les utilisateurs connectés
- **Permissions** : Chaque utilisateur ne peut modifier que son propre profil
- **Validation** : Vérification côté serveur des modifications

## 📱 Responsive design

### **Desktop (lg+)**
- **Layout 3 colonnes** : Informations (2) + Sidebar (1)
- **Navigation complète** : Tous les éléments visibles
- **Actions étendues** : Boutons avec texte complet

### **Tablet (md)**
- **Layout adaptatif** : Grille qui s'ajuste
- **Navigation optimisée** : Éléments réorganisés
- **Actions compactes** : Boutons adaptés à l'écran

### **Mobile (sm)**
- **Layout vertical** : Une seule colonne
- **Menu burger** : Navigation via le menu mobile
- **Actions tactiles** : Boutons optimisés pour le touch

## 🚨 Dépannage

### **Problèmes courants**

#### **"Impossible de charger le profil"**
- Vérifiez que vous êtes bien connecté
- Vérifiez votre connexion internet
- Contactez l'équipe technique si le problème persiste

#### **"Impossible de sauvegarder"**
- Vérifiez que tous les champs sont remplis correctement
- Vérifiez votre connexion internet
- Essayez de rafraîchir la page

#### **"Changement d'avatar échoué"**
- Vérifiez votre connexion internet
- Vérifiez que le clic fonctionne correctement
- Essayez de cliquer à nouveau sur l'avatar

#### **"Avatar ne s'affiche pas"**
- Vérifiez que l'avatar a bien été sélectionné
- Essayez de rafraîchir la page
- Vérifiez que l'emoji s'affiche correctement

## 💡 Bonnes pratiques

### **Pour les utilisateurs**
- ✅ **Choisissez un avatar qui vous représente** parmi les 4 disponibles
- ✅ **Mettez à jour régulièrement** vos informations
- ✅ **Vérifiez vos modifications** avant de sauvegarder
- ✅ **Utilisez les emojis** pour personnaliser votre profil

### **Pour les administrateurs**
- ✅ **Vérifiez votre statut** dans la section Rôle
- ✅ **Utilisez le lien Administration** pour accéder au panel admin
- ✅ **Maintenez vos informations** à jour

## 🔄 Mise à jour automatique

- **Profil en temps réel** : Modifications visibles immédiatement
- **Avatar dynamique** : Changements d'image instantanés
- **Statut synchronisé** : Rôle mis à jour automatiquement
- **Navigation fluide** : Retour automatique après modifications

## 🎨 Avatars disponibles

- **😊 Avatar 1** : Emoji souriant - Parfait pour les débutants
- **🎨 Avatar 2** : Emoji artiste - Pour les créatifs
- **⭐ Avatar 3** : Emoji étoile - Pour les performants
- **🚀 Avatar 4** : Emoji fusée - Pour les ambitieux

## 🚀 Navigation

- **Retour accueil** : Bouton "Retour à l'accueil"
- **Déconnexion** : Via le header principal

---

**Note** : Votre profil est personnel et sécurisé. Seules les informations que vous choisissez de partager sont visibles.
