# Guide d'utilisation - Gestion des cours KivaïaKids

## 🎯 Vue d'ensemble

La page de gestion des cours permet aux administrateurs de consulter, modifier et gérer tous les cours de la plateforme KivaïaKids depuis une interface centralisée et intuitive.

## 🔐 Accès

- **URL** : `/admin/manage-courses`
- **Permissions** : Administrateurs uniquement
- **Navigation** : Administration → Gérer les cours

## ✨ Fonctionnalités principales

### 1. **Vue d'ensemble des cours**
- Liste complète de tous les cours (publiés et brouillons)
- Affichage compact avec toutes les informations essentielles
- Thumbnails, catégories, statuts et ressources visibles d'un coup d'œil

### 2. **Statistiques en temps réel**
- **Total des cours** : Nombre total de cours dans la base
- **Cours publiés** : Nombre de cours accessibles aux utilisateurs
- **Brouillons** : Nombre de cours en cours de création/modification
- **Cours premium** : Nombre de cours nécessitant un abonnement

### 3. **Recherche et filtrage avancés**
- **Recherche textuelle** : Par titre ou description
- **Filtre par catégorie** : Toutes les catégories ou une catégorie spécifique
- **Filtre par statut** : Publiés, brouillons, ou tous
- **Réinitialisation** : Bouton pour effacer tous les filtres

### 4. **Gestion complète des cours**
- **Modifier** : Éditer tous les aspects d'un cours
- **Voir** : Prévisualiser le cours tel qu'il apparaît aux utilisateurs
- **Supprimer** : Supprimer définitivement un cours
- **Créer** : Accès direct à la création de nouveaux cours

## 🚀 Comment utiliser

### **Accéder à la gestion des cours**
1. Connectez-vous en tant qu'administrateur
2. Allez sur la page d'administration (`/admin`)
3. Cliquez sur la carte **"Gérer les cours"** (violette)

**Note** : La carte "Paramètres" a été supprimée de l'interface d'administration.

### **Rechercher un cours spécifique**
1. Utilisez la barre de recherche en haut
2. Tapez le titre ou une partie de la description
3. Les résultats se filtrent automatiquement

### **Filtrer les cours**
1. **Par catégorie** : Sélectionnez une catégorie spécifique
2. **Par statut** : Choisissez entre publiés et brouillons
3. **Combiner** : Utilisez plusieurs filtres simultanément

### **Modifier un cours existant**
1. Trouvez le cours dans la liste
2. Cliquez sur le bouton **"Modifier"** (bleu)
3. Modifiez les champs souhaités dans le modal
4. **Pour le contenu** : Utilisez l'éditeur professionnel avec boutons de formatage
5. **Prévisualisation** : Le contenu s'affiche en temps réel avec de belles classes CSS
6. Cliquez sur **"Sauvegarder"**

### **Publier/Dépublier un cours**
1. Trouvez le cours dans la liste
2. **Si brouillon** : Cliquez sur **"Publier"** (vert) pour le rendre visible
3. **Si publié** : Cliquez sur **"Dépublier"** (orange) pour le masquer
4. Le statut se met à jour automatiquement

### **Supprimer un cours**
1. Trouvez le cours à supprimer
2. Cliquez sur le bouton **"Supprimer"** (rouge)
3. Confirmez la suppression dans la boîte de dialogue

## 📋 Champs modifiables

### **Informations de base**
- **Titre** : Nom du cours
- **Description** : Résumé du contenu
- **Catégorie** : Classification du cours
- **Durée** : Temps d'apprentissage en minutes

### **Statut et visibilité**
- **Publié** : Rendre le cours visible aux utilisateurs
- **Premium** : Cours nécessitant un abonnement

### **Ressources multimédias**
- **URL Vidéo** : Lien vers la vidéo explicative
- **URL Audio** : Lien vers le podcast/audio
- **URL Document** : Lien vers les supports écrits
- **URL Thumbnail** : Image de présentation du cours

