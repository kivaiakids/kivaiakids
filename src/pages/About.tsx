import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Globe, 
  Users, 
  Sparkles, 
  BookOpen, 
  Target,
  ArrowRight
} from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <Helmet>
        <title>À propos — Kivaia Kids</title>
        <meta 
          name="description" 
          content="Découvrez Kivaia Kids : notre mission, nos valeurs et notre vision pour l'éveil aux langues et aux cultures des enfants." 
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-8 shadow-xl">
                <Heart className="w-10 h-10 text-white" />
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
                À propos de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Kivaia Kids
                </span>
              </h1>

              {/* Subtitle */}
              <div className="max-w-3xl mx-auto">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
                  Kivaia Kids, ce n'est pas seulement un site éducatif.
                </p>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
                  C'est une invitation à grandir, à s'ouvrir au monde et à découvrir la richesse des langues et des cultures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Card className="bg-white/70 backdrop-blur-sm border-emerald-200 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mb-6">
                    <Target className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Notre mission
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                      Donner aux enfants, dès le plus jeune âge, le goût des langues, le respect des cultures et la joie d'apprendre avec plaisir.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-gray-700">
                          <strong>Le goût des langues</strong> — Éveiller la curiosité naturelle pour les sons, les mots et les expressions du monde
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-gray-700">
                          <strong>Le respect des cultures</strong> — Célébrer la diversité et apprendre la tolérance à travers les traditions
                        </p>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-gray-700">
                          <strong>La joie d'apprendre</strong> — Transformer chaque découverte en moment de plaisir et d'émerveillement
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-8 text-center">
                      <Globe className="w-24 h-24 text-emerald-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                        Un monde de possibilités
                      </h3>
                      <p className="text-emerald-700">
                        Chaque langue ouvre une porte, chaque culture enrichit l'âme
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nos convictions
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Chez Kivaia Kids, nous croyons en la force de l'apprentissage bienveillant et en la capacité naturelle des enfants à s'épanouir.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Conviction 1 */}
              <Card className="bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      La curiosité naturelle
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    Nous croyons que chaque enfant porte en lui une immense curiosité — une soif naturelle de comprendre, de parler, de s'exprimer.
                  </p>
                </CardContent>
              </Card>

              {/* Conviction 2 */}
              <Card className="bg-white/70 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Vos meilleurs alliés
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    Et nous croyons que vous, parents, enseignants, animateurs et professionnels de l'enfance, êtes les meilleurs alliés de cette aventure.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200 shadow-xl">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full mb-8">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                  Une aventure qui commence
                </h2>
                
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                  Kivaia Kids naît de la conviction qu'apprendre les langues doit être une source de joie, de découverte et d'épanouissement. 
                  Nous voulons accompagner chaque enfant dans cette belle aventure, avec vous à ses côtés.
                </p>
                
                <div className="inline-flex items-center gap-2 text-emerald-600 font-medium">
                  <span>Chaque mot devient une aventure</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>Chaque son, une porte ouverte sur le monde</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Prêt à rejoindre l'aventure ?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Découvrez dès maintenant nos activités d'éveil aux langues et commencez cette belle aventure avec votre enfant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/eveil-aux-langues')}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Découvrir les activités
              </Button>
              
              <Button 
                onClick={() => navigate('/pricing')}
                variant="outline"
                size="lg"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8"
              >
                Voir nos offres
              </Button>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default About;
