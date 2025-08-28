# Changelog - KivaïaKids

## [2025-01-27] - Réassurance et conditions d'utilisation

### ✅ Ajouté
- **Page CGU complète** : Conditions Générales d'Utilisation avec 11 sections détaillées
- **Navigation CGU** : Route `/terms` avec bouton de retour à l'accueil
- **Lien CGU** : Bouton "Conditions d'utilisation" dans le footer
- **Design professionnel** : Page CGU avec design cohérent et lisible
- **Contrôle d'accès** : Redirection vers l'inscription pour les utilisateurs non connectés
- **Bouton adaptatif** : Texte différent selon le statut de connexion dans la popup des cours
- **Page Premium** : Interface de paiement professionnelle avec options mensuel (9,90€) et annuel (99€)
- **Intégration Stripe** : Liens de paiement directs vers les pages Stripe fournies
- **CTA Premium** : Bouton "Découvrir Premium" sur la page d'accueil
- **FAQ moderne** : Accordéon interactif avec questions/réponses extensibles
- **Gestion des abonnements** : Table `subscriptions` avec intégration complète Stripe
- **Hook usePremium** : Vérification automatique du statut premium des utilisateurs
- **Webhooks Stripe** : Traitement automatique des événements de paiement

### 🔄 Modifié
- **Footer Layout** : Simplification du footer (suppression des éléments de réassurance)
- **Texte copyright** : "Apprendre les langues facilement" au lieu de "plateforme éducative sécurisée"
- **Onglet par défaut** : Page d'authentification affiche l'inscription par défaut
- **Popup des cours** : Bouton adaptatif selon le statut de connexion
- **Page d'accueil** : Ajout du bouton "Découvrir Premium" dans la section des cours
- **Page Premium** : Suppression de "Langues multiples disponibles", FAQ transformée en accordéon moderne
- **Interface Premium** : Affichage conditionnel selon le statut premium de l'utilisateur
- **Logos du site** : Remplacement du favicon et du logo header par les nouvelles images fournies
- **Section Premium attractive** : Nouvelle section sur la page d'accueil avec design vendeur et couleurs attrayantes
- **Header redesign complet** : Navbar sticky avec backdrop-blur, logo optimisé (h-7 mobile, h-10 desktop), navigation centrée, actions à droite, design professionnel et clean
- **Spacing optimisé** : Padding-top réduit pour éliminer l'espace blanc au-dessus du hero section
- **Hero section agrandie** : Padding vertical responsive (py-20 mobile, py-32 tablet, py-30 desktop) pour une présence optimale sur tous les écrans
- **Hero header optimisé** : Typographie responsive et CTA buttons modernisés selon les spécifications design (56px desktop, 32px mobile, gradients, spacing)
- **Header et Hero redesign complet** : Navbar professionnelle (logo left, nav center, actions right), hero clean avec composant dédié, design moderne et cohérent

### 🎯 Résultat
L'application est maintenant **plus rassurante** et **légale** :
- **Conformité** : CGU complètes et accessibles
- **Transparence** : Informations claires sur l'éditeur et les conditions
- **Professionnalisme** : Design cohérent pour les pages légales
- **Contrôle d'accès** : Redirection intelligente vers l'inscription pour les non-connectés
- **Monétisation** : Interface Premium professionnelle et vendeuse avec intégration Stripe
- **Base de données** : Structure complète pour gérer les abonnements et customers Stripe
- **Sécurité** : Politiques RLS et gestion sécurisée des données d'abonnement
- **Design et branding** : Identité visuelle mise à jour avec nouveaux logos et section Premium attractive

---

## [2025-01-27] - Espace utilisateur et présentation des cours

### ✅ Ajouté
- **Page de profil utilisateur** : Interface complète pour consulter et modifier ses informations
- **Gestion des avatars** : Upload, affichage et suppression de photos de profil
- **Badge administrateur** : Couronne dorée pour identifier les admins
- **Popup de présentation des cours** : Même modal sur la page d'accueil que sur la page des cours
- **Navigation vers le profil** : Liens cliquables dans le header et menu mobile

