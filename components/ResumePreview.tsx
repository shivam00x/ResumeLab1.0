import React from 'react';
// FIX: Changed import from Language to LanguageSkill to match the updated type definition.
import { ResumeData, TemplateId, Theme, Experience, Education, Skill, Project, LanguageSkill, Interest, FontFamily, SectionType, SkillProficiency } from '../types';
import { MailIcon, PhoneIcon, LocationIcon, LinkIcon, BriefcaseIcon, AcademicCapIcon, SparklesIcon, CodeBracketIcon, LinkedInIcon, GitHubIcon } from './icons/Icons';

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateId: TemplateId;
  theme: Theme;
  font: FontFamily;
}

const fontClasses: Record<FontFamily, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    roboto: 'font-roboto',
    lato: 'font-lato',
    playfair: 'font-playfair',
    montserrat: 'font-montserrat',
    'open-sans': 'font-open-sans',
    raleway: 'font-raleway',
    oswald: 'font-oswald',
    poppins: 'font-poppins',
    'nunito-sans': 'font-nunito-sans',
    'source-sans-pro': 'font-source-sans-pro',
    lora: 'font-lora',
    'pt-serif': 'font-pt-serif',
    'libre-baskerville': 'font-libre-baskerville',
    'eb-garamond': 'font-eb-garamond',
    arimo: 'font-arimo',
    tinos: 'font-tinos',
    'fira-sans': 'font-fira-sans',
    cardo: 'font-cardo',
};

const formatUrl = (url: string) => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

const displayUrl = (url: string) => url.replace(/^(https?:\/\/)?(www\.)?/, '');

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, templateId, theme, font }) => {
  const styles = {
    '--primary-color': theme.primaryColor,
    '--secondary-color': theme.secondaryColor,
  } as React.CSSProperties;

  const renderTemplate = () => {
    switch (templateId) {
      case 'ats-minimal':
        return <ATSMinimalTemplate resumeData={resumeData} />;
      case 'modern-two-column':
        return <ModernTwoColumnTemplate resumeData={resumeData} />;
      case 'creative-bold':
        return <CreativeBoldTemplate resumeData={resumeData} />;
      case 'executive-summary':
        return <ExecutiveSummaryTemplate resumeData={resumeData} />;
      case 'tech-innovator':
        return <TechInnovatorTemplate resumeData={resumeData} />;
      case 'academic-cv':
        return <AcademicCVTemplate resumeData={resumeData} />;
      case 'fresher-skills-first':
        return <FresherSkillsFirstTemplate resumeData={resumeData} />;
      case 'info-sidebar':
        return <InfoSidebarTemplate resumeData={resumeData} />;
      case 'corporate-header':
        return <CorporateHeaderTemplate resumeData={resumeData} />;
      case 'classic':
      default:
        return <ClassicTemplate resumeData={resumeData} />;
    }
  };

  return (
    <div
      id="resume-preview"
      className={`w-[210mm] h-[297mm] bg-white text-gray-800 shadow-2xl p-8 overflow-hidden ring-1 ring-black/5 ${
        fontClasses[font] || 'font-sans'
      }`}
      style={styles}
    >
      {renderTemplate()}
    </div>
  );
};

const TemplateProps: { resumeData: ResumeData } = {
    resumeData: {} as ResumeData
};

