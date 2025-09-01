import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import CardEveil from '@/components/Eveil/CardEveil';
import EveilSkeleton from '@/components/Eveil/EveilSkeleton';
import TagFilter from '@/components/Eveil/TagFilter';
import { getEveilItemsBySection } from '@/integrations/supabase/eveil-helpers';
import { EveilItem, EveilSection, EVEIL_SECTIONS, AgeRange } from '@/integrations/supabase/types-eveil';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Filter, Baby, Users, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EveilSection = () => {
  const { section: sectionSlug } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<EveilItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<EveilItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<AgeRange[]>([]);

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

  // Options de tranches d'âge avec icônes mignonnes (même design que Courses)
  const ageRangeOptions: { value: AgeRange; label: string; icon: React.ReactNode; emoji: string }[] = [
    { value: '12-18_months', label: '12-18 mois', icon: <Baby className="w-4 h-4" />, emoji: '👶' },
    { value: '2_years', label: '2 ans', icon: <Baby className="w-4 h-4" />, emoji: '🧸' },
    { value: '3_years', label: '3 ans', icon: <GraduationCap className="w-4 h-4" />, emoji: '🎨' },
    { value: 'up_to_12_years', label: 'Jusqu\'à 12 ans', icon: <Users className="w-4 h-4" />, emoji: '🌟' }
  ];

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

  // Extraire toutes les tranches d'âge disponibles
  const availableAgeRanges = React.useMemo(() => {
    const ageRanges = new Set<AgeRange>();
    items.forEach(item => {
      ageRanges.add(item.age_range);
    });
    return Array.from(ageRanges).sort();
  }, [items]);

  // Filtrer les items selon les tags et tranches d'âge sélectionnés
  useEffect(() => {
    let filtered = items;

    // Filtrage par tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item => 
        item.tags && item.tags.some(tag => selectedTags.includes(tag))
      );
    }

    // Filtrage par tranches d'âge
    if (selectedAgeRanges.length > 0) {
      filtered = filtered.filter(item => 
        selectedAgeRanges.includes(item.age_range)
      );
    }

    setFilteredItems(filtered);
  }, [items, selectedTags, selectedAgeRanges]);

  const handleAgeRangeToggle = (ageRange: AgeRange) => {
    setSelectedAgeRanges(prev => 
      prev.includes(ageRange)
        ? prev.filter(ar => ar !== ageRange)
        : [...prev, ageRange]
    );
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedAgeRanges([]);
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedAgeRanges.length > 0;

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
                {/* Filtres */}
                <div className="bg-white rounded-xl p-6 mb-8 shadow-lg border border-gray-200">
                  {/* Bouton effacer les filtres */}
                  {hasActiveFilters && (
                    <div className="flex justify-end mb-4">
                      <Button
                        onClick={clearAllFilters}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50"
                      >
                        Effacer tous les filtres
                      </Button>
                    </div>
                  )}

                  {/* Filtre par tranches d'âge - Même design que Courses */}
                  {availableAgeRanges.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Filter className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-700">Filtrer par âge</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ageRangeOptions.map((option) => {
                          const isSelected = selectedAgeRanges.includes(option.value);
                          return (
                            <button
                              key={option.value}
                              onClick={() => handleAgeRangeToggle(option.value)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md scale-105'
                                  : 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 hover:scale-105'
                              }`}
                            >
                              <span className="text-base">{option.emoji}</span>
                              <span>{option.label}</span>
                              {isSelected && (
                                <span className="ml-1 text-emerald-100">✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Filtre par tags */}
                  {availableTags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Filter className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-700">Choisir une langue</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => {
                          const isSelected = selectedTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedTags(prev => prev.filter(t => t !== tag));
                                } else {
                                  setSelectedTags(prev => [...prev, tag]);
                                }
                              }}
                              className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md scale-105'
                                  : 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 hover:scale-105'
                              }`}
                            >
                              {tag}
                              {isSelected && (
                                <span className="ml-1 text-emerald-100">✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mb-8 text-center">
                  <p className="text-gray-600">
                    {filteredItems.length} activité{filteredItems.length > 1 ? 's' : ''} disponible{filteredItems.length > 1 ? 's' : ''}
                    {hasActiveFilters && (
                      <span className="text-emerald-600 font-medium">
                        {' '}avec les filtres sélectionnés
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
                {filteredItems.length === 0 && hasActiveFilters && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucune activité trouvée
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Aucune activité ne correspond aux filtres sélectionnés.
                    </p>
                    <Button 
                      onClick={clearAllFilters}
                      variant="outline"
                      className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                    >
                      Effacer tous les filtres
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