### 🔄 Modifié
- **Page d'accueil** : Bouton "Voir" des cours ouvre maintenant la popup de présentation
- **Layout** : Section utilisateur cliquable pour accéder au profil
- **Menu mobile** : Section utilisateur cliquable pour accéder au profil

### ❌ Supprimé
- **Navigation directe** : Les cours de la page d'accueil ne naviguent plus directement vers la page du cours

### 🎯 Résultat
L'expérience utilisateur est maintenant **cohérente** et **intuitive** :
- **Présentation uniforme** : Même popup de cours partout dans l'application
- **Profil accessible** : Navigation facile vers les informations personnelles
- **Interface unifiée** : Comportement identique sur toutes les pages
- **Gestion des avatars** : Possibilité de personnaliser son profil

---

## [2025-01-27] - Interface d'administration simplifiée

### ✅ Ajouté
- **Page de gestion des cours** : Interface complète pour modifier et gérer tous les cours
- **Éditeur de contenu professionnel** : Composant RichTextEditor dans la modification des cours
- **Boutons de publication** : Publier/Dépublier les cours directement depuis la liste
- **Filtres avancés** : Recherche, catégorie, statut pour la gestion des cours
- **Statistiques en temps réel** : Compteurs de cours, publiés, brouillons, premium

### 🔄 Modifié
- **Interface d'administration** : Remplacement de la carte "Statistiques" par "Gérer les cours"
- **Éditeur de contenu** : Suppression de l'ancien système de formatage manuel
- **Boutons d'action** : Remplacement de "Voir" par "Publier/Dépublier"
- **Navigation** : Ajout de la route `/admin/manage-courses`

### ❌ Supprimé
- **Carte "Paramètres"** : Suppression de l'interface de configuration générale
- **Bouton "Voir"** : Remplacé par les boutons de publication
- **Ancien éditeur de contenu** : Zone de texte simple avec boutons manuels
- **Import Settings** : Icône non utilisée supprimée

### 🎯 Résultat
L'interface d'administration est maintenant plus **focalisée** et **efficace** :
- **3 cartes principales** : Créer un cours, Liste des utilisateurs, Gérer les cours
- **Gestion complète** : Modification de tous les aspects des cours
- **Expérience unifiée** : Même éditeur que la création de cours
- **Interface simplifiée** : Suppression des éléments non essentiels

---

## [2025-01-27] - Amélioration de l'éditeur de contenu

### ✅ Ajouté
- **Composant RichTextEditor** : Interface professionnelle pour la modification des cours
- **Prévisualisation en temps réel** : Le contenu s'affiche immédiatement formaté
- **Boutons de formatage** : H1, H2, Gras, Italique, Liste
- **Support Markdown complet** : Écriture directe ou utilisation des boutons

### 🔄 Modifié
- **Zone de contenu** : Remplacement de la zone de texte simple
- **Interface utilisateur** : Même expérience que la création de cours
- **Formatage** : Application automatique des styles CSS

### ❌ Supprimé
- **Boutons de formatage manuels** : Remplacés par le composant RichTextEditor
- **Affichage des balises** : Plus de balises Markdown visibles
- **Interface basique** : Suppression de l'ancien système

### 🎯 Résultat
L'édition de contenu est maintenant **professionnelle** et **intuitive** :
- **Aucune balise visible** : Rendu avec de belles classes CSS
- **Prévisualisation immédiate** : Plus besoin de deviner le rendu
- **Interface cohérente** : Même expérience partout dans l'application
- **Formatage automatique** : Plus d'erreurs de syntaxe

---

## [2025-01-27] - Gestion des utilisateurs simplifiée

### ✅ Ajouté
- **Page de gestion des utilisateurs** : Interface complète pour consulter la liste
- **Recherche et filtrage** : Par nom, email, rôle
- **Statistiques** : Total, administrateurs, étudiants
- **Navigation sécurisée** : Accès administrateur uniquement

