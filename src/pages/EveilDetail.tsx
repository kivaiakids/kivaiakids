import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Play, 
  Headphones, 
  Eye,
  Crown,
  Lock,
  Loader2
} from 'lucide-react';
import { getEveilItemBySlug } from '@/integrations/supabase/eveil-helpers';
import { EveilItem, MediaItem, EVEIL_SECTIONS } from '@/integrations/supabase/types-eveil';
import { useAuth } from '@/contexts/AuthContext';
import MediaBadge from '@/components/Eveil/MediaBadge';
import PDFList from '@/components/Eveil/PDFList';

const EveilDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [item, setItem] = useState<EveilItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItem = async () => {
      if (!slug) {
        setError('Identifiant d\'activité manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getEveilItemBySlug(slug);
        
        if (!data) {
          setError('Activité non trouvée');
          return;
        }

        setItem(data);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'activité:', err);
        setError('Impossible de charger l\'activité');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600">Chargement de l'activité...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Activité non trouvée'}
            </h1>
            <Button onClick={() => navigate('/eveil-aux-langues')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'éveil aux langues
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isPremium = item.is_premium;
  const hasAccess = !isPremium || (user && profile?.is_premium);
  
  // Si pas d'accès et contenu premium, rediriger vers pricing
  if (isPremium && !hasAccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 rounded-full mb-6">
                  <Crown className="w-12 h-12 text-yellow-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Contenu Premium
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Cette activité est réservée aux membres Premium. 
                  Découvrez tous nos contenus exclusifs !
                </p>
              </div>

              <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-yellow-600" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{item.subtitle}</p>
                  
                  <div className="space-y-4">
                    <Button 
                      onClick={() => navigate('/pricing')}
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Passer au Premium
                    </Button>
                    
                    <Button 
                      onClick={() => navigate(-1)}
                      variant="outline"
                      className="w-full"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const getSectionInfo = () => {
    return EVEIL_SECTIONS.find(s => s.section === item.section);
  };

  const sectionInfo = getSectionInfo();

  const handleMediaAction = (media: MediaItem) => {
    switch (media.type) {
      case 'pdf':
      case 'image':
        window.open(media.url, '_blank');
        break;
      case 'audio':
      case 'video':
        // Pour l'instant, on ouvre dans un nouvel onglet
        // Plus tard, on pourra intégrer un player
        window.open(media.url, '_blank');
        break;
      default:
        window.open(media.url, '_blank');
    }
  };

  const getMediaActionText = (type: string) => {
    switch (type) {
      case 'pdf': return 'Télécharger';
      case 'image': return 'Voir l\'image';
      case 'audio': return 'Écouter';
      case 'video': return 'Regarder';
      default: return 'Ouvrir';
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'pdf': return Download;
      case 'image': return Eye;
      case 'audio': return Headphones;
      case 'video': return Play;
      default: return ExternalLink;
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{item.title} — {sectionInfo?.title} — Éveil aux langues — Kivaia</title>
        <meta 
          name="description" 
          content={item.subtitle || `Activité d'éveil aux langues: ${item.title}`} 
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Navigation */}
          <nav className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-emerald-600 hover:text-emerald-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {sectionInfo && (
                <span className="text-3xl">{sectionInfo.icon}</span>
              )}
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                  {item.title}
                </h1>
                {sectionInfo && (
                  <p className="text-emerald-600 font-medium mt-1">
                    {sectionInfo.title}
                  </p>
                )}
              </div>
            </div>

            {item.subtitle && (
              <p className="text-xl text-gray-700 leading-relaxed mb-4">
                {item.subtitle}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {isPremium && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              
              {item.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-gray-50">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div className="space-y-6">
            {/* Médias */}
            {item.media.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Médias et ressources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {item.media.map((media, index) => {
                      const IconComponent = getMediaIcon(media.type);
                      return (
                        <div 
                          key={index}
                          className="border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden"
                        >
                          {/* Mobile-first layout */}
                          <div className="p-4">
                            {/* Header avec icône et type */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-lg bg-white shadow-sm">
                                <IconComponent className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <MediaBadge type={media.type} />
                              </div>
                            </div>

                            {/* Contenu principal */}
                            <div className="space-y-2">
                              {media.caption && (
                                <h4 className="font-medium text-gray-900 text-sm leading-tight">
                                  {media.caption}
                                </h4>
                              )}
                              <p className="text-sm text-gray-600">
                                {getMediaActionText(media.type)}
                              </p>
                            </div>

                            {/* Bouton d'action - pleine largeur sur mobile */}
                            <div className="mt-4">
                              <Button
                                onClick={() => handleMediaAction(media)}
                                className="w-full sm:w-auto"
                                size="sm"
                              >
                                <IconComponent className="w-4 h-4 mr-2" />
                                {getMediaActionText(media.type)}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PDFs */}
            {item.pdf_files && item.pdf_files.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <PDFList 
                    pdfFiles={item.pdf_files} 
                    itemTitle={item.title}
                  />
                </CardContent>
              </Card>
            )}

            {/* Informations */}
            <Card>
              <CardHeader>
                <CardTitle>À propos de cette activité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Section</h4>
                    <p className="text-gray-600">
                      {sectionInfo?.icon} {sectionInfo?.title}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Type d'accès</h4>
                    <p className="text-gray-600">
                      {isPremium ? 'Premium' : 'Gratuit'}
                    </p>
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ressources disponibles</h4>
                    <p className="text-gray-600">
                      {item.media.length} média{item.media.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate(-1)}
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              
              <Button 
                onClick={() => {
                  const sectionSlug = sectionInfo?.slug;
                  if (sectionSlug) {
                    navigate(`/eveil-aux-langues/${sectionSlug}`);
                  } else {
                    navigate('/eveil-aux-langues');
                  }
                }}
              >
                Voir plus d'activités
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default EveilDetail;
