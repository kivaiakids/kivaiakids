import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Plus,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadEveilPDF, deleteEveilPDF } from '@/integrations/supabase/eveil-helpers';
import { PDFFile } from '@/integrations/supabase/types-eveil';

interface PDFUploadProps {
  itemId: string;
  pdfFiles: PDFFile[];
  onPDFsChange: (pdfs: PDFFile[]) => void;
  isPremium: boolean;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ 
  itemId, 
  pdfFiles, 
  onPDFsChange, 
  isPremium 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (file.type !== 'application/pdf') {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner un fichier PDF.",
        variant: "destructive",
      });
      return;
    }

    // Vérifier la taille (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 10MB.",
        variant: "destructive",
      });
      return;
    }

    await uploadPDF(file);
  };

  const uploadPDF = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simuler un progrès d'upload
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload réel vers Supabase
      const newPDF = await uploadEveilPDF(itemId, file, isPremium);
      
      clearInterval(uploadInterval);
      setUploadProgress(100);

      // Ajouter à la liste
      const updatedPDFs = [...pdfFiles, newPDF];
      onPDFsChange(updatedPDFs);

      toast({
        title: "PDF uploadé avec succès",
        description: `${file.name} a été ajouté à cet item.`,
      });

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast({
        title: "Erreur lors de l'upload",
        description: error instanceof Error ? error.message : "Impossible d'uploader le fichier. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePDF = async (pdfId: string, filename: string) => {
    try {
      // Supprimer du storage Supabase
      await deleteEveilPDF(itemId, filename);
      
      // Supprimer de la liste locale
      const updatedPDFs = pdfFiles.filter(pdf => pdf.id !== pdfId);
      onPDFsChange(updatedPDFs);
      
      toast({
        title: "PDF supprimé",
        description: "Le fichier a été retiré de cet item.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur lors de la suppression",
        description: "Impossible de supprimer le fichier. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const togglePremium = (pdfId: string) => {
    const updatedPDFs = pdfFiles.map(pdf => 
      pdf.id === pdfId ? { ...pdf, is_premium: !pdf.is_premium } : pdf
    );
    onPDFsChange(updatedPDFs);
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
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Gestion des PDFs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <Label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="text-lg font-medium text-gray-700 mb-2">
              Cliquez pour sélectionner un PDF
            </div>
            <div className="text-sm text-gray-500 mb-4">
              ou glissez-déposez le fichier ici
            </div>
            <Button 
              type="button" 
              variant="outline"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? 'Upload en cours...' : 'Sélectionner un PDF'}
            </Button>
          </Label>
          <Input
            ref={fileInputRef}
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Upload en cours... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* PDFs List */}
        {pdfFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">PDFs uploadés ({pdfFiles.length})</h4>
            {pdfFiles.map((pdf) => (
              <div 
                key={pdf.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white">
                    <FileText className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 truncate">
                      {pdf.original_name}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-4">
                      <span>{formatFileSize(pdf.size)}</span>
                      <span>•</span>
                      <span>Ajouté le {formatDate(pdf.uploaded_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Premium Toggle */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={pdf.is_premium}
                      onCheckedChange={() => togglePremium(pdf.id)}
                    />
                    <span className="text-sm text-gray-600">Premium</span>
                  </div>

                  {/* Premium Badge */}
                  {pdf.is_premium && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Premium
                    </Badge>
                  )}

                  {/* Download Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(pdf.url, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>

                  {/* Delete Button */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePDF(pdf.id, pdf.filename)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">À propos des PDFs :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Les PDFs gratuits sont accessibles à tous</li>
                <li>Les PDFs premium nécessitent un abonnement</li>
                <li>Cliquez sur "Télécharger" pour accéder au fichier</li>
                <li>Formats supportés : PDF uniquement</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFUpload;