### 🔄 Modifié
- **Fonctionnalités** : Suppression de la promotion/rétrogradation des rôles
- **Interface** : Changement de "Gérer les utilisateurs" à "Liste des utilisateurs"
- **Boutons d'action** : Suppression des boutons de modification des rôles

### ❌ Supprimé
- **Modification des rôles** : Impossible de changer les rôles depuis l'interface
- **Boutons de promotion** : Suppression des actions de gestion des permissions
- **Fonction toggleUserRole** : Suppression de la logique de changement de rôle

### 🎯 Résultat
La gestion des utilisateurs est maintenant **consultative** uniquement :
- **Vue d'ensemble** : Liste complète des utilisateurs
- **Recherche avancée** : Filtres et tri disponibles
- **Sécurité renforcée** : Aucune modification des permissions
- **Interface simplifiée** : Focus sur la consultation

---

## [2025-01-27] - Navigation et métadonnées

### ✅ Ajouté
- **Composant ScrollToTop** : Défilement automatique vers le haut à chaque changement de route
- **Hook useScrollToTop** : Gestion personnalisée du scroll
- **Métadonnées KivaïaKids** : Titre, description, mots-clés optimisés
- **Documentation complète** : Guides d'utilisation détaillés

### 🔄 Modifié
- **Métadonnées HTML** : Mise à jour pour KivaïaKids
- **Langue** : Changement de `en` à `fr`
- **Titre** : "KivaïaKids - Apprendre le français en s'amusant"
- **Description** : Plateforme éducative pour enfants

### ❌ Supprimé
- **Métadonnées génériques** : Suppression des références Lovable
- **Langue anglaise** : Remplacement par le français
- **Titre par défaut** : Remplacement par le nom de la plateforme

### 🎯 Résultat
L'application est maintenant **professionnelle** et **optimisée** :
- **SEO amélioré** : Métadonnées spécifiques à KivaïaKids
- **Navigation fluide** : Scroll automatique vers le haut
- **Langue française** : Interface et métadonnées en français
- **Documentation complète** : Guides d'utilisation détaillés

---

## [2025-01-27] - Navbar Visibility & Mobile Drawer Fixes

### Changed
- **Navbar Background**: Replaced transparent backdrop with solid dark green gradient `bg-[linear-gradient(180deg,rgba(7,65,40,0.85)_0%,rgba(6,78,59,0.80)_100%)]` for better visibility on white backgrounds
- **Navbar Styling**: Added `backdrop-blur-md`, `border-b border-white/15`, and `shadow-[0_2px_16px_rgba(0,0,0,0.15)]` for professional appearance
- **Mobile Drawer**: Refactored mobile menu to use `open` state instead of `menuOpen` for consistency
- **Drawer Behavior**: Mobile drawer now opens with proper black background and overlay, with ESC key support and body scroll lock
- **State Management**: Simplified state management using `open` and `setOpen` for better React patterns

## [2025-01-27] - Mobile Drawer Complete Refactor

### Fixed
- **JSX Structure**: Completely refactored Layout.tsx to fix JSX syntax errors and malformed tags
- **Drawer Rendering**: Eliminated floating elements over hero section - all menu items now render properly inside the drawer
- **Color Consistency**: Replaced all light-colored elements with proper dark theme elements for black background
- **Menu Items**: Simplified menu items to clean, large, tappable buttons with consistent spacing and hover effects

### Changed
- **Drawer Layout**: Menu items now use simple button elements with `text-lg font-semibold` styling
- **Hover Effects**: Consistent `hover:bg-white/10` effects across all menu items
- **Borders**: Updated all borders to use `border-gray-700` for consistency with black theme
- **Text Colors**: All text now properly visible on black background with appropriate contrast

### Technical
- **State Management**: Clean `open`/`setOpen` state pattern with proper useEffect cleanup
- **Accessibility**: Proper `aria-expanded`, focus states, and keyboard navigation (ESC key)
- **Performance**: Optimized re-renders and eliminated unnecessary DOM elements
- **Mobile UX**: Full-height drawer with proper overlay and scroll lock

## [2025-01-27] - Mobile Drawer White Background & Improved Readability

