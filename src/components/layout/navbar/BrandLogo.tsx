
import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  show?: boolean;
}

const BrandLogo = ({ show = true }: BrandLogoProps) => {
  if (!show) return null;
  
  return (
    <Link to="/" className="flex items-center">
      <span className="text-xl font-bold text-karrosserie-orange">
        Karrosserie<span className="text-karrosserie-gray ml-1">Pro</span>
      </span>
    </Link>
  );
};

export default BrandLogo;
