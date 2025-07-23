
import React, { useState, useMemo } from 'react';
import HelpHeader from '@/components/help/HelpHeader';
import HelpSearchBar from '@/components/help/HelpSearchBar';
import HelpFAQSectionComponent from '@/components/help/HelpFAQSection';
import { faqSections } from '@/components/help/HelpFAQData';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <HelpHeader />
      <HelpSearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
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
