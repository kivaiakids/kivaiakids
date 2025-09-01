// Types pour "Éveil aux langues"
export type EveilSection = 
  | 'ateliers_interactifs'
  | 'jeux_interactifs'
  | 'activites_creatives'
  | 'comptines_et_sons_du_monde'
  | 'videos_culturelles'
  | 'histoires_du_monde';

export type MediaType = 'image' | 'audio' | 'video' | 'pdf';

export interface MediaItem {
  type: MediaType;
  url: string;
  poster?: string; // Pour les vidéos
  caption?: string;
}

export interface EveilItem {
  id: string;
  section: EveilSection;
  slug: string;
  title: string;
  subtitle?: string;
  media: MediaItem[];
  pdf_files: PDFFile[];
  tags?: string[];
  is_premium: boolean;
  is_published: boolean;
  order_index: number;
  author_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PDFFile {
  id: string;
  filename: string;
  original_name: string;
  size: number;
  url: string;
  uploaded_at: string;
  is_premium: boolean;
}

export interface EveilSectionInfo {
  section: EveilSection;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  href: string;
}

// Configuration des sections
export const EVEIL_SECTIONS: EveilSectionInfo[] = [
  {
    section: 'ateliers_interactifs',
    slug: 'ateliers-interactifs',
    title: 'Ateliers Interactifs',
    subtitle: 'Une histoire + une comptine + un bricolage + un guide pédagogique',
    icon: '🎨',
    href: '/eveil-aux-langues/ateliers-interactifs'
  },
  {
    section: 'jeux_interactifs',
    slug: 'jeux-interactifs',
    title: 'Jeux Interactifs',
    subtitle: 'Devine, associe, écoute, joue avec les langues et les sons.',
    icon: '🎮',
    href: '/eveil-aux-langues/jeux-interactifs'
  },
  {
    section: 'activites_creatives',
    slug: 'activites-creatives',
    title: 'Activités Créatives',
    subtitle: 'DIY, dessins guidés, collages, créations inspirées des cultures.',
    icon: '✂️',
    href: '/eveil-aux-langues/activites-creatives'
  },
  {
    section: 'comptines_et_sons_du_monde',
    slug: 'comptines-et-sons-du-monde',
    title: 'Comptines et Sons du Monde',
    subtitle: 'Écoute des langues vivantes, des accents, des chants traditionnels.',
    icon: '🎵',
    href: '/eveil-aux-langues/comptines-et-sons-du-monde'
  },
  {
    section: 'videos_culturelles',
    slug: 'videos-culturelles',
    title: 'Vidéos Culturelles',
    subtitle: 'Pour découvrir les gestes, les fêtes, les paysages du monde.',
    icon: '🎬',
    href: '/eveil-aux-langues/videos-culturelles'
  },
  {
    section: 'histoires_du_monde',
    slug: 'histoires-du-monde',
    title: 'Histoires du Monde',
    subtitle: 'Contes audio avec fiches d\'activités associées.',
    icon: '📚',
    href: '/eveil-aux-langues/histoires-du-monde'
  }
];
