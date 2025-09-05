

import React, { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
// FIX: Removed `Transition` from framer-motion imports to prevent type resolution conflicts.
import { motion, AnimatePresence } from 'framer-motion';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import Toolbar from './components/Toolbar';
import { useResume } from './hooks/useResume';
import { TRANSLATIONS, TEMPLATES, THEMES } from './constants';
import { FontFamily, TemplateId, Theme, View, Language } from './types';
import { generatePdf } from './lib/pdfGenerator';
import { generateDocx } from './lib/docxGenerator';
import { DownloadIcon, EditIcon, ChevronDownIcon, FilePdfIcon, FileWordIcon, LogoIcon, MenuIcon, XIcon } from './components/icons/Icons';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import Footer from './components/Footer';
import ResumePage from './components/ResumePage';
import CVPage from './components/CVPage';
import CoverLetterPage from './components/CoverLetterPage';
import CareerAdvicePage from './components/CareerAdvicePage';

// --- Internationalization (i18n) Context ---
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const supportedLanguages: Language[] = ['en', 'es', 'fr', 'de', 'hi'];

const getInitialLanguage = (): Language => {
  try {
    const savedLanguage = localStorage.getItem('resumeLabLanguage') as Language;
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      return savedLanguage;
    }
    const browserLanguage = navigator.language.split('-')[0] as Language;
    if (supportedLanguages.includes(browserLanguage)) {
      return browserLanguage;
    }
  } catch (e) {
    // Gracefully handle potential localStorage or navigator access errors
  }
  return 'en';
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    if (supportedLanguages.includes(lang)) {
        setLanguageState(lang);
        try {
            localStorage.setItem('resumeLabLanguage', lang);
        } catch (e) {
            console.error("Could not save language to localStorage", e);
        }
    }
  };
  
  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
// --- End i18n Context ---


// --- Language Switcher Component ---
const LANGUAGES: { code: Language; nativeName: string }[] = [
    { code: 'en', nativeName: 'English' },
    { code: 'es', nativeName: 'Español' },
    { code: 'fr', nativeName: 'Français' },
    { code: 'de', nativeName: 'Deutsch' },
    { code: 'hi', nativeName: 'हिन्दी' },
];

