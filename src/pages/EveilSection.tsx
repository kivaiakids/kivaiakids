import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import CardEveil from '@/components/Eveil/CardEveil';
import EveilSkeleton from '@/components/Eveil/EveilSkeleton';
import TagFilter from '@/components/Eveil/TagFilter';
import { getEveilItemsBySection } from '@/integrations/supabase/eveil-helpers';
import { EveilItem, EveilSection, EVEIL_SECTIONS } from '@/integrations/supabase/types-eveil';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EveilSection = () => {
  const { section: sectionSlug } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<EveilItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<EveilItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Trouver la section correspondante
  const sectionInfo = EVEIL_SECTIONS.find(s => s.slug === sectionSlug);
  
  if (!sectionInfo) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Section non trouvée</h1>
            <Button onClick={() => navigate('/eveil-aux-langues')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'éveil aux langues
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Extraire tous les tags disponibles
  const availableTags = React.useMemo(() => {
    const tags = new Set<string>();
    items.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [items]);

  // Filtrer les items selon les tags sélectionnés
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => 
        item.tags && item.tags.some(tag => selectedTags.includes(tag))
      );
      setFilteredItems(filtered);
    }
  }, [items, selectedTags]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEveilItemsBySection(sectionInfo.section);
        setItems(data);
      } catch (err) {
        console.error('Erreur lors du chargement des items:', err);
        setError('Impossible de charger les activités. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [sectionInfo.section]);

  // Plus besoin de handleItemClick car la navigation se fait dans CardEveil

  return (
    <Layout>
      <Helmet>
        <title>{sectionInfo.title} — Éveil aux langues — Kivaia</title>
        <meta 
          name="description" 
          content={sectionInfo.subtitle} 
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Header */}
        <section className="px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/eveil-aux-langues')}
                className="text-emerald-600 hover:text-emerald-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Éveil aux langues
              </Button>
            </nav>

            {/* Section Header */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">{sectionInfo.icon}</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                {sectionInfo.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                {sectionInfo.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-4 sm:px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <EveilSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Réessayer
                </Button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune activité disponible
                </h3>
                <p className="text-gray-600">
                  De nouvelles activités seront bientôt ajoutées à cette section.
                </p>
              </div>
            ) : (
              <>
                {/* Filtre par tags */}
                {availableTags.length > 0 && (
                  <div className="mb-8">
                    <TagFilter
                      availableTags={availableTags}
                      selectedTags={selectedTags}
                      onTagsChange={setSelectedTags}
                      title={`Filtrer par tags - ${sectionInfo.title}`}
                    />
                  </div>
                )}

                {/* Stats */}
                <div className="mb-8 text-center">
                  <p className="text-gray-600">
                    {filteredItems.length} activité{filteredItems.length > 1 ? 's' : ''} disponible{filteredItems.length > 1 ? 's' : ''}
                    {selectedTags.length > 0 && (
                      <span className="text-emerald-600 font-medium">
                        {' '}avec les tags sélectionnés
                      </span>
                    )}
                  </p>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <CardEveil
                      key={item.id}
                      item={item}
                    />
                  ))}
                </div>

                {/* Message si aucun résultat */}
                {filteredItems.length === 0 && selectedTags.length > 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucune activité trouvée
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Aucune activité ne correspond aux tags sélectionnés.
                    </p>
                    <Button 
                      onClick={() => setSelectedTags([])}
                      variant="outline"
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    >
                      Effacer les filtres
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default EveilSection;
