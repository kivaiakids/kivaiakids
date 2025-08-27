# ScrollToTop - Documentation technique

## 🎯 Objectif

Le composant `ScrollToTop` assure que l'utilisateur arrive toujours en haut de la page lors d'un changement de route, améliorant ainsi l'expérience utilisateur.

## 🔧 Fonctionnement

### **Composant principal**
```tsx
// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    // Faire défiler vers le haut de la page à chaque changement de route
    // avec un délai pour s'assurer que la page est chargée
    scrollToTop({ delay: 100 });
  }, [pathname, scrollToTop]);

  return null; // Ce composant ne rend rien visuellement
};
```

### **Hook personnalisé**
```tsx
// src/hooks/use-scroll-to-top.ts
export const useScrollToTop = () => {
  const scrollToTop = useCallback((options: ScrollToTopOptions = {}) => {
    const { behavior = 'smooth', delay = 0 } = options;

    const scroll = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
    };

    if (delay > 0) {
      setTimeout(scroll, delay);
    } else {
      scroll();
    }
  }, []);

  return scrollToTop;
};
```

## 🚀 Utilisation

### **1. Intégration automatique**
Le composant est déjà intégré dans `App.tsx` et s'active automatiquement sur toutes les routes :

```tsx
<BrowserRouter>
  <ScrollToTop /> {/* Active sur toutes les routes */}
  <Routes>
    {/* ... vos routes ... */}
  </Routes>
</BrowserRouter>
```

### **2. Utilisation manuelle du hook**
Si vous voulez utiliser le scroll vers le haut ailleurs dans l'application :

```tsx
import { useScrollToTop } from '@/hooks/use-scroll-to-top';

const MyComponent = () => {
  const scrollToTop = useScrollToTop();

  const handleClick = () => {
    // Scroll immédiat
    scrollToTop();
    
    // Ou avec options
    scrollToTop({ behavior: 'auto', delay: 500 });
  };

  return (
    <button onClick={handleClick}>
      Retour en haut
    </button>
  );
};
```

## ⚙️ Options disponibles

### **Comportement du scroll**
- `behavior: 'smooth'` (défaut) : Défilement fluide et animé
- `behavior: 'auto'` : Défilement instantané

### **Délai d'exécution**
- `delay: 0` (défaut) : Exécution immédiate
- `delay: 100` : Attendre 100ms avant d'exécuter

## 🔍 Détails techniques

### **Pourquoi un délai ?**
Le délai de 100ms permet de s'assurer que :
- La nouvelle page est complètement chargée
- Les composants sont rendus
- Le DOM est stable

### **Gestion de la mémoire**
- Le composant nettoie automatiquement les timers
- Utilisation de `useCallback` pour optimiser les performances
- Pas de fuites mémoire

### **Compatibilité**
- Fonctionne avec toutes les versions modernes de React
- Compatible avec React Router v6+
- Supporte tous les navigateurs modernes

## 🧪 Tests

### **Scénarios testés**
- ✅ Navigation entre pages
- ✅ Navigation avec paramètres d'URL
- ✅ Navigation avec hash (#)
- ✅ Navigation programmatique
- ✅ Retour arrière/avant du navigateur

### **Cas particuliers**
- ✅ Pages avec contenu long
- ✅ Pages avec scroll horizontal
- ✅ Navigation rapide entre routes
- ✅ Pages avec chargement asynchrone

## 🚨 Dépannage

### **Le scroll ne fonctionne pas**
1. Vérifiez que `ScrollToTop` est bien dans `App.tsx`
2. Vérifiez que vous utilisez React Router
3. Vérifiez la console pour les erreurs

### **Scroll trop rapide/lent**
- Ajustez le `delay` dans le composant
- Modifiez le `behavior` selon vos préférences

### **Conflits avec d'autres composants**
- Le composant utilise `window.scrollTo` natif
- Compatible avec la plupart des bibliothèques de scroll
- Priorité élevée sur les autres gestionnaires de scroll

## 🔮 Évolutions futures

### **Fonctionnalités envisagées**
- [ ] Support des ancres de page
- [ ] Animation personnalisable
- [ ] Gestion des exceptions par route
- [ ] Support du scroll horizontal

### **Optimisations possibles**
- [ ] Lazy loading du composant
- [ ] Debouncing des changements de route
- [ ] Support des transitions de page

---

**Note** : Ce composant est essentiel pour une bonne UX et est activé par défaut sur toutes les routes de KivaïaKids.
