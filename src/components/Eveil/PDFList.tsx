import React from 'react';
import { Download, FileText, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PDFFile } from '@/integrations/supabase/types-eveil';
import { useAuth } from '@/contexts/AuthContext';
import { usePremium } from '@/hooks/use-premium';

interface PDFListProps {
  pdfFiles: PDFFile[];
  itemTitle: string;
}

const PDFList: React.FC<PDFListProps> = ({ pdfFiles, itemTitle }) => {
  const { user } = useAuth();
  const { isPremium } = usePremium();

  if (!pdfFiles || pdfFiles.length === 0) {
    return null;
  }

  const handleDownload = (pdf: PDFFile) => {
    // Créer un lien temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = pdf.url;
    link.download = pdf.original_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          📚 Documents disponibles
        </h3>
        <p className="text-gray-600">
          Téléchargez les ressources pour {itemTitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pdfFiles.map((pdf) => {
          const canAccess = !pdf.is_premium || isPremium;
          
          return (
            <Card 
              key={pdf.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                canAccess 
                  ? 'hover:scale-105 border-green-200 hover:border-green-300' 
                  : 'border-gray-200 opacity-75'
              }`}
            >
              {/* Badge Premium */}
              {pdf.is_premium && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}

              {/* Badge Accès */}
              {!canAccess && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200">
                    <Lock className="w-3 h-3 mr-1" />
                    Accès limité
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                      {pdf.original_name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Ajouté le {formatDate(pdf.uploaded_at)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Informations du fichier */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>{formatFileSize(pdf.size)}</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      PDF
                    </span>
                  </div>

                  {/* Bouton d'action */}
                  {canAccess ? (
                    <Button
                      onClick={() => handleDownload(pdf)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      size="lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm text-amber-800 font-medium">
                          🔒 Contenu Premium
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Passez au Premium pour accéder à tous les documents
                        </p>
                      </div>
                      <Button
                        onClick={() => window.location.href = '/pricing'}
                        variant="outline"
                        className="w-full border-amber-500 text-amber-700 hover:bg-amber-50"
                        size="lg"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Découvrir Premium
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Effet de brillance pour les PDFs accessibles */}
              {canAccess && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              )}
            </Card>
          );
        })}
      </div>

      {/* Message d'encouragement */}
      {pdfFiles.some(pdf => pdf.is_premium) && !isPremium && (
        <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">
            🚀 Débloquez tout le contenu Premium !
          </h4>
          <p className="text-blue-700 mb-4">
            Accédez à tous les documents et ressources exclusives pour enrichir l'apprentissage
          </p>
          <Button
            onClick={() => window.location.href = '/pricing'}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            Voir les offres Premium
          </Button>
        </div>
      )}
    </div>
  );
};

export default PDFList;