### Changed
- **Drawer Background**: Changed from black background to clean white background for better readability
- **Header Design**: Beautiful green gradient header `from-green-400 via-emerald-500 to-teal-600` with white text
- **Menu Items**: All menu items now use `text-gray-800` on white background with `hover:bg-green-50` effects
- **Borders**: Updated borders to use `border-gray-200` for subtle separation on white background
- **Hover Effects**: Added subtle border effects `hover:border-green-200` and `hover:border-red-200` for better UX

### Improved
- **Readability**: Text is now clearly visible with proper contrast on white background
- **Visual Hierarchy**: Green gradient header creates beautiful visual separation
- **User Experience**: Clean, professional appearance that matches modern mobile app standards
- **Accessibility**: Better color contrast ratios for improved readability

## [2025-01-27] - Mobile Drawer Professional Design Enhancement

### Enhanced
- **Background Visibility**: Added explicit `bg-white` to all drawer sections for guaranteed white background
- **Button Design**: Enhanced menu items with `border border-gray-100`, `rounded-lg`, and `hover:shadow-sm` for professional appearance
- **Spacing**: Increased gap between items from `gap-2` to `gap-3` and padding from `px-3 py-3` to `px-4 py-4` for better touch targets
- **Visual Effects**: Added subtle shadows and border effects with `hover:border-green-300` and `hover:border-red-300`
- **Footer Styling**: Footer now has `bg-gray-50` background for subtle visual separation

### Technical Improvements
- **Border Consistency**: Added `border-l border-gray-200` to drawer container for clear separation from page content
- **Background Layers**: Multiple `bg-white` declarations ensure white background is always visible
- **Transition Effects**: Enhanced transitions with `transition-all duration-200` for smooth animations
- **Shadow Effects**: Added `shadow-sm` to header and `hover:shadow-sm` to buttons for depth

## [2025-01-27] - Mobile Drawer Full Screen Height & Overlay Coverage

### Fixed
- **Full Screen Height**: Changed drawer from `h-full` to `h-screen` to ensure it covers the entire screen height
- **Overlay Coverage**: Overlay now properly covers the entire site with `fixed inset-0 bg-black/60` for complete background dimming
- **Layout Structure**: Added `flex-shrink-0` to header and footer to prevent them from shrinking

### Enhanced
- **Height Management**: Drawer container now uses `h-screen` for guaranteed full screen coverage
- **Content Scrolling**: Added `overflow-y-auto` to menu items section for proper scrolling when content exceeds screen height
- **Footer Positioning**: Footer now stays at bottom with `flex-shrink-0` to maintain consistent layout
- **Visual Separation**: Clear separation between drawer content and site background with proper overlay coverage

## [2025-01-27] - Desktop Admin Button Fix

### Fixed
- **Admin Navigation**: Added clickable admin button in desktop navbar that was missing
- **Button Functionality**: Admin button now properly navigates to `/admin` page when clicked
- **Visual Consistency**: Admin button matches the style of other navbar elements with crown icon and hover effects

### Changed
- **Admin Element**: Replaced static "Admin" tag with interactive button
- **Button Styling**: Added `hover:bg-white/15` effect and proper cursor pointer
- **Icon Integration**: Crown icon now part of the clickable button for better visual hierarchy

## [2025-01-27] - Desktop Navigation Active State

### Added
- **Active Page Detection**: Added `useLocation` hook to detect current page
- **Dynamic Underlining**: Navigation links now show underline based on active page
- **Smart Styling**: Uses `cn()` utility for conditional class application

### Fixed
- **Navigation Feedback**: "Accueil" and "Cours" buttons now properly show active state
- **Visual Consistency**: Active page is clearly indicated with white underline
- **User Experience**: Users can now see which page they're currently on

## [2025-01-27] - Course Edit Modal Thumbnail Management

### Enhanced
- **Thumbnail Display**: EditCourseModal now shows current thumbnail image instead of just URL input
- **Image Upload**: Added file upload functionality with bucket integration for course thumbnails
- **Image Management**: Users can now upload new images, view current images, and delete existing ones
- **Bucket Integration**: Uses Supabase Storage bucket 'course-files' for image management

