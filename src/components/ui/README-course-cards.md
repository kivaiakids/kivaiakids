# 🎯 Cartes de Cours Modernes - KivaïaKids

## 📋 Vue d'ensemble

Ce système de cartes de cours modernes remplace l'ancien design avec un nouveau composant `CourseCard` plus professionnel, accessible et responsive.

## 🚀 Composants disponibles

### `CourseCard`
Carte principale pour afficher les informations d'un cours.

### `CourseCardSkeleton`
Placeholder animé pendant le chargement des données.

### `CourseCardDemo`
Page de démonstration avec des exemples et la liste des fonctionnalités.

## 💻 Utilisation

### Import basique
```tsx
import CourseCard from '@/components/ui/course-card';
import CourseCardSkeleton from '@/components/ui/course-card-skeleton';
```

### Utilisation simple
```tsx
<CourseCard
  course={courseData}
  onClick={() => handleCourseClick(course.id)}
/>
```

### Grille responsive
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {courses.map((course) => (
    <CourseCard
      key={course.id}
      course={course}
      onClick={() => handleCourseClick(course.id)}
    />
  ))}
</div>
```

### Skeleton loading
```tsx
{coursesLoading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <CourseCardSkeleton key={index} />
    ))}
  </div>
) : (
  // Affichage des vraies cartes
)}
```

## 📊 Structure des données

Le composant `CourseCard` attend un objet `course` avec cette structure :

```typescript
interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  is_premium: boolean;
  thumbnail_url?: string;
  video_url?: string;
  audio_url?: string;
  file_url?: string;
  duration_minutes?: number;
}
```

## 🎨 Fonctionnalités visuelles

### Design moderne
- **Container** : `rounded-2xl`, bordures subtiles, ombres douces
- **Accent bar** : Barre verte gradient 2-3px en haut
- **Hover effects** : Léger soulèvement + ombres plus fortes

### Thumbnails
- **Ratio 16:9** : `h-48` avec `object-cover`
- **Hover scaling** : `scale-105` sur desktop
- **Fallback** : Icône Play centrée si pas d'image
- **Lazy loading** : `loading="lazy"` pour les performances

### Badges et indicateurs
- **Premium** : Badge orange gradient avec couronne (top-right)
- **Catégorie** : Pill colorée selon la catégorie
- **Media tags** : Affichage conditionnel (Vidéo, Audio, Document, Image)

### Typographie
- **Titre** : `text-lg md:text-xl`, `font-bold`, `line-clamp-2`
- **Description** : `text-sm md:text-base`, `line-clamp-2`
- **Hierarchie** : Titre > Description avec espacement équilibré

### Footer
- **Gauche** : Durée avec icône horloge
- **Droite** : CTA "Voir" compact en pill vert

## 📱 Responsive Design

### Grille
- **Mobile** : `grid-cols-1` (1 colonne)
- **Tablet** : `md:grid-cols-2` (2 colonnes)
- **Desktop** : `lg:grid-cols-3` (3 colonnes)

### Typographie
- **Mobile** : Tailles réduites pour la lisibilité
- **Desktop** : Tailles plus grandes pour l'impact

### Hover effects
- **Mobile** : Désactivés (pas de hover sur touch)
- **Desktop** : Actifs avec scaling et ombres

## ♿ Accessibilité

### Sémantique
- **Titre** : Rendu en `h3` pour la hiérarchie
- **Structure** : Logique et prévisible
- **Navigation** : Clavier accessible

### Focus
- **Bouton CTA** : Focus ring visible
- **Contraste** : ≥ 4.5:1 pour tous les textes
- **Taille cible** : Boutons ≥ 44×44px

### Screen readers
- **Badge Premium** : Texte "Premium" accessible
- **Icônes** : `aria-hidden` sauf si significatives
- **Alt text** : Images avec descriptions appropriées

## 🔧 Personnalisation

### Classes CSS
Le composant utilise Tailwind CSS avec des classes personnalisables via la prop `className`.

### Couleurs des catégories
Les couleurs sont définies dans le composant et peuvent être modifiées dans `categoryColors`.

### Thème
Préparé pour le mode sombre avec des variables CSS appropriées.

## 📈 Performance

### Optimisations
- **Lazy loading** : Images chargées à la demande
- **Transitions GPU** : Animations fluides et performantes
- **Ombres optimisées** : Pas d'ombres lourdes
- **Skeleton loading** : Feedback visuel immédiat

### Bundle size
- **Composants** : Légers et tree-shakeable
- **Dépendances** : Minimales (seulement Tailwind + Lucide)
- **Code splitting** : Prêt pour le lazy loading

## 🚨 Dépannage

### Erreurs communes
1. **Props manquantes** : Vérifiez que `course` et `onClick` sont fournis
2. **Types TypeScript** : Assurez-vous que l'interface `Course` est respectée
3. **Images cassées** : Vérifiez les URLs des thumbnails

### Debug
- **Console** : Logs détaillés pour le développement
- **Props** : Vérifiez les données passées au composant
- **CSS** : Inspectez les classes Tailwind appliquées

## 🔄 Migration depuis l'ancien système

### Ancien code
```tsx
<Card className="hover:shadow-lg transition-all hover:scale-105">
  <CardHeader>
    {/* Ancienne structure complexe */}
  </CardHeader>
  <CardContent>
    {/* Ancien contenu */}
  </CardContent>
</Card>
```

### Nouveau code
```tsx
<CourseCard
  course={courseData}
  onClick={() => handleCourseClick(course.id)}
/>
```

### Avantages
- **Code plus propre** : Moins de JSX répétitif
- **Maintenance** : Un seul composant à maintenir
- **Consistance** : Design uniforme partout
- **Performance** : Optimisations intégrées

## 📚 Exemples complets

Voir `CourseCardDemo.tsx` pour des exemples d'utilisation et des démonstrations visuelles.

## 🤝 Contribution

Pour modifier les cartes :
1. Éditez `CourseCard.tsx` pour les changements principaux
2. Mettez à jour `CourseCardSkeleton.tsx` si nécessaire
3. Testez avec `CourseCardDemo.tsx`
4. Vérifiez la compilation avec `npm run build`
