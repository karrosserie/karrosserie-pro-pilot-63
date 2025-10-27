import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-muted-foreground">
          <p>© 2025 Karrosserie Pro - KPITAL LIMITED</p>
          <span className="hidden sm:inline">•</span>
          <Link 
            to="/terms" 
            className="hover:text-primary transition-colors underline"
          >
            CGU/CGV
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