const LanguageSwitcher: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLanguage = LANGUAGES.find(l => l.code === language);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(p => !p)} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isMobile ? 'w-full justify-center text-slate-700 bg-slate-100 rounded-md p-3' : 'text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md px-3 py-1.5 hover:border-slate-400'}`}>
                <span>{currentLanguage?.nativeName}</span>
                <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className={`absolute mt-2 w-40 bg-white rounded-md shadow-lg z-30 border border-slate-200 py-1 ${isMobile ? 'right-0 left-0 mx-auto' : 'right-0'}`}>
                        {LANGUAGES.map(lang => (
                            <button key={lang.code} onClick={() => { setLanguage(lang.code); setIsOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${language === lang.code ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}>
                                {lang.nativeName}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
// --- End Language Switcher ---


type MobileView = 'form' | 'preview';
const UI_STATE_KEY = 'resumeLabUIState';

const loadInitialUIState = () => {
  try {
    const savedStateJSON = localStorage.getItem(UI_STATE_KEY);
    if (savedStateJSON) {
      const savedState = JSON.parse(savedStateJSON);
      if (savedState.template && savedState.theme && savedState.font) return savedState;
    }
  } catch (error) { console.error("Failed to load UI state:", error); }
  return { template: TEMPLATES[0].id, theme: THEMES[0], font: 'sans' as FontFamily };
};

const AppContent: React.FC = () => {
  const { state, dispatch } = useResume();
  const { t } = useLanguage();
  const [view, setView] = useState<View>('home');
  const [template, setTemplate] = useState<TemplateId>(loadInitialUIState().template);
  const [theme, setTheme] = useState<Theme>(loadInitialUIState().theme);
  const [font, setFont] = useState<FontFamily>(loadInitialUIState().font);
  const [mobileView, setMobileView] = useState<MobileView>('form');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(UI_STATE_KEY, JSON.stringify({ template, theme, font }));
    } catch (error) { console.error("Failed to save UI state:", error); }
  }, [template, theme, font]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) setIsDownloadOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; }
  }, [isMobileMenuOpen])

  const handleDownloadPdf = async () => {
    setIsDownloadOpen(false);
    if (window.innerWidth < 1024) setMobileView('preview');
    setIsGeneratingPdf(true);
    try {
      await new Promise(res => setTimeout(res, 200));
      const resumeElement = document.getElementById('resume-preview-wrapper');
      if (resumeElement) await generatePdf(resumeElement, state.personalInfo.name);
    } catch (error) { console.error("PDF generation failed:", error); alert("Sorry, there was an error generating the PDF."); } 
    finally { setIsGeneratingPdf(false); }
  };

  const handleDownloadDocx = async () => {
    setIsDownloadOpen(false);
    setIsGeneratingDocx(true);
    try {
      await generateDocx(state, theme, font);
    } catch (error) { console.error("DOCX generation failed:", error); alert("Sorry, there was an error generating the DOCX file."); } 
    finally { setIsGeneratingDocx(false); }
  };

  const pageVariants = { initial: { opacity: 0, y: 20 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -20 } };
  // FIX: Added `as const` to ensure strict type inference for framer-motion's `transition` prop, resolving type compatibility errors.
  const pageTransition = { type: "tween", ease: "anticipate", duration: 0.5 } as const;
  
  const navigateToEditor = () => {
    setView('editor');
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    const key = view;
    const pageProps = { key, initial: "initial", animate: "in", exit: "out", variants: pageVariants, transition: pageTransition };
    switch (view) {
      case 'home': return <motion.div {...pageProps}><HomePage onNavigateToEditor={navigateToEditor} /></motion.div>;
      case 'about': return <motion.div {...pageProps}><AboutPage /></motion.div>;
      case 'resume': return <motion.div {...pageProps}><ResumePage onNavigateToEditor={navigateToEditor} /></motion.div>;
      case 'cv': return <motion.div {...pageProps}><CVPage onNavigateToEditor={navigateToEditor} /></motion.div>;
      case 'cover-letter': return <motion.div {...pageProps}><CoverLetterPage /></motion.div>;
      case 'career-advice': return <motion.div {...pageProps}><CareerAdvicePage /></motion.div>;
      case 'editor':
        return (
          <motion.div {...pageProps} className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <aside className={`w-full lg:w-[45%] lg:max-w-2xl bg-white border-r border-slate-200 overflow-y-auto transition-all duration-300 ${mobileView === 'form' ? 'block' : 'hidden'} lg:block`}>
              <ResumeForm resumeData={state} dispatch={dispatch} onShowPreview={() => setMobileView('preview')} />
            </aside>
            <div className={`flex-1 flex flex-col min-h-0 transition-all duration-300 ${mobileView === 'preview' ? 'flex' : 'hidden'} lg:flex`}>
              <div className="p-3 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex items-center justify-between sticky top-0 lg:static z-10">
                <button onClick={() => setMobileView('form')} className="lg:hidden flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg shadow-sm hover:bg-slate-200"><EditIcon className="w-4 h-4" /> Back to Editor</button>
                <h2 className="hidden lg:block text-lg font-semibold text-slate-800">Preview</h2>
                 <div className="relative" ref={downloadDropdownRef}>
                    <button onClick={() => setIsDownloadOpen(prev => !prev)} disabled={isGeneratingPdf || isGeneratingDocx} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:bg-indigo-400 disabled:cursor-wait">
                        {isGeneratingPdf || isGeneratingDocx ? ( <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span className="hidden sm:inline">{t('generating_button')}</span></> ) : ( <><DownloadIcon /><span className="hidden sm:inline">{t('download_button')}</span><ChevronDownIcon className="w-4 h-4" /></> )}
                    </button>
                    <AnimatePresence>
                    {isDownloadOpen && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-slate-200 py-1">
                        <button onClick={handleDownloadPdf} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"><FilePdfIcon /> {t('download_pdf')}</button>
                        <button onClick={handleDownloadDocx} disabled={isGeneratingDocx} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed" title="Export as a Word document"><FileWordIcon /><span>{t('download_docx')}</span></button>
                    </motion.div>)}
                    </AnimatePresence>
                </div>
              </div>
              <div className="flex-1 flex items-start justify-center p-4 lg:p-10 bg-slate-100 overflow-y-auto min-h-0">
                <div id="resume-preview-wrapper" className="relative w-[341px] h-[483px] sm:w-[603px] sm:h-[853px] md:w-[730px] md:h-[1033px] lg:w-[476px] lg:h-[674px] xl:w-[619px] xl:h-[876px] 2xl:w-[762px] 2xl:h-[1078px]">
                  <div className="absolute top-0 left-0 transform origin-top-left scale-[0.43] sm:scale-[0.76] md:scale-[0.92] lg:scale-[0.6] xl:scale-[0.78] 2xl:scale-[0.96]">
                    <ResumePreview resumeData={state} templateId={template} theme={theme} font={font} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  const NavLinks = ({ isMobile = false }) => {
    const linkClass = isMobile ? "text-lg font-medium text-slate-700 hover:text-indigo-600 w-full text-left py-2" : "text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors";
    const closeMenu = () => isMobile && setIsMobileMenuOpen(false);
    return (
        <>
            <button onClick={() => { setView('resume'); closeMenu(); }} className={linkClass}>{t('header_resume')}</button>
            <button onClick={() => { setView('cv'); closeMenu(); }} className={linkClass}>{t('header_cv')}</button>
            <button onClick={() => { setView('cover-letter'); closeMenu(); }} className={linkClass}>{t('header_cover_letter')}</button>
            <button onClick={() => { setView('career-advice'); closeMenu(); }} className={linkClass}>{t('header_career_advice')}</button>
            <button onClick={() => { setView('about'); closeMenu(); }} className={linkClass}>{t('header_about')}</button>
        </>
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-800">
      <header className="flex items-center justify-between w-full px-4 sm:px-6 h-20 bg-white shadow-sm sticky top-0 z-20 border-b border-slate-200">
        <div className="flex items-center gap-2">
            <LogoIcon className="h-8 w-8" />
            <button onClick={() => { setView('home'); setIsMobileMenuOpen(false); }} className="text-2xl font-bold text-slate-800 tracking-tight">ResumeLab</button>
        </div>

        {view === 'editor' ? (
            <div className="flex items-center justify-end gap-2 sm:gap-4 flex-grow">
                <Toolbar template={template} setTemplate={setTemplate} theme={theme} setTheme={setTheme} font={font} setFont={setFont} />
                <div className="hidden sm:block pl-2 sm:pl-4 border-l border-slate-200"><LanguageSwitcher /></div>
            </div>
        ) : (
            <>
                <nav className="hidden lg:flex items-center gap-8"><NavLinks /></nav>
                <div className="hidden lg:flex items-center gap-4"><LanguageSwitcher /></div>
                <div className="lg:hidden flex items-center"><button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600" aria-label="Toggle menu">{isMobileMenuOpen ? <XIcon /> : <MenuIcon />}</button></div>
            </>
        )}
      </header>

      <AnimatePresence>
      {isMobileMenuOpen && view !== 'editor' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/20 z-30" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      {isMobileMenuOpen && view !== 'editor' && (
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: 'tween', ease: 'easeInOut' }} className="lg:hidden fixed top-20 right-0 w-full max-w-xs h-[calc(100vh-5rem)] bg-white z-40 shadow-xl p-6">
            <div className="flex flex-col h-full">
              <nav className="flex flex-col gap-4"><NavLinks isMobile /></nav>
              <div className="mt-auto pt-6 border-t border-slate-200">
                <LanguageSwitcher isMobile />
              </div>
            </div>
        </motion.div>
      )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col"><AnimatePresence mode="wait">{renderContent()}</AnimatePresence></main>
      <Footer onNavigate={setView} />
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;