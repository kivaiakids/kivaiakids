import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Baby, Users, GraduationCap } from 'lucide-react';
import { AgeRange } from '@/integrations/supabase/types';

interface AgeRangeFilterProps {
  selectedAgeRanges: AgeRange[];
  onAgeRangesChange: (ageRanges: AgeRange[]) => void;
  title?: string;
}

const AGE_RANGE_OPTIONS: { value: AgeRange; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: '12-18_months',
    label: '12 mois à 18 mois',
    icon: <Baby className="w-4 h-4" />,
    description: 'Tout-petits'
  },
  {
    value: '2_years',
    label: '2 ans',
    icon: <Baby className="w-4 h-4" />,
    description: 'Maternelle'
  },
  {
    value: '3_years',
    label: '3 ans',
    icon: <GraduationCap className="w-4 h-4" />,
    description: 'Petite section'
  },
  {
    value: 'up_to_12_years',
    label: 'Jusqu\'à 12 ans',
    icon: <Users className="w-4 h-4" />,
    description: 'Primaire'
  }
];

const AgeRangeFilter: React.FC<AgeRangeFilterProps> = ({
  selectedAgeRanges,
  onAgeRangesChange,
  title = "Filtrer par âge"
}) => {
  const handleAgeRangeToggle = (ageRange: AgeRange) => {
    const newAgeRanges = selectedAgeRanges.includes(ageRange)
      ? selectedAgeRanges.filter(ar => ar !== ageRange)
      : [...selectedAgeRanges, ageRange];
    
    onAgeRangesChange(newAgeRanges);
  };

  const clearAllAgeRanges = () => {
    onAgeRangesChange([]);
  };

  const selectAllAgeRanges = () => {
    onAgeRangesChange(AGE_RANGE_OPTIONS.map(option => option.value));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {selectedAgeRanges.length > 0 && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              {selectedAgeRanges.length} sélectionné{selectedAgeRanges.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {selectedAgeRanges.length > 0 && (
          <Button
            onClick={clearAllAgeRanges}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      {/* Tranches d'âge disponibles */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AGE_RANGE_OPTIONS.map((option) => {
            const isSelected = selectedAgeRanges.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => handleAgeRangeToggle(option.value)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-25 hover:scale-105'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${
                    isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isSelected ? 'text-emerald-800' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </div>
                    <div className={`text-sm ${
                      isSelected ? 'text-emerald-600' : 'text-gray-500'
                    }`}>
                      {option.description}
                    </div>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="text-center">
                    <Badge className="bg-emerald-600 text-white text-xs">
                      ✓ Sélectionné
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions rapides */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={selectAllAgeRanges}
            variant="outline"
            size="sm"
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
          >
            Tout sélectionner
          </Button>
          
          {selectedAgeRanges.length > 0 && (
            <Button
              onClick={clearAllAgeRanges}
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              Aucun
            </Button>
          )}
        </div>
      </div>

      {/* Résumé des filtres actifs */}
      {selectedAgeRanges.length > 0 && (
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-800">
            <strong>Filtres actifs :</strong> {selectedAgeRanges.map(ar => 
              AGE_RANGE_OPTIONS.find(option => option.value === ar)?.label
            ).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default AgeRangeFilter;
