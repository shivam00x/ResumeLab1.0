import React from 'react';
import { LinkIcon } from './icons/Icons';
import { useLanguage } from '../App';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 w-full bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ResumeLab</span>
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                {t('about_subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
              <div className="md:col-span-1 flex flex-col items-center text-center">
                <img 
                  src="https://i.ibb.co/XrS505FV/Whats-App-Image-2023-12-14-at-15-32-48.jpg"
                  alt="Shivam Kumar"
                  className="w-32 h-32 rounded-full mb-4 object-cover ring-4 ring-white shadow-lg"
                />
                <h2 className="text-2xl font-bold text-slate-800">{t('about_developer_name')}</h2>
                <p className="text-sm font-medium text-slate-500 mb-4">{t('about_developer_title')}</p>
                <a href="https://github.com/shivam-p" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-semibold">
                    <LinkIcon className="w-4 h-4" /> {t('about_view_github')}
                </a>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-slate-800 mb-4">{t('about_features_title')}</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-3 mt-1">&#10003;</span>
                    <span>{t('about_feature_1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-3 mt-1">&#10003;</span>
                    <span>{t('about_feature_2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-3 mt-1">&#10003;</span>
                     <span>{t('about_feature_3')}</span>
                  </li>
                   <li className="flex items-start">
                    <span className="text-indigo-500 mr-3 mt-1">&#10003;</span>
                     <span>{t('about_feature_4')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-3 mt-1">&#10003;</span>
                    <span>{t('about_feature_5')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
