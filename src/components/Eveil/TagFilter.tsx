import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  title?: string;
}

const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedTags,
  onTagsChange,
  title = "Filtrer par tags"
}) => {
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);

  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

  const handleTagToggle = (tag: string) => {
    const newTags = localSelectedTags.includes(tag)
      ? localSelectedTags.filter(t => t !== tag)
      : [...localSelectedTags, tag];
    
    setLocalSelectedTags(newTags);
    onTagsChange(newTags);
  };

  const clearAllTags = () => {
    setLocalSelectedTags([]);
    onTagsChange([]);
  };

  const selectAllTags = () => {
    setLocalSelectedTags(availableTags);
    onTagsChange(availableTags);
  };

  if (!availableTags || availableTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {selectedTags.length > 0 && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              {selectedTags.length} sélectionné{selectedTags.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {selectedTags.length > 0 && (
          <Button
            onClick={clearAllTags}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      {/* Tags disponibles */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const isSelected = localSelectedTags.includes(tag);
            return (
              <Badge
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
                variant={isSelected ? "default" : "secondary"}
              >
                {tag}
                {isSelected && (
                  <span className="ml-2 text-emerald-100">✓</span>
                )}
              </Badge>
            );
          })}
        </div>

        {/* Actions rapides */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={selectAllTags}
            variant="outline"
            size="sm"
            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
          >
            Tout sélectionner
          </Button>
          
          {selectedTags.length > 0 && (
            <Button
              onClick={clearAllTags}
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
      {selectedTags.length > 0 && (
        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-emerald-800">
            <strong>Filtres actifs :</strong> {selectedTags.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