### Added
- **File Upload Input**: File input with image type restriction and upload state management
- **Current Image Preview**: Displays existing thumbnail with 128x128px preview
- **Delete Functionality**: Red X button to remove current thumbnail
- **Upload Progress**: Spinner indicator during image upload process
- **Error Handling**: Toast notifications for upload success/failure and bucket validation

### Technical
- **State Management**: Added `uploadingImage` state for upload progress tracking
- **Supabase Integration**: Full bucket validation and file upload to `course-thumbnails/` folder
- **File Handling**: Random filename generation with proper extension preservation
- **Toast Integration**: User feedback for all upload operations
- **Debug Logging**: Comprehensive console logging for troubleshooting upload issues

## [2025-01-27] - Enhanced Debug Logging for Image Upload

### Added
- **Detailed Console Logs**: Added comprehensive logging throughout the image upload process
- **Bucket Validation Logs**: Detailed information about bucket existence and configuration
- **File Information Logs**: File details, paths, and upload progress tracking
- **Error Detail Logs**: Complete error information including message, code, details, and hints
- **Upload Progress Logs**: Step-by-step logging of the entire upload workflow

### Enhanced
- **Debug Information**: Both CreateCourse and EditCourseModal now provide detailed debugging
- **Error Tracking**: Better error identification with specific failure points
- **Bucket Diagnostics**: Complete bucket configuration and availability information
- **File Processing**: Detailed file path and naming information for troubleshooting

### Technical
- **Console Logging**: Added emoji-prefixed logs for easy identification in browser console
- **Error Handling**: Enhanced error logging with full error object properties
- **Process Tracking**: Complete workflow logging from file selection to final upload
- **Debug Consistency**: Same logging approach across both upload functions

## [2025-01-27] - Fixed JavaScript Scope Error in Image Upload

### Fixed
- **ReferenceError: buckets is not defined**: Fixed JavaScript scope issue where `buckets` variable was not accessible in catch/finally blocks
- **Variable Declaration**: Moved `buckets` declaration to function scope level for proper access throughout the function
- **Data Assignment**: Properly assigned `bucketsData` to the function-level `buckets` variable

### Technical
- **Scope Management**: Declared `let buckets: any[] = []` at function level
- **Data Flow**: Used `bucketsData` for destructuring and assigned to `buckets` for function-wide access
- **Error Prevention**: Eliminated ReferenceError that was preventing proper error handling and logging

## [2025-01-27] - Course Page Hero Image Display

### Enhanced
- **Hero Section Layout**: Added course thumbnail image to the right side of the hero section
- **Visual Balance**: Course image now displays alongside course information in the green gradient hero
- **Responsive Design**: Image adapts to different screen sizes with proper grid layout

### Added
- **Course Thumbnail Display**: Large 256x256px image in the hero section with rounded corners and shadow
- **Fallback Design**: Elegant placeholder when no thumbnail is available, using BookOpen icon
- **Image Styling**: Rounded corners, shadow effects, and subtle border for professional appearance
- **Overlay Effect**: Subtle gradient overlay on images for better text readability

### Layout
- **Grid Structure**: Changed from 2-column to 3-column layout (lg:grid-cols-3)
- **Information Column**: Course details now span 2 columns (lg:col-span-2)
- **Image Column**: Thumbnail image spans 1 column (lg:col-span-1) on the right
- **Centered Alignment**: Image is centered within its column for optimal visual balance

## [2025-01-27] - Premium Course Access Control & Subscription Management

### Enhanced
- **Premium Course Protection**: Courses marked as premium are now restricted to premium users only
- **Access Control**: Non-premium users see preview but cannot access premium course content
- **Subscription Integration**: Full integration with existing Stripe subscription system
- **User Experience**: Clear messaging and CTAs for premium upgrade

### Added
- **Premium Badge Display**: Visual indicators on premium courses in all interfaces
- **Access Control Logic**: Direct redirection to premium upgrade for restricted content
- **Premium Status Tracking**: New column `is_premium` in profiles table for performance optimization

