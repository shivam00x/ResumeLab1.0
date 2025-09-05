import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEMPLATES, THEMES } from '../constants';
import { FontFamily, TemplateId, Theme } from '../types';
import { ChevronDownIcon, MenuIcon, XIcon } from './icons/Icons';
import Tooltip from './Tooltip';
import { useLanguage } from '../App';

interface ToolbarProps {
  template: TemplateId;
  setTemplate: (id: TemplateId) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  font: FontFamily;
  setFont: (font: FontFamily) => void;
}

const FONT_OPTIONS: { id: FontFamily; name: string }[] = [
    { id: 'sans', name: 'Inter' },
    { id: 'serif', name: 'Merriweather' },
    { id: 'roboto', name: 'Roboto' },
    { id: 'lato', name: 'Lato' },
    { id: 'playfair', name: 'Playfair Display' },
    { id: 'montserrat', name: 'Montserrat' },
    { id: 'open-sans', name: 'Open Sans' },
    { id: 'raleway', name: 'Raleway' },
    { id: 'oswald', name: 'Oswald' },
    { id: 'poppins', name: 'Poppins' },
    { id: 'nunito-sans', name: 'Nunito Sans' },
    { id: 'source-sans-pro', name: 'Source Sans Pro' },
    { id: 'lora', name: 'Lora' },
    { id: 'pt-serif', name: 'PT Serif' },
    { id: 'libre-baskerville', name: 'Libre Baskerville' },
    { id: 'eb-garamond', name: 'EB Garamond' },
    { id: 'arimo', name: 'Arimo' },
    { id: 'tinos', name: 'Tinos' },
    { id: 'fira-sans', name: 'Fira Sans' },
    { id: 'cardo', name: 'Cardo' },
];

const Toolbar: React.FC<ToolbarProps> = ({ template, setTemplate, theme, setTheme, font, setFont }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { t } = useLanguage();

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenu(prev => (prev === menu ? null : menu));
  };
  
  // FIX: Renamed map parameter from `t` to `template` to avoid shadowing the `t` translation function from `useLanguage`.
  const templateOptions = TEMPLATES.map(template => ({ id: template.id, name: t(template.nameKey)}));

  return (
    <>
      <div className="hidden sm:flex items-center justify-between gap-4">
        <nav className="flex items-center gap-6">
          <Dropdown
              label={t('toolbar_templates')}
              options={templateOptions}
              selectedValue={template}
              onSelect={(id) => setTemplate(id as TemplateId)}
          />
          <Dropdown
              label={t('toolbar_font')}
              options={FONT_OPTIONS}
              selectedValue={font}
              onSelect={(id) => setFont(id as FontFamily)}
          />
        </nav>
        <div className="flex items-center gap-4">
          <ThemeSelector theme={theme} setTheme={setTheme} />
        </div>
      </div>
      
      <div className="sm:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600 hover:text-indigo-600">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={isMenuOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </motion.div>
            </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="sm:hidden absolute top-full left-0 w-full h-screen bg-white z-30 p-6"
        >
            <nav className="flex flex-col gap-4 text-lg">
                <MobileMenuCollapsible
                  label={t('toolbar_templates')}
                  isOpen={openSubMenu === 'templates'}
                  onToggle={() => toggleSubMenu('templates')}
                >
                  {templateOptions.map(t => (
                      <button key={t.id} onClick={() => { setTemplate(t.id as TemplateId); setIsMenuOpen(false); }} className={`block w-full text-left p-2 rounded-md text-base ${template === t.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100'}`}>{t.name}</button>
                  ))}
                </MobileMenuCollapsible>

                 <MobileMenuCollapsible
                  label={t('toolbar_font')}
                  isOpen={openSubMenu === 'font'}
                  onToggle={() => toggleSubMenu('font')}
                >
                    {FONT_OPTIONS.map(f => (
                        <button key={f.id} onClick={() => { setFont(f.id); setIsMenuOpen(false); }} className={`block w-full text-left p-2 rounded-md text-base ${font === f.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100'}`}>{f.name}</button>
                    ))}
                </MobileMenuCollapsible>

                <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h3 className="font-medium text-slate-700">{t('toolbar_theme')}</h3>
                    <ThemeSelector theme={theme} setTheme={setTheme} />
                </div>
            </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

interface DropdownProps {
    label: string;
    options: {id: string; name: string}[];
    selectedValue: string;
    onSelect: (id: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({label, options, selectedValue, onSelect}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                {label}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDownIcon className="w-4 h-4" />
                </motion.div>
            </button>
            <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 max-h-60 overflow-y-auto"
                >
                    {options.map(option => (
                        <button 
                            key={option.id} 
                            onClick={() => { onSelect(option.id); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm ${selectedValue === option.id ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
                        >
                            {option.name}
                        </button>
                    ))}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

const ThemeSelector: React.FC<{theme: Theme; setTheme: (theme: Theme) => void}> = ({theme, setTheme}) => (
     <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {THEMES.map((t) => (
            <Tooltip key={t.name} text={t.name}>
              <button
                onClick={() => setTheme(t)}
                className={`w-6 h-6 rounded-full border-2 transition-transform transform hover:scale-110 focus:outline-none ${
                  theme.primaryColor === t.primaryColor ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'border-slate-200'
                }`}
                style={{ backgroundColor: t.primaryColor }}
                aria-label={`Theme: ${t.name}`}
              />
            </Tooltip>
          ))}
        </div>
      </div>
);

const MobileMenuCollapsible: React.FC<{
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ label, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-slate-200">
      <button onClick={onToggle} className="w-full flex justify-between items-center font-medium text-slate-700 hover:text-indigo-600 text-left py-2">
        <span>{label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDownIcon className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
      {isOpen && (
        <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
        >
            <div className="pl-4 py-2 space-y-2 max-h-48 overflow-y-auto">
              {children}
            </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
};

export default Toolbar;