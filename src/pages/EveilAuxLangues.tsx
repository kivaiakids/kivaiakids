import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import SectionTile from '@/components/Eveil/SectionTile';
import { EVEIL_SECTIONS } from '@/integrations/supabase/types-eveil';

const EveilAuxLangues = () => {
  return (
    <Layout>
      <Helmet>
        <title>Éveil aux langues — Kivaia</title>
        <meta 
          name="description" 
          content="Des activités ludiques pour découvrir les langues, les sons et les cultures du monde. Ateliers interactifs, jeux, créations et plus encore." 
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Éveil aux langues
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Des activités ludiques pour découvrir les langues, les sons et les cultures du monde.
            </p>
          </div>
        </section>

        {/* Sections Grid */}
        <section className="px-4 sm:px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Mobile-first: Stack vertical, Desktop: Grid 2x3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EVEIL_SECTIONS.map((section) => (
                <SectionTile
                  key={section.section}
                  title={section.title}
                  subtitle={section.subtitle}
                  href={section.href}
                  icon={section.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4 sm:px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Prêt à explorer le monde des langues ?
              </h2>
              <p className="text-gray-600 mb-6">
                Découvrez nos activités d'éveil aux langues et cultivez la curiosité linguistique de votre enfant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/eveil-aux-langues/ateliers-interactifs"
                  className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Commencer l'exploration
                </a>
                <a 
                  href="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 border border-emerald-600 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors"
                >
                  Découvrir Premium
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default EveilAuxLangues;
