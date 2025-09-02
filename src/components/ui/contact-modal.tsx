import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:Contact@kivaiakids.fr';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            Contactez-nous
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Message d'accueil */}
          <div className="text-center">
            <p className="text-gray-600 leading-relaxed">
              Nous sommes là pour vous accompagner dans votre aventure linguistique ! 
              N'hésitez pas à nous écrire pour toute question.
            </p>
          </div>

          {/* Options de contact */}
          <div className="space-y-4">
            {/* Email principal */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email de support</h3>
                  <p className="text-sm text-gray-600">Réponse sous 24h</p>
                </div>
              </div>
              <Button 
                onClick={handleEmailClick}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact@kivaiakids.fr
              </Button>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Nous répondons à :</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  Questions sur les cours et activités
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  Problèmes techniques
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  Suggestions d'amélioration
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  Questions sur les abonnements
                </li>
              </ul>
            </div>
          </div>

          {/* Bouton de fermeture */}
          <div className="flex justify-center pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-8"
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