### Security
- **Course Access Validation**: Automatic verification of premium status before course access
- **Subscription Status Check**: Real-time verification of active premium subscriptions
- **RLS Policies**: Enhanced security with proper access control policies

### Database
- **New Migration**: Added `is_premium` column to profiles table
- **Automatic Updates**: Trigger-based system to keep premium status synchronized
- **Performance Optimization**: Direct column access instead of complex subscription queries
- **Index Creation**: Optimized indexes for premium status queries

### Technical
- **Hook Optimization**: Enhanced `usePremium` hook with profile-based status checking
- **Direct Navigation**: Simplified flow with direct redirection to premium page
- **State Management**: Streamlined handling of premium status across all course components
- **Error Handling**: Efficient error handling for premium access scenarios

## [2025-01-27] - Modern Course Card Design System

### Enhanced
- **Visual Design**: Complete redesign of course cards with modern, professional appearance
- **User Experience**: Improved readability, hover effects, and visual hierarchy
- **Responsive Layout**: Optimized grid system (1/2/3 columns) for mobile/tablet/desktop
- **Accessibility**: Enhanced focus states, semantic structure, and screen reader support

### Added
- **New CourseCard Component**: Modern, reusable card component with consistent design
- **Accent Bar**: Thin green gradient bar at top for brand identity
- **Premium Badge**: Crown icon with orange gradient, positioned top-right
- **Media Tags**: Conditional display of video, audio, document, and image indicators
- **Skeleton Loading**: Placeholder cards during data loading for better UX
- **Hover Effects**: Subtle lift animation and image scaling on desktop

### Design Features
- **Container**: Rounded corners (rounded-2xl), subtle borders, soft shadows
- **Thumbnails**: 16:9 aspect ratio with hover scaling (1.03x) and fallback icons
- **Typography**: Strong hierarchy with line-clamp-2 for title and description
- **Badges**: Category pills with color-coded backgrounds, premium badges with gradients
- **Footer**: Duration display with clock icon, compact "Voir" CTA button

### Technical Implementation
- **Tailwind CSS**: Modern utility-first approach with custom color schemes
- **Responsive Design**: Mobile-first with md: and xl: breakpoints
- **Performance**: Lazy loading images, GPU-friendly transitions, optimized shadows
- **Dark Mode Ready**: Prepared for future dark mode implementation
- **Component Architecture**: Reusable CourseCard and CourseCardSkeleton components

### Bug Fixes & Improvements
- **Fixed Badge Import Error**: Resolved "Badge is not defined" error in Courses.tsx
- **Removed Deprecated References**: Cleaned up unused categoryNames and categoryIcons objects
- **Compact Card Design**: Reduced thumbnail height from h-48 to h-36 for more compact appearance
- **Improved Image Fallback**: Enhanced fallback design with green gradient background and white icon
- **Optimized Spacing**: Reduced padding and margins for more efficient use of space
- **Enhanced Media Tags**: Smaller, more compact media badges with reduced icon sizes
- **Hero Button Contrast**: Changed hero CTA button to white background with green text and accents for better contrast while maintaining green color palette

## [2025-01-27] - Account Deletion System

### Added
- **Account Deletion Feature**: New system to allow users to delete their accounts
- **Soft Delete Implementation**: Accounts are marked as inactive rather than physically deleted
- **Database Migration**: Added `is_valid` column to profiles table with default value TRUE
- **Security Functions**: SQL functions to prevent access to deleted accounts and prevent modifications
- **Delete Account Modal**: Comprehensive confirmation dialog with warnings and text confirmation
- **Profile Integration**: Delete account button added to user profile page in "Zone dangereuse" section
- **Desktop Optimization**: Enhanced delete account button layout for desktop with horizontal alignment and improved visual hierarchy

## [2025-01-27] - User Profile Page Desktop Optimization

