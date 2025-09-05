import React from 'react';
import { View } from '../types';
import { useLanguage } from '../App';

interface FooterProps {
  onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-white border-t border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div className="mb-4 sm:mb-0">
            <button onClick={() => onNavigate('home')} className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ResumeLab
            </button>
            <p className="text-sm text-slate-500 mt-1">
              {t('footer_tagline')}
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <button onClick={() => onNavigate('home')} className="font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              {t('footer_home')}
            </button>
            <button onClick={() => onNavigate('about')} className="font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              {t('footer_about')}
            </button>
             <a href="https://github.com/shivam-p" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              {t('footer_github')}
            </a>
          </div>
        </div>
        <div className="mt-6 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
          <p>{t('footer_copyright').replace('{year}', new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
