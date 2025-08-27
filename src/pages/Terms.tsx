import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-blue-800 mb-4">
                Conditions Générales d'Utilisation
              </h1>
              <p className="text-blue-600 text-lg">
                KivaïaKids - Plateforme d'apprentissage des langues
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">1. Objet</h2>
              <p className="text-gray-700 leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir 
                les modalités et conditions d'utilisation du site KivaïaKids (ci-après « le Site »), ainsi 
                que les droits et obligations des utilisateurs et de l'éditeur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">2. Éditeur du site</h2>
              <p className="text-gray-700 leading-relaxed">
                Le site KivaïaKids est édité par une étudiante passionnée de langues.
                Contact : contact@kivaiakids.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">3. Accès au site</h2>
              <p className="text-gray-700 leading-relaxed">
                L'accès au Site est gratuit pour tout utilisateur disposant d'un accès internet.
                Certaines fonctionnalités ou contenus sont réservés aux utilisateurs disposant d'un compte et/ou d'un abonnement payant.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">4. Création de compte</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour accéder aux cours et contenus personnalisés, l'utilisateur doit créer un compte en fournissant des informations exactes et à jour.
              </p>
              <p className="text-gray-700 leading-relaxed">
                L'utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toute activité effectuée via son compte.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">5. Abonnements et paiements</h2>
              <ul className="text-gray-700 leading-relaxed space-y-2">
                <li>• Le Site propose une offre Premium payante donnant accès à l'ensemble des cours premium.</li>
                <li>• Les paiements sont gérés via un prestataire tiers (Stripe).</li>
                <li>• Aucun remboursement ne sera accordé après activation de l'abonnement, sauf disposition légale contraire.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">6. Contenus éducatifs</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les contenus proposés sur le Site (textes, vidéos, audios, documents) sont destinés à un usage strictement personnel et éducatif.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Il est interdit de copier, reproduire, distribuer ou utiliser ces contenus à des fins commerciales sans autorisation écrite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">7. Responsabilités</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                L'éditeur du Site met tout en œuvre pour fournir des contenus de qualité et assurer la sécurité des données, 
                mais ne peut être tenu responsable en cas de :
              </p>
              <ul className="text-gray-700 leading-relaxed space-y-2 ml-6">
                <li>• dysfonctionnement technique indépendant de sa volonté,</li>
                <li>• utilisation inappropriée du Site par l'utilisateur,</li>
                <li>• pertes ou dommages liés à l'utilisation du Site.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">8. Données personnelles</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les données personnelles collectées (nom, e-mail, informations de paiement) sont traitées conformément à la réglementation en vigueur (RGPD).
              </p>
              <p className="text-gray-700 leading-relaxed">
                L'utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données en contactant contact@kivaiakids.com.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">9. Sécurité des mineurs</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le Site s'adresse à des enfants et jeunes apprenants, sous la responsabilité de leurs parents ou tuteurs légaux.
              </p>
              <p className="text-gray-700 leading-relaxed">
                L'inscription d'un mineur doit être effectuée ou supervisée par un adulte responsable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">10. Modification des CGU</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                L'éditeur se réserve le droit de modifier à tout moment les présentes CGU.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Les utilisateurs seront informés de toute modification par un message affiché sur le Site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">11. Droit applicable</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les présentes CGU sont régies par le droit français.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Tout litige sera soumis à la compétence exclusive des tribunaux français.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
