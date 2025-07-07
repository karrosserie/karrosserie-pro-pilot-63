
import React from 'react';
import HelpHeader from '@/components/help/HelpHeader';
import HelpSearchBar from '@/components/help/HelpSearchBar';
import HelpFAQSectionComponent from '@/components/help/HelpFAQSection';
import { faqSections } from '@/components/help/HelpFAQData';

const Help = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <HelpHeader />
      <HelpSearchBar />
      
      {/* FAQ Sections */}
      <div className="space-y-6">
        {faqSections.map((section) => (
          <HelpFAQSectionComponent key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
};

export default Help;
