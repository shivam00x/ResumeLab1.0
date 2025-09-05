

import React from 'react';
// FIX: Removed `Variants` from framer-motion imports to prevent type resolution conflicts.
import { motion } from 'framer-motion';
import { useLanguage } from '../App';

interface HomePageProps {
  onNavigateToEditor: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToEditor }) => {
  const { t } = useLanguage();

  // FIX: Removed explicit `Variants` type to let TypeScript infer it.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    },
  };

  // FIX: Added `as const` to ensure strict type inference for framer-motion's `variants` prop, resolving type compatibility errors.
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  } as const;

  // FIX: Added `as const` to ensure strict type inference for framer-motion's `variants` prop, resolving type compatibility errors.
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: { 
      opacity: 1, scale: 1, rotate: 3,
      transition: { type: "spring", stiffness: 100, damping: 10, duration: 0.8 }
    },
  } as const;

  return (
    <div className="w-full overflow-hidden">
      <section className="bg-teal-custom">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-14rem)] py-16">
            
            <motion.div 
              className="text-center lg:text-left z-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-blue-custom leading-tight"
                variants={itemVariants}
              >
                {t('home_title_1')} <span className="text-white">{t('home_title_2')}</span>
              </motion.h1>
              <motion.p 
                className="mt-6 max-w-lg mx-auto lg:mx-0 text-lg text-slate-800/80"
                variants={itemVariants}
              >
                {t('home_subtitle')}
              </motion.p>
              <motion.button
                onClick={onNavigateToEditor}
                className="mt-10 px-8 py-4 text-base font-bold text-dark-blue-custom bg-orange-custom rounded-lg shadow-lg hover:brightness-105 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                {t('home_cta')}
              </motion.button>
            </motion.div>

            <div className="relative h-full flex items-center justify-center min-h-[300px] lg:min-h-0">
              <motion.div
                className="relative w-full max-w-md"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="absolute -top-10 -left-10 w-32 h-32 bg-teal-custom/50 rounded-lg filter blur-lg"
                  animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
                 <div className="absolute top-10 left-10 w-24 h-24 border-2 border-dashed border-white opacity-40 transform -rotate-12"></div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-orange-custom rounded-full"></div>
                
                <img 
                  src="https://d.novoresume.com/images/doc/functional-resume-template.png" 
                  alt="Resume example" 
                  className="relative rounded-lg shadow-2xl w-full"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;