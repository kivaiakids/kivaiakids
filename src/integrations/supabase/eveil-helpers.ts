import { supabase } from './client';
import { EveilItem, EveilSection } from './types-eveil';

export interface GetEveilItemsOptions {
  includeUnpublished?: boolean;
  limit?: number;
}

/**
 * Récupère les items d'éveil pour une section donnée
 */
export async function getEveilItemsBySection(
  section: EveilSection, 
  options: GetEveilItemsOptions = {}
): Promise<EveilItem[]> {
  const { includeUnpublished = false, limit = 50 } = options;
  
  let query = supabase
    .from('eveil_items')
    .select('*')
    .eq('section', section)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });

  if (!includeUnpublished) {
    query = query.eq('is_published', true);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erreur lors de la récupération des items d\'éveil:', error);
    throw new Error(`Impossible de récupérer les items d'éveil: ${error.message}`);
  }

  return data || [];
}

/**
 * Récupère un item d'éveil par son ID
 */
export async function getEveilItemById(id: string): Promise<EveilItem | null> {
  const { data, error } = await supabase
    .from('eveil_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Aucun résultat trouvé
    }
    console.error('Erreur lors de la récupération de l\'item d\'éveil:', error);
    throw new Error(`Impossible de récupérer l'item d'éveil: ${error.message}`);
  }

  return data;
}

/**
 * Récupère un item d'éveil par son slug
 */
export async function getEveilItemBySlug(slug: string): Promise<EveilItem | null> {
  const { data, error } = await supabase
    .from('eveil_items')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Aucun résultat trouvé
    }
    console.error('Erreur lors de la récupération de l\'item d\'éveil:', error);
    throw new Error(`Impossible de récupérer l'item d'éveil: ${error.message}`);
  }

  return data;
}

/**
 * Crée ou met à jour un item d'éveil
 */
export async function upsertEveilItem(
  item: Partial<EveilItem> & { section: EveilSection; title: string }
): Promise<EveilItem> {
  // Générer un slug si non fourni
  if (!item.slug) {
    item.slug = generateSlug(item.title);
  }

  const { data, error } = await supabase
    .from('eveil_items')
    .upsert(item, { 
      onConflict: 'id',
      ignoreDuplicates: false 
    })
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la sauvegarde de l\'item d\'éveil:', error);
    throw new Error(`Impossible de sauvegarder l'item d'éveil: ${error.message}`);
  }

  return data;
}

/**
 * Supprime un item d'éveil
 */
export async function deleteEveilItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('eveil_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la suppression de l\'item d\'éveil:', error);
    throw new Error(`Impossible de supprimer l'item d'éveil: ${error.message}`);
  }
}

/**
 * Met à jour le statut de publication d'un item
 */
export async function toggleEveilItemPublish(id: string, isPublished: boolean): Promise<void> {
  const { error } = await supabase
    .from('eveil_items')
    .update({ is_published: isPublished })
    .eq('id', id);

  if (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw new Error(`Impossible de mettre à jour le statut: ${error.message}`);
  }
}

/**
 * Met à jour l'ordre des items
 */
export async function updateEveilItemOrder(items: { id: string; order_index: number }[]): Promise<void> {
  const updates = items.map(item => ({
    id: item.id,
    order_index: item.order_index
  }));

  const { error } = await supabase
    .from('eveil_items')
    .upsert(updates, { onConflict: 'id' });

  if (error) {
    console.error('Erreur lors de la mise à jour de l\'ordre:', error);
    throw new Error(`Impossible de mettre à jour l'ordre: ${error.message}`);
  }
}

/**
 * Génère un slug à partir d'un titre
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garde seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .trim();
}

/**
 * Récupère tous les items d'éveil (pour l'admin)
 */
export async function getAllEveilItems(): Promise<EveilItem[]> {
  const { data, error } = await supabase
    .from('eveil_items')
    .select('*')
    .order('section', { ascending: true })
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération de tous les items:', error);
    throw new Error(`Impossible de récupérer tous les items: ${error.message}`);
  }

  return data || [];
}
