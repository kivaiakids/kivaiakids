import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'SUPPRIMER') {
      toast({
        title: "Erreur de confirmation",
        description: "Veuillez taper 'SUPPRIMER' exactement comme indiqué.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erreur",
        description: "Aucun utilisateur connecté.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      // Appeler la fonction Supabase pour supprimer le compte
      const { data, error } = await supabase.rpc('soft_delete_user_profile', {
        user_id: user.id
      });

      if (error) {
        throw error;
      }

      if (data) {
        toast({
          title: "Compte supprimé",
          description: "Votre compte a été supprimé avec succès. Vous allez être déconnecté.",
        });

        // Attendre un peu avant de déconnecter pour que l'utilisateur voie le message
        setTimeout(async () => {
          await logout();
          navigate('/');
        }, 2000);
      } else {
        throw new Error('Échec de la suppression du compte');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de votre compte. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmationText('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Supprimer mon compte
          </DialogTitle>
          <DialogDescription className="text-left">
            Cette action est <strong>irréversible</strong> et supprimera définitivement votre compte.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avertissements */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-red-800 text-sm">⚠️ Attention :</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Toutes vos données seront perdues</li>
              <li>• Votre abonnement Premium sera annulé</li>
              <li>• Vous ne pourrez plus vous reconnecter</li>
              <li>• Cette action ne peut pas être annulée</li>
            </ul>
          </div>

          {/* Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Pour confirmer, tapez <strong>SUPPRIMER</strong> :
            </Label>
            <Input
              id="confirmation"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="SUPPRIMER"
              className="border-red-200 focus:border-red-500"
              disabled={isDeleting}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting || confirmationText !== 'SUPPRIMER'}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Suppression...' : 'Supprimer définitivement'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountModal;
