
import React from 'react';

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-lg transition-all">
        {children}
      </div>
    </div>
  );
};

export default AuthContainer;