const ClassicTemplate: React.FC<typeof TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, sections } = resumeData;
    return (
        <div className="text-sm">
            <header className="text-center border-b-2 pb-4" style={{borderColor: 'var(--primary-color)'}}>
                {personalInfo.profilePicture && (
                    <img src={personalInfo.profilePicture} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                )}
                <h1 className="text-4xl font-bold tracking-wider" style={{color: 'var(--primary-color)'}}>{personalInfo.name || "Your Name"}</h1>
                <h2 className="text-xl font-light tracking-widest">{personalInfo.title || "Your Title"}</h2>
                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-xs">
                    {personalInfo.email && <span className="flex items-center gap-1.5"><MailIcon className="h-3 w-3" /> {personalInfo.email}</span>}
                    {personalInfo.phone && <span className="flex items-center gap-1.5"><PhoneIcon className="h-3 w-3" /> {personalInfo.phone}</span>}
                    {personalInfo.location && <span className="flex items-center gap-1.5"><LocationIcon className="h-3 w-3" /> {personalInfo.location}</span>}
                    {personalInfo.website && <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5"><LinkIcon className="h-3 w-3" /> {displayUrl(personalInfo.website)}</a>}
                    {personalInfo.linkedin && <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5"><LinkedInIcon className="h-3 w-3" /> {displayUrl(personalInfo.linkedin)}</a>}
                    {personalInfo.github && <a href={formatUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5"><GitHubIcon className="h-3 w-3" /> {displayUrl(personalInfo.github)}</a>}
                </div>
            </header>
            <main className="mt-6">
                <section>
                    <h3 className="text-lg font-bold uppercase tracking-wider border-b mb-2" style={{color: 'var(--primary-color)'}}>Summary</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                </section>
                {sections.filter(s => s.isVisible).map(section => (
                    <section key={section.id} className="mt-6">
                         <h3 className="text-lg font-bold uppercase tracking-wider border-b mb-2" style={{color: 'var(--primary-color)'}}>{section.title}</h3>
                         <div className="space-y-3">{section.items.map(item => <div key={item.id}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </main>
        </div>
    );
};

const ModernTwoColumnTemplate: React.FC<typeof TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, sections } = resumeData;
    return (
        <div className="flex h-full text-sm">
            <aside className="w-1/3 p-6 text-white flex flex-col" style={{backgroundColor: 'var(--primary-color)'}}>
                {personalInfo.profilePicture && (
                    <img src={personalInfo.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white/50" />
                )}
                <div className="text-center">
                    <h1 className="text-3xl font-bold">{personalInfo.name || "Your Name"}</h1>
                    <h2 className="text-lg font-light border-b pb-4 mb-4" style={{borderColor: 'var(--secondary-color)'}}>{personalInfo.title || "Your Title"}</h2>
                </div>

                <div className="space-y-4 text-xs">
                     {personalInfo.email && <div className="flex items-center gap-2"><MailIcon className="h-4 w-4 flex-shrink-0" /> <span className="break-all">{personalInfo.email}</span></div>}
                     {personalInfo.phone && <div className="flex items-center gap-2"><PhoneIcon className="h-4 w-4 flex-shrink-0" /> <span>{personalInfo.phone}</span></div>}
                     {personalInfo.location && <div className="flex items-center gap-2"><LocationIcon className="h-4 w-4 flex-shrink-0" /> <span>{personalInfo.location}</span></div>}
                     {personalInfo.website && <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4 flex-shrink-0" /> <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.website)}</a></div>}
                     {personalInfo.linkedin && <div className="flex items-center gap-2"><LinkedInIcon className="h-4 w-4 flex-shrink-0" /> <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.linkedin)}</a></div>}
                     {personalInfo.github && <div className="flex items-center gap-2"><GitHubIcon className="h-4 w-4 flex-shrink-0" /> <a href={formatUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.github)}</a></div>}
                </div>
            </aside>
            <main className="w-2/3 p-6 space-y-6 overflow-y-auto">
                 <section>
                    <h3 className="text-xl font-bold uppercase" style={{color: 'var(--primary-color)'}}>Summary</h3>
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed">{summary}</p>
                </section>
                {sections.filter(s => s.isVisible).map(section => (
                    <section key={section.id}>
                         <h3 className="text-xl font-bold uppercase" style={{color: 'var(--primary-color)'}}>{section.title}</h3>
                         <div className="mt-2 space-y-3">{section.items.map(item => <div key={item.id}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </main>
        </div>
    );
};

const CreativeBoldTemplate: React.FC<typeof TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, sections } = resumeData;
    const visibleSections = sections.filter(s => s.isVisible);
    const mainSections = visibleSections.filter(s => ['experience', 'education', 'projects'].includes(s.id));
    const sidebarSections = visibleSections.filter(s => ['skills', 'languages', 'interests'].includes(s.id));

    const SectionIcon = ({ id }: { id: SectionType }) => {
        switch (id) {
            case 'experience': return <BriefcaseIcon className="w-5 h-5" />;
            case 'education': return <AcademicCapIcon className="w-5 h-5" />;
            case 'skills': return <SparklesIcon className="w-5 h-5" />;
            default: return null;
        }
    };

    return (
        <div className="flex h-full text-sm">
            <aside className="w-1/3 p-6 text-white flex flex-col" style={{ backgroundColor: 'var(--primary-color)' }}>
                {personalInfo.profilePicture && (
                    <img src={personalInfo.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4" style={{borderColor: 'var(--secondary-color)'}} />
                )}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">{personalInfo.name || "Your Name"}</h1>
                    <h2 className="text-lg font-light">{personalInfo.title || "Your Title"}</h2>
                </div>

                <div className="space-y-4 text-xs mb-8">
                     {personalInfo.email && <div className="flex items-center gap-2"><MailIcon className="h-4 w-4 flex-shrink-0" /> <span className="break-all">{personalInfo.email}</span></div>}
                     {personalInfo.phone && <div className="flex items-center gap-2"><PhoneIcon className="h-4 w-4 flex-shrink-0" /> <span>{personalInfo.phone}</span></div>}
                     {personalInfo.location && <div className="flex items-center gap-2"><LocationIcon className="h-4 w-4 flex-shrink-0" /> <span>{personalInfo.location}</span></div>}
                     {personalInfo.website && <div className="flex items-center gap-2"><LinkIcon className="h-4 w-4 flex-shrink-0" /> <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.website)}</a></div>}
                     {personalInfo.linkedin && <div className="flex items-center gap-2"><LinkedInIcon className="h-4 w-4 flex-shrink-0" /> <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.linkedin)}</a></div>}
                     {personalInfo.github && <div className="flex items-center gap-2"><GitHubIcon className="h-4 w-4 flex-shrink-0" /> <a href={formatUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.github)}</a></div>}
                </div>
                
                {sidebarSections.map(section => (
                    <section key={section.id} className="mb-6">
                        <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 pb-1 mb-2 flex items-center gap-2" style={{borderColor: 'var(--secondary-color)'}}><SectionIcon id={section.id} /> {section.title}</h3>
                        <div className="space-y-2 text-xs">{section.items.map(item => <div key={item.id}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}

            </aside>
            <main className="w-2/3 p-8 space-y-6 overflow-y-auto">
                 <section>
                    <h3 className="text-2xl font-bold uppercase" style={{ color: 'var(--primary-color)' }}>Summary</h3>
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed border-l-4 pl-4" style={{borderColor: 'var(--secondary-color)'}}>{summary}</p>
                </section>
                {mainSections.map(section => (
                    <section key={section.id}>
                         <h3 className="text-2xl font-bold uppercase flex items-center gap-3" style={{ color: 'var(--primary-color)' }}><SectionIcon id={section.id} />{section.title}</h3>
                         <div className="mt-3 space-y-4 border-l-2 pl-6" style={{borderColor: 'var(--secondary-color)'}}>{section.items.map(item => <div key={item.id} className="relative before:absolute before:w-3 before:h-3 before:rounded-full before:-left-[31px] before:top-1 before:bg-[var(--primary-color)]">{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </main>
        </div>
    );
};

const ATSMinimalTemplate: React.FC<typeof TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, sections } = resumeData;
    return (
        <div className="text-sm space-y-5 font-serif">
            <header className="text-center">
                <h1 className="text-3xl font-bold">{personalInfo.name || "Your Name"}</h1>
                <h2 className="text-lg font-medium text-gray-600">{personalInfo.title || "Your Title"}</h2>
                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.website && <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="underline">{displayUrl(personalInfo.website)}</a>}
                    {personalInfo.linkedin && <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="underline">{displayUrl(personalInfo.linkedin)}</a>}
                    {personalInfo.github && <a href={formatUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="underline">{displayUrl(personalInfo.github)}</a>}
                </div>
            </header>
            
            <main className="space-y-4">
                <section>
                    <h3 className="text-base font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">Summary</h3>
                    <p className="text-xs text-gray-700 leading-normal">{summary}</p>
                </section>
                {sections.filter(s => s.isVisible).map(section => (
                    <section key={section.id}>
                         <h3 className="text-base font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2">{section.title}</h3>
                         <div className="space-y-3">{section.items.map(item => <div key={item.id}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </main>
        </div>
    );
};

const ExecutiveSummaryTemplate: React.FC<typeof TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, sections } = resumeData;
    const visibleSections = sections.filter(s => s.isVisible);
    const mainSections = visibleSections.filter(s => ['experience', 'education', 'projects'].includes(s.id));
    const sidebarSections = visibleSections.filter(s => ['skills', 'languages', 'interests'].includes(s.id));

    return (
        <div className="flex h-full text-sm">
            <main className="w-[68%] pr-6 space-y-5">
                <header className="text-left mb-5">
                    <h1 className="text-5xl font-bold tracking-tight" style={{ color: 'var(--primary-color)' }}>{personalInfo.name || "Your Name"}</h1>
                    <h2 className="text-xl font-medium tracking-wide text-gray-600 mt-1">{personalInfo.title || "Your Title"}</h2>
                </header>
                <section>
                    <h3 className="text-base font-bold uppercase tracking-widest border-b-2 pb-1 mb-2" style={{ borderColor: 'var(--primary-color)' }}>Summary</h3>
                    <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
                </section>
                {mainSections.map(section => (
                    <section key={section.id}>
                         <h3 className="text-base font-bold uppercase tracking-widest border-b-2 pb-1 mb-2" style={{ borderColor: 'var(--primary-color)' }}>{section.title}</h3>
                         <div className="space-y-3">{section.items.map(item => <div key={item.id}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </main>
            <aside className="w-[32%] pl-6 border-l-2 border-slate-200 flex flex-col space-y-5">
                {personalInfo.profilePicture && (
                    <img src={personalInfo.profilePicture} alt="Profile" className="w-28 h-28 rounded-full mx-auto object-cover" />
                )}
                <section>
                    <h3 className="text-base font-bold uppercase tracking-widest border-b pb-1 mb-2" style={{ borderColor: 'var(--primary-color)' }}>Contact</h3>
                    <div className="space-y-2 text-xs">
                         {personalInfo.email && <div className="flex items-center gap-2"><MailIcon className="h-3.5 w-3.5 flex-shrink-0" /> <span className="break-all">{personalInfo.email}</span></div>}
                         {personalInfo.phone && <div className="flex items-center gap-2"><PhoneIcon className="h-3.5 w-3.5 flex-shrink-0" /> <span>{personalInfo.phone}</span></div>}
                         {personalInfo.location && <div className="flex items-center gap-2"><LocationIcon className="h-3.5 w-3.5 flex-shrink-0" /> <span>{personalInfo.location}</span></div>}
                         {personalInfo.website && <div className="flex items-center gap-2"><LinkIcon className="h-3.5 w-3.5 flex-shrink-0" /> <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.website)}</a></div>}
                         {personalInfo.linkedin && <div className="flex items-center gap-2"><LinkedInIcon className="h-3.5 w-3.5 flex-shrink-0" /> <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.linkedin)}</a></div>}
                         {personalInfo.github && <div className="flex items-center gap-2"><GitHubIcon className="h-3.5 w-3.5 flex-shrink-0" /> <a href={formatUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.github)}</a></div>}
                    </div>
                </section>
                 {sidebarSections.map(section => (
                    <section key={section.id}>
                        <h3 className="text-base font-bold uppercase tracking-widest border-b pb-1 mb-2" style={{ borderColor: 'var(--primary-color)' }}>{section.title}</h3>
                        <div className="space-y-2 text-xs">{section.items.map(item => <div key={item.id}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </aside>
        </div>
    );
};

const TechInnovatorTemplate: React.FC<typeof TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, sections } = resumeData;
    const SectionIcon = ({ id }: { id: SectionType }) => {
        switch (id) {
            case 'experience': return <BriefcaseIcon className="w-4 h-4" />;
            case 'education': return <AcademicCapIcon className="w-4 h-4" />;
            case 'projects': return <CodeBracketIcon className="w-4 h-4" />;
            case 'skills': return <SparklesIcon className="w-4 h-4" />;
            default: return null;
        }
    };
    return (
        <div className="text-sm font-mono leading-relaxed">
            <header className="text-center">
                <h1 className="text-3xl font-bold">{personalInfo.name || "Your Name"}</h1>
                <h2 className="text-lg" style={{ color: 'var(--primary-color)' }}>{personalInfo.title || "Your Title"}</h2>
                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-600">
                    {personalInfo.location && <span className="flex items-center gap-1.5"><LocationIcon className="h-3 w-3" /> {personalInfo.location}</span>}
                    {personalInfo.email && <span className="flex items-center gap-1.5"><MailIcon className="h-3 w-3" /> {personalInfo.email}</span>}
                    {personalInfo.phone && <span className="flex items-center gap-1.5"><PhoneIcon className="h-3 w-3" /> {personalInfo.phone}</span>}
                    {personalInfo.website && <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5"><LinkIcon className="h-3 w-3" /> {displayUrl(personalInfo.website)}</a>}
                    {personalInfo.linkedin && <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5"><LinkedInIcon className="h-3 w-3" /> {displayUrl(personalInfo.linkedin)}</a>}
                    {personalInfo.github && <a href={formatUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5"><GitHubIcon className="h-3 w-3" /> {displayUrl(personalInfo.github)}</a>}
                </div>
            </header>
            <main className="mt-5 space-y-4">
                 <section>
                    <p className="text-xs text-gray-700">{summary}</p>
                </section>
                {sections.filter(s => s.isVisible).map(section => (
                    <section key={section.id}>
                         <h3 className="text-base font-bold flex items-center gap-2 mb-1" style={{ color: 'var(--primary-color)' }}>
                            <SectionIcon id={section.id} />
                            // {section.title}
                         </h3>
                         <div className="space-y-2 pl-6">{section.items.map(item => <div key={item.id}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </main>
        </div>
    );
};

const AcademicCVTemplate: React.FC<typeof TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, sections } = resumeData;
    const reorderedSections = [...sections.filter(s => s.isVisible)].sort((a, b) => {
        if (a.id === 'education') return -1;
        if (b.id === 'education') return 1;
        return 0;
    });

    const contactInfo = [];
    if (personalInfo.location) contactInfo.push(<span key="loc">{personalInfo.location}</span>);
    if (personalInfo.email) contactInfo.push(<span key="email">{personalInfo.email}</span>);
    if (personalInfo.phone) contactInfo.push(<span key="phone">{personalInfo.phone}</span>);
    if (personalInfo.website) contactInfo.push(<span key="web"><a href={formatUrl(personalInfo.website)} className="underline" style={{color: 'var(--primary-color)'}}>{displayUrl(personalInfo.website)}</a></span>);
    if (personalInfo.linkedin) contactInfo.push(<span key="linkedin"><a href={formatUrl(personalInfo.linkedin)} className="underline" style={{color: 'var(--primary-color)'}}>{displayUrl(personalInfo.linkedin)}</a></span>);
    if (personalInfo.github) contactInfo.push(<span key="github"><a href={formatUrl(personalInfo.github)} className="underline" style={{color: 'var(--primary-color)'}}>{displayUrl(personalInfo.github)}</a></span>);

    return (
        <div className="text-sm font-serif">
            <header className="text-center mb-6">
                <h1 className="text-4xl font-bold">{personalInfo.name || "Your Name"}</h1>
                <h2 className="text-lg font-normal">{personalInfo.title || "Your Title"}</h2>
                <div className="text-xs mt-2 text-gray-600">
                    {contactInfo.reduce((prev, curr) => [prev, ' | ', curr])}
                </div>
            </header>
            <main>
                <section className="mb-4">
                     <h3 className="text-lg font-bold border-b-2" style={{ borderColor: 'var(--primary-color)' }}>Summary</h3>
                     <p className="mt-1 text-sm text-gray-700">{summary}</p>
                </section>
                {reorderedSections.map(section => (
                    <section key={section.id} className="mb-4">
                         <h3 className="text-lg font-bold border-b-2" style={{ borderColor: 'var(--primary-color)' }}>{section.title}</h3>
                         <div className="mt-1 space-y-2">{section.items.map(item => <div key={item.id}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </main>
        </div>
    );
};

const FresherSkillsFirstTemplate: React.FC<typeof TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, sections } = resumeData;
    const visibleSections = sections.filter(s => s.isVisible);
    const skillsSection = visibleSections.find(s => s.id === 'skills');
    const projectsSection = visibleSections.find(s => s.id === 'projects');
    const educationSection = visibleSections.find(s => s.id === 'education');
    const otherSections = visibleSections.filter(s => !['skills', 'projects', 'education'].includes(s.id));
    
    return (
        <div className="text-sm">
            <header className="text-center pb-4">
                <h1 className="text-4xl font-bold" style={{color: 'var(--primary-color)'}}>{personalInfo.name || "Your Name"}</h1>
                <h2 className="text-xl font-light">{personalInfo.title || "Your Title"}</h2>
                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-gray-600">
                    {personalInfo.email && <span className="flex items-center gap-1.5">{personalInfo.email}</span>}
                    {personalInfo.phone && <span className="flex items-center gap-1.5">{personalInfo.phone}</span>}
                    {personalInfo.location && <span className="flex items-center gap-1.5">{personalInfo.location}</span>}
                    {personalInfo.website && <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline">{displayUrl(personalInfo.website)}</a>}
                    {personalInfo.linkedin && <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline">{displayUrl(personalInfo.linkedin)}</a>}
                    {personalInfo.github && <a href={formatUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline">{displayUrl(personalInfo.github)}</a>}
                </div>
            </header>
            <main className="mt-4 space-y-5">
                {summary && (
                    <section>
                        <p className="text-center text-sm text-gray-700">{summary}</p>
                    </section>
                )}
                {educationSection && (
                    <section>
                         <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 mb-2" style={{borderColor: 'var(--primary-color)'}}>{educationSection.title}</h3>
                         <div className="space-y-3">{educationSection.items.map(item => <div key={item.id}>{renderSectionItem(educationSection.id, item)}</div>)}</div>
                    </section>
                )}
                {skillsSection && (
                    <section>
                         <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 mb-2" style={{borderColor: 'var(--primary-color)'}}>{skillsSection.title}</h3>
                         <div className="space-y-3">{skillsSection.items.map(item => <div key={item.id}>{renderSectionItem(skillsSection.id, item)}</div>)}</div>
                    </section>
                )}
                 {projectsSection && (
                    <section>
                         <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 mb-2" style={{borderColor: 'var(--primary-color)'}}>{projectsSection.title}</h3>
                         <div className="space-y-3">{projectsSection.items.map(item => <div key={item.id}>{renderSectionItem(projectsSection.id, item)}</div>)}</div>
                    </section>
                )}
                {otherSections.map(section => (
                    <section key={section.id}>
                         <h3 className="text-lg font-bold uppercase tracking-wider border-b-2 mb-2" style={{borderColor: 'var(--primary-color)'}}>{section.title}</h3>
                         <div className="space-y-3">{section.items.map(item => <div key={item.id}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </main>
        </div>
    );
};

const InfoSidebarTemplate: React.FC<typeof TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, sections } = resumeData;
    const visibleSections = sections.filter(s => s.isVisible);
    const mainSections = visibleSections.filter(s => ['experience', 'education', 'projects'].includes(s.id));
    const sidebarSections = visibleSections.filter(s => ['skills', 'languages', 'interests'].includes(s.id));
    
    return (
        <div className="flex h-full text-sm">
            <aside className="w-[35%] p-6 bg-slate-50 flex flex-col space-y-6">
                {personalInfo.profilePicture && (
                    <img src={personalInfo.profilePicture} alt="Profile" className="w-28 h-28 rounded-full mx-auto object-cover border-4" style={{borderColor: 'var(--primary-color)'}} />
                )}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800">{personalInfo.name || "Your Name"}</h1>
                    <h2 className="text-base font-medium text-slate-600">{personalInfo.title || "Your Title"}</h2>
                </div>
                
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Contact</h3>
                    <div className="space-y-2 text-xs text-slate-700">
                         {personalInfo.email && <div className="flex items-start gap-2"><MailIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /> <span className="break-all">{personalInfo.email}</span></div>}
                         {personalInfo.phone && <div className="flex items-start gap-2"><PhoneIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /> <span>{personalInfo.phone}</span></div>}
                         {personalInfo.location && <div className="flex items-start gap-2"><LocationIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /> <span>{personalInfo.location}</span></div>}
                         {personalInfo.website && <div className="flex items-start gap-2"><LinkIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /> <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.website)}</a></div>}
                         {personalInfo.linkedin && <div className="flex items-start gap-2"><LinkedInIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /> <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.linkedin)}</a></div>}
                         {personalInfo.github && <div className="flex items-start gap-2"><GitHubIcon className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /> <a href={formatUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="break-all underline">{displayUrl(personalInfo.github)}</a></div>}
                    </div>
                </section>
                 {sidebarSections.map(section => (
                    <section key={section.id}>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">{section.title}</h3>
                        <div className="space-y-3 text-xs">{section.items.map(item => <div key={item.id}>{renderInfoSidebarItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </aside>
            <main className="w-[65%] p-8 space-y-6 overflow-y-auto">
                 <section>
                    <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: 'var(--primary-color)' }}>Summary</h3>
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed">{summary}</p>
                </section>
                {mainSections.map(section => (
                    <section key={section.id}>
                         <h3 className="text-xl font-bold uppercase tracking-wide" style={{ color: 'var(--primary-color)' }}>{section.title}</h3>
                         <div className="mt-2 space-y-4">{section.items.map(item => <div key={item.id} className="border-l-2 pl-4" style={{borderColor: 'var(--primary-color)'}}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </main>
        </div>
    );
};

const CorporateHeaderTemplate: React.FC<typeof TemplateProps> = ({ resumeData }) => {
    const { personalInfo, summary, sections } = resumeData;
    return (
        <div className="text-sm flex flex-col h-full -m-8">
            <header className="p-8 text-white" style={{backgroundColor: 'var(--primary-color)'}}>
                <h1 className="text-5xl font-bold tracking-tight">{personalInfo.name || "Your Name"}</h1>
                <h2 className="text-xl font-light tracking-wide">{personalInfo.title || "Your Title"}</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm border-t border-white/50 pt-3">
                    {personalInfo.email && <span className="flex items-center gap-1.5"><MailIcon className="h-4 w-4" /> {personalInfo.email}</span>}
                    {personalInfo.phone && <span className="flex items-center gap-1.5"><PhoneIcon className="h-4 w-4" /> {personalInfo.phone}</span>}
                    {personalInfo.location && <span className="flex items-center gap-1.5"><LocationIcon className="h-4 w-4" /> {personalInfo.location}</span>}
                    {personalInfo.website && <a href={formatUrl(personalInfo.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline"><LinkIcon className="h-4 w-4" /> {displayUrl(personalInfo.website)}</a>}
                    {personalInfo.linkedin && <a href={formatUrl(personalInfo.linkedin)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline"><LinkedInIcon className="h-4 w-4" /> {displayUrl(personalInfo.linkedin)}</a>}
                    {personalInfo.github && <a href={formatUrl(personalInfo.github)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline"><GitHubIcon className="h-4 w-4" /> {displayUrl(personalInfo.github)}</a>}
                </div>
            </header>
            <main className="mt-6 p-8 space-y-6 flex-1 overflow-y-auto">
                <section>
                    <h3 className="text-lg font-bold uppercase tracking-wider" style={{color: 'var(--primary-color)'}}>Summary</h3>
                    <p className="text-sm text-gray-700 leading-relaxed mt-1">{summary}</p>
                </section>
                {sections.filter(s => s.isVisible).map(section => (
                    <section key={section.id}>
                         <h3 className="text-lg font-bold uppercase tracking-wider" style={{color: 'var(--primary-color)'}}>{section.title}</h3>
                         <div className="mt-1 space-y-4 border-l-2 border-gray-200 pl-4">{section.items.map(item => <div key={item.id}>{renderSectionItem(section.id, item)}</div>)}</div>
                    </section>
                ))}
            </main>
        </div>
    );
};

// Default section item renderer
const renderSectionItem = (sectionId: string, item: any) => {
    switch (sectionId) {
        case 'experience':
            const exp = item as Experience;
            return (
                <div>
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-bold">{exp.role}</h4>
                        <span className="text-xs font-light text-right">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <h5 className="italic text-gray-800">{exp.company}</h5>
                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                </div>
            );
        case 'education':
            const edu = item as Education;
             return (
                <div>
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-bold">{edu.institution}</h4>
                        <span className="text-xs font-light text-right">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <h5 className="italic text-gray-800">{edu.degree}</h5>
                </div>
            );
        case 'skills':
            const skill = item as Skill;
            return (
                <div className="flex items-baseline justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}</span>
                </div>
            )
        case 'projects':
            const project = item as Project;
            return (
                <div>
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-bold">{project.name}</h4>
                        {project.link && <a href={formatUrl(project.link)} target="_blank" rel="noopener noreferrer" className="text-xs" style={{color: 'var(--primary-color)'}}>{displayUrl(project.link)}</a>}
                    </div>
                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed">{project.description}</p>
                </div>
            );
        case 'languages':
            // FIX: Changed type cast from Language to LanguageSkill to match updated type.
            const lang = item as LanguageSkill;
            return (
                <div className="flex justify-between">
                    <span className="font-semibold">{lang.name}</span>
                    <span className="text-gray-600">{lang.proficiency}</span>
                </div>
            );
        case 'interests':
            const interest = item as Interest;
            return (
                <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{interest.name}</span>
            );
        default:
            return null;
    }
};

// Custom renderer for InfoSidebar to show skill bars
const renderInfoSidebarItem = (sectionId: string, item: any) => {
    // FIX: Changed Language['proficiency'] to LanguageSkill['proficiency'] to use the correct, non-conflicting type.
    const getProficiencyWidth = (level: SkillProficiency | LanguageSkill['proficiency']) => {
        const levels: Record<string, string> = {
            'Beginner': '25%', 'Intermediate': '50%', 'Advanced': '75%', 
            'Expert': '100%', 'Fluent': '90%', 'Native': '100%'
        };
        return levels[level] || '50%';
    };

    if (sectionId === 'skills') {
        const skill = item as Skill;
        return (
            <div>
                <span className="font-medium text-slate-800">{skill.name}</span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full" style={{ width: getProficiencyWidth(skill.level), backgroundColor: 'var(--primary-color)' }}></div>
                </div>
            </div>
        )
    }
    if (sectionId === 'languages') {
        // FIX: Changed type cast from Language to LanguageSkill to match updated type.
        const lang = item as LanguageSkill;
        return (
            <div>
                <span className="font-medium text-slate-800">{lang.name}</span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full" style={{ width: getProficiencyWidth(lang.proficiency), backgroundColor: 'var(--primary-color)' }}></div>
                </div>
            </div>
        )
    }
    return renderSectionItem(sectionId, item);
};

export default ResumePreview;