
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import HelpHeader from '@/components/help/HelpHeader';
import HelpSearchBar from '@/components/help/HelpSearchBar';
import HelpFAQSectionComponent from '@/components/help/HelpFAQSection';
import { faqSections } from '@/components/help/HelpFAQData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useWelcomeTour } from '@/hooks/tour/useWelcomeTour';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { resetTour } = useWelcomeTour();

  const handleRestartTour = () => {
    resetTour();
    navigate('/welcome');
  };

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) {
      return faqSections;
    }

    const searchLower = searchTerm.toLowerCase();
    
    return faqSections.map(section => {
      const filteredItems = section.items.filter(item => {
        const answerText = typeof item.answer === 'string' ? item.answer : '';
        return item.question.toLowerCase().includes(searchLower) ||
               answerText.toLowerCase().includes(searchLower);
      });

      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0);
  }, [searchTerm]);

  return (
    <div className="p-6 space-y-6">
      <HelpHeader />
      <HelpSearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Tour guidé */}
      <Card>
        <CardHeader>
          <CardTitle>Tour guidé des nouvelles fonctionnalités</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Redécouvrez toutes les nouvelles fonctionnalités avec notre guide interactif
          </p>
          <Button onClick={handleRestartTour}>
            <Sparkles className="h-4 w-4 mr-2" />
            Recommencer le tour guidé
          </Button>
        </CardContent>
      </Card>
      
      {/* FAQ Sections */}
      <div className="space-y-6">
        {filteredSections.length > 0 ? (
          filteredSections.map((section) => (
            <HelpFAQSectionComponent key={section.id} section={section} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              Aucun résultat trouvé pour "{searchTerm}"
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Essayez avec d'autres mots-clés
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;
