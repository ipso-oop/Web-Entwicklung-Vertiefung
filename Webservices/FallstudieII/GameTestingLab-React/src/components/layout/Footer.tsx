import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PacBug Hunter</h3>
            <p className="text-gray-300">
              An educational project designed to help learn debugging skills through 
              a classic a simmple game testing lab implementation.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">
              Questions about the project? Get in touch with your instructor.
            </p>
            <a 
              href="mailto:instructor@example.com" 
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              instructor@example.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Game Testing Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;