### Enhanced
- **Profile Page Layout**: Complete redesign for optimal desktop experience
- **Grid System**: Changed from `lg:grid-cols-3` to `xl:grid-cols-12` for better space utilization
- **Column Organization**: Left column (4/12) for avatar and subscription, right column (8/12) for profile info and actions
- **Card Reorganization**: Logical grouping of related functionality
- **Delete Account Section**: Enhanced with detailed warnings and better desktop layout
- **Responsive Design**: Improved spacing, typography, and button sizing for desktop

### Improved
- **Avatar Card**: Combined avatar display, role information, and selection in one optimized card
- **Profile Information**: Moved to right column with better form layout and spacing
- **Account Actions**: Consolidated dangerous actions in dedicated card with clear visual hierarchy
- **Button Layouts**: Optimized button sizes and spacing for desktop interaction
- **Visual Hierarchy**: Better separation between different functional areas
- **Card Reorganization**: Moved profile information to left column above avatar selection
- **Layout Optimization**: Profile info now appears first in left column for better user flow

## [2025-01-27] - Production Build Optimization & Apache Configuration

### Enhanced
- **Vite Configuration**: Optimized for production deployment at root domain
- **Build Settings**: ES2020 target, CSS splitting enabled, sourcemaps disabled for production
- **Asset Management**: Clean hashed assets under `/assets/` directory
- **Base Path**: Configured for root domain hosting (`base: '/'`)

### Added
- **Apache Configuration**: Complete `.htaccess` file with SPA fallback for React Router
- **Security Headers**: X-Frame-Options, XSS protection, content type sniffing protection
- **Performance Optimization**: Gzip compression and intelligent caching for static assets
- **SPA Fallback**: All routes fallback to `index.html` for client-side routing

### Technical Improvements
- **Build Output**: Clean `dist/` structure with hashed assets
- **Asset Paths**: All assets reference `/assets/` without absolute URLs
- **Production Ready**: No localhost references, optimized for Apache hosting
- **Cache Strategy**: Static assets cached for 1 year, HTML always fresh

## [2025-01-27] - Stripe Customer Portal Integration

### Added
- **Stripe Customer Portal**: Complete integration for subscription management
- **Edge Function**: Secure server-side endpoint `create-portal-link` for portal session creation
- **Customer Management**: Automatic Stripe customer creation if missing
- **Subscription Portal**: Direct access to Stripe billing portal for account management
- **French UI**: All interface text in French as requested

### Enhanced
- **User Profile**: New subscription management section with portal access button
- **Authentication**: Secure token-based portal access with proper user verification
- **Error Handling**: Comprehensive error handling with French error messages
- **Loading States**: Visual feedback during portal opening process

### Technical Implementation
- **Supabase Edge Function**: Server-side portal session creation with Stripe integration
- **Custom Hook**: `useStripePortal` for frontend portal management
- **Security**: JWT token verification and service role key usage
- **Database Integration**: Automatic `stripe_customer_id` management in profiles table
- **CORS Support**: Proper CORS headers for cross-origin requests

### Security Features
- **Server-side Only**: Stripe secret key never exposed to client
- **Token Verification**: JWT authentication required for portal access
- **Service Role**: Uses Supabase service role for secure database operations
- **Input Validation**: Proper request validation and sanitization

### Enhanced
- **Authentication Security**: Enhanced login process to check account validity
- **Account Validation**: Automatic logout and access prevention for deleted accounts
- **User Experience**: Clear warnings and confirmation steps for account deletion

### Technical Implementation
- **Database Schema**: New `is_valid` boolean column with index for performance
- **SQL Functions**: `soft_delete_user_profile()`, `can_user_login()`, and trigger functions
- **Frontend Components**: `DeleteAccountModal` component with comprehensive UI
- **Auth Context**: Enhanced authentication flow with account validity checks
- **Profile Page**: New "Zone dangereuse" section with delete account functionality

### Security Features
- **Soft Delete**: Accounts are marked inactive but data remains for audit purposes
- **Access Prevention**: Deleted accounts cannot log in or access the platform
- **Modification Blocking**: Triggers prevent modification of deleted account data
- **Confirmation Required**: Users must type "SUPPRIMER" to confirm deletion