### **Contenu pédagogique**
- **Contenu** : Texte principal du cours
- **Objectif 1** : Premier objectif d'apprentissage
- **Objectif 2** : Deuxième objectif d'apprentissage
- **Objectif 3** : Troisième objectif d'apprentissage

## 🎨 Interface utilisateur

### **Cartes de cours**
- **Compactes** : Plus petites que dans la page publique
- **Informatives** : Toutes les informations essentielles visibles
- **Interactives** : Boutons d'action clairement identifiés

### **Indicateurs visuels**
- 🟢 **Publié** : Badge vert pour les cours visibles
- 🟡 **Brouillon** : Badge gris pour les cours en préparation
- ⭐ **Premium** : Badge jaune pour les cours payants
- 🎬 **Vidéo** : Badge bleu pour les cours avec vidéo
- 🎵 **Audio** : Badge violet pour les cours avec audio
- 📄 **Document** : Badge vert pour les cours avec documents

### **Boutons d'action**
- 🔵 **Modifier** : Éditer le cours
- 🟢 **Publier** : Rendre le cours visible aux utilisateurs (si brouillon)
- 🟠 **Dépublier** : Masquer le cours des utilisateurs (si publié)
- 🔴 **Supprimer** : Supprimer le cours

## 🔧 Fonctionnalités avancées

### **Modal d'édition**
- **Formulaire complet** : Tous les champs modifiables
- **Éditeur de contenu professionnel** : Même interface que la création de cours
- **Boutons de formatage** : H1, H2, Gras, Italique, Liste avec prévisualisation en temps réel
- **Aucune balise visible** : Le contenu s'affiche avec de belles classes CSS
- **Validation** : Vérification des données avant sauvegarde
- **Sauvegarde** : Mise à jour en temps réel
- **Annulation** : Possibilité d'annuler les modifications

### **Gestion des ressources**
- **URLs multiples** : Support de plusieurs types de médias
- **Validation** : Vérification du format des URLs
- **Prévisualisation** : Affichage des ressources disponibles

### **Statistiques dynamiques**
- **Compteurs en temps réel** : Mise à jour automatique
- **Filtrage intelligent** : Calculs basés sur les filtres actifs
- **Vue d'ensemble** : État global de la plateforme

## ⚠️ **Sécurité et limitations**

### **Protections en place**
- ✅ Seuls les administrateurs peuvent accéder
- ✅ Vérification des permissions côté serveur
- ✅ Confirmation pour les actions destructives
- ✅ Logs des modifications effectuées

### **Bonnes pratiques**
- 🔒 **Sauvegardez régulièrement** vos modifications
- 🔒 **Testez** les cours avant publication
- 🔒 **Vérifiez** les URLs des ressources
- 🔒 **Validez** le contenu avant publication

## 🚨 Dépannage

### **Problèmes courants**

#### **"Impossible de charger les cours"**
- Vérifiez votre connexion à la base de données
- Vérifiez vos permissions d'administrateur
- Contactez l'équipe technique si le problème persiste

#### **"Impossible de sauvegarder"**
- Vérifiez que tous les champs obligatoires sont remplis
- Vérifiez le format des URLs
- Vérifiez la taille du contenu

#### **"Cours non visible après modification"**
- Vérifiez que le cours est marqué comme "publié"
- Vérifiez que la catégorie est correcte
- Vérifiez que le contenu est complet

## 📱 Responsive design

- **Desktop** : Interface complète avec tous les filtres
- **Tablet** : Adaptation des colonnes et boutons
- **Mobile** : Interface optimisée pour petits écrans

## 🔄 Mise à jour automatique

- Les statistiques se mettent à jour en temps réel
- La liste des cours se rafraîchit automatiquement
- Les modifications sont immédiatement visibles

## 🚀 Accès rapides

- **Créer un cours** : Bouton direct vers la création
- **Voir un cours** : Prévisualisation instantanée
- **Retour admin** : Navigation rapide vers le tableau de bord

---

**Support technique** : Contactez l'équipe KivaïaKids pour toute question ou problème.
