import React, { ChangeEvent, Dispatch, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Changed import from Language to LanguageSkill to match the updated type definition and resolve naming conflicts.
import { Action, ResumeData, PersonalInfo, SectionType, Experience, Education, Skill, Project, Section, LanguageSkill, Interest, SkillProficiency } from '../types';
import { PlusIcon, TrashIcon, ChevronDownIcon, XCircleIcon, EyeIcon, EyeSlashIcon, GripVerticalIcon, BriefcaseIcon, AcademicCapIcon, SparklesIcon, CodeBracketIcon, LanguageIcon, HeartIcon, IdentificationIcon, DocumentTextIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from './icons/Icons';
import { SECTION_CONFIG } from '../constants';
import { useLanguage } from '../App';

const { DragDropContext, Droppable, Draggable } = (window as any).ReactBeautifulDnd || {
  DragDropContext: null, Droppable: ({ children }: any) => children({}, {}), Draggable: ({ children }: any) => children({}, {})
};

interface ResumeFormProps {
  resumeData: ResumeData;
  dispatch: Dispatch<Action>;
  onShowPreview: () => void;
}

const formInputStyles = (hasError: boolean) => 
  `block w-full text-sm shadow-sm rounded-lg bg-slate-100 border-2 ${
    hasError 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-transparent focus:ring-indigo-500'
  } focus:outline-none focus:bg-white focus:ring-2 text-gray-900 placeholder:text-gray-400 px-3 py-2.5 transition-shadow duration-200`;


const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, dispatch, onShowPreview }) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>('personalInfo');
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLanguage();

  const validateField = (name: string, value: string): string => {
    const fieldName = name.split('.').pop() || name;

    const requiredFields = ['name', 'title', 'email', 'summary', 'role', 'company', 'institution', 'degree'];
    if (requiredFields.includes(fieldName) && !value.trim()) {
      return 'This field is required.';
    }

    if (fieldName === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) {
      return 'Invalid email address.';
    }

    if (fieldName === 'phone' && value && !/^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/.test(value)) {
      return 'Invalid phone number.';
    }

    return '';
  };

  const handleValidation = (name: string, value: string) => {
    const error = validateField(name, value);
    setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
            newErrors[name] = error;
        } else {
            delete newErrors[name];
        }
        return newErrors;
    });
  }

  const handleToggleSection = (sectionId: string) => {
    setOpenSectionId(prevOpenId => (prevOpenId === sectionId ? null : sectionId));
  };

  const handlePersonalInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleValidation(name, value);
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { [name]: value } });
  };

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { profilePicture: event.target?.result as string } });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const availableSections = Object.values(SECTION_CONFIG).filter(
    config => !resumeData.sections.some(s => s.id === config.id)
  );

  const handleAddSection = (sectionId: SectionType) => {
    const config = SECTION_CONFIG[sectionId];
    const newSection: Section<any> = {
        id: config.id,
        title: t(config.titleKey),
        items: [config.factory()],
        isVisible: true,
    };
    dispatch({ type: 'ADD_SECTION', payload: { section: newSection } });
    setOpenSectionId(sectionId);
    setIsAddSectionOpen(false);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    dispatch({
      type: 'REORDER_SECTIONS',
      payload: {
        startIndex: result.source.index,
        endIndex: result.destination.index,
      },
    });
  };
  
  const getSectionIcon = (sectionId: SectionType | 'personalInfo' | 'summary') => {
    switch (sectionId) {
        case 'personalInfo': return <IdentificationIcon />;
        case 'summary': return <DocumentTextIcon />;
        case 'experience': return <BriefcaseIcon />;
        case 'education': return <AcademicCapIcon />;
        case 'skills': return <SparklesIcon />;
        case 'projects': return <CodeBracketIcon />;
        case 'languages': return <LanguageIcon />;
        case 'certifications': return <ChatBubbleLeftRightIcon />;
        case 'interests': return <HeartIcon />;
        default: return <UserCircleIcon />;
    }
  };


  const SectionsList = () => (
     <div className="space-y-4">
        {resumeData.sections.map((section, index) => (
            <AccordionSection
                key={section.id} 
                title={t(SECTION_CONFIG[section.id]?.titleKey) || section.title}
                icon={getSectionIcon(section.id)}
                isOpen={openSectionId === section.id}
                onToggle={() => handleToggleSection(section.id)}
                removeSection={() => dispatch({ type: 'REMOVE_SECTION', payload: { sectionId: section.id }})}
                isVisible={section.isVisible}
                onToggleVisibility={() => dispatch({ type: 'TOGGLE_SECTION_VISIBILITY', payload: { sectionId: section.id }})}
            >
              {renderSectionContent(section)}
            </AccordionSection>
        ))}
     </div>
  );

  const renderSectionContent = (section: Section<any>) => (
    <>
      <div className="space-y-6">
        {section.items.map((item, itemIndex) => (
          <div key={item.id} className="relative pt-6 first:pt-0">
            {itemIndex > 0 && <hr className="absolute top-0 left-0 w-full border-t border-slate-200" />}
            
            {section.items.length > 1 && (
              <button 
                onClick={() => dispatch({ type: 'REMOVE_SECTION_ITEM', payload: { sectionId: section.id, itemId: item.id } })} 
                className="absolute top-6 right-0 p-1.5 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors" 
                aria-label="Remove item"
              >
                  <TrashIcon />
              </button>
            )}
            
            {renderSectionForm(section.id, item, dispatch, errors, handleValidation)}
          </div>
        ))}
      </div>
      <button onClick={() => dispatch({ type: 'ADD_SECTION_ITEM', payload: { sectionId: section.id, item: SECTION_CONFIG[section.id].factory() } })} className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon /> Add {section.id.endsWith('s') ? section.id.slice(0, -1) : section.id}
      </button>
    </>
  );


  return (
    <div className="space-y-4 lg:p-6 p-4">
      <AccordionSection
        title={t('form_personal_info_title')}
        icon={getSectionIcon('personalInfo')}
        isOpen={openSectionId === 'personalInfo'}
        onToggle={() => handleToggleSection('personalInfo')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <Input name="name" label={t('form_full_name_label')} value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} placeholder="e.g., Jane Doe" error={errors.name} />
          <Input name="title" label={t('form_job_title_label')} value={resumeData.personalInfo.title} onChange={handlePersonalInfoChange} placeholder="e.g., Senior Frontend Developer" error={errors.title} />
          <Input name="email" label={t('form_email_label')} value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} type="email" placeholder="e.g., jane.doe@email.com" error={errors.email} />
          <Input name="phone" label={t('form_phone_label')} value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="e.g., (123) 456-7890" error={errors.phone} />
          <Input name="location" label={t('form_location_label')} value={resumeData.personalInfo.location} onChange={handlePersonalInfoChange} placeholder="e.g., San Francisco, CA"/>
          <Input name="website" label={t('form_website_label')} value={resumeData.personalInfo.website} onChange={handlePersonalInfoChange} placeholder="e.g., my-portfolio.com" />
          <Input name="linkedin" label={t('form_linkedin_label')} value={resumeData.personalInfo.linkedin} onChange={handlePersonalInfoChange} placeholder="e.g., linkedin.com/in/jane-doe" />
          <Input name="github" label={t('form_github_label')} value={resumeData.personalInfo.github} onChange={handlePersonalInfoChange} placeholder="e.g., github.com/jane-doe" />
        </div>
        <div className="mt-6">
            <FieldGroup label={t('form_profile_picture_label')} htmlFor="profilePicture">
              <input id="profilePicture" name="profilePicture" type="file" accept="image/*" onChange={handleProfilePictureChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"/>
            </FieldGroup>
        </div>
      </AccordionSection>
      
      <AccordionSection
        title={t('form_summary_title')}
        icon={getSectionIcon('summary')}
        isOpen={openSectionId === 'summary'}
        onToggle={() => handleToggleSection('summary')}
      >
        <Textarea
            name="summary"
            label={t('form_summary_label')}
            rows={5}
            value={resumeData.summary}
            placeholder={t('form_summary_placeholder')}
            onChange={(e) => {
              handleValidation(e.target.name, e.target.value);
              dispatch({ type: 'UPDATE_SUMMARY', payload: e.target.value });
            }}
            error={errors.summary}
        />
      </AccordionSection>

      {DragDropContext ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {resumeData.sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <AccordionSection
                          title={t(SECTION_CONFIG[section.id]?.titleKey) || section.title}
                          icon={getSectionIcon(section.id)}
                          isOpen={openSectionId === section.id}
                          onToggle={() => handleToggleSection(section.id)}
                          removeSection={() => dispatch({ type: 'REMOVE_SECTION', payload: { sectionId: section.id }})}
                          isVisible={section.isVisible}
                          onToggleVisibility={() => dispatch({ type: 'TOGGLE_SECTION_VISIBILITY', payload: { sectionId: section.id }})}
                          dragHandleProps={provided.dragHandleProps}
                        >
                          {renderSectionContent(section)}
                        </AccordionSection>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <SectionsList />
      )}


      <div className="space-y-4 pt-4">
        <div className="relative">
            <button
            onClick={() => setIsAddSectionOpen(prev => !prev)}
            disabled={availableSections.length === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all"
            >
            <PlusIcon /> {t('form_add_section_button')}
            </button>
            <AnimatePresence>
            {isAddSectionOpen && availableSections.length > 0 && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-10"
            >
                <ul className="py-1">
                {availableSections.map(config => (
                    <li key={config.id}>
                    <button
                        onClick={() => handleAddSection(config.id)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                        {getSectionIcon(config.id)} {t(config.titleKey)}
                    </button>
                    </li>
                ))}
                </ul>
            </motion.div>
            )}
            </AnimatePresence>
        </div>
        <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={onShowPreview}
                className="w-full lg:hidden flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg shadow-sm hover:bg-slate-200 transition-all"
            >
                {t('form_preview_resume_button')}
            </button>
        </div>
      </div>
    </div>
  );
};

const AccordionSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  removeSection?: () => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  dragHandleProps?: any;
}> = ({ title, icon, children, isOpen, onToggle, removeSection, isVisible, onToggleVisibility, dragHandleProps }) => {
    return (
        <div className={`border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-300 ${isVisible === false ? 'opacity-60 bg-slate-50' : ''}`}>
            <div
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-slate-50 transition-colors text-left cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                   {dragHandleProps && (
                        <span {...dragHandleProps} onClick={e => e.stopPropagation()} className="cursor-grab p-1 text-slate-400 hover:text-slate-600" aria-label={`Drag to reorder ${title}`}>
                            <GripVerticalIcon />
                        </span>
                    )}
                    <div className="text-indigo-600">{icon}</div>
                    <h3 className="text-lg font-semibold text-slate-800" aria-expanded={isOpen}>
                      {title}
                    </h3>
                </div>

                <div className="flex items-center gap-1">
                    {onToggleVisibility && (
                         <button
                            onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
                            className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            aria-label={isVisible ? `Hide ${title} section` : `Show ${title} section`}
                        >
                            {isVisible ? <EyeIcon /> : <EyeSlashIcon />}
                        </button>
                    )}
                    {removeSection && (
                         <button
                            onClick={(e) => { e.stopPropagation(); removeSection(); }}
                            className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            aria-label={`Remove ${title} section`}
                        >
                            <XCircleIcon />
                        </button>
                    )}
                    <div className="p-1" aria-label={isOpen ? 'Collapse section' : 'Expand section'}>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                            <ChevronDownIcon className="w-6 h-6 text-slate-400" />
                        </motion.div>
                    </div>
                </div>
            </div>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 border-t border-slate-200 bg-white">
                            {children}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
};

const FieldGroup: React.FC<{ children: React.ReactNode; label: string; htmlFor: string; error?: string; }> = ({ children, label, htmlFor, error }) => (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-600 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const Input: React.FC<{name: string, label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string, error?: string}> = ({ name, label, type = 'text', error, ...props }) => (
  <FieldGroup label={label} htmlFor={name} error={error}>
    <input
      type={type}
      name={name}
      id={name}
      {...props}
      className={formInputStyles(!!error)}
    />
  </FieldGroup>
);

const Textarea: React.FC<{
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  error?: string;
}> = ({ name, label, rows = 3, error, ...props }) => (
  <FieldGroup label={label} htmlFor={name} error={error}>
    <textarea
      name={name}
      id={name}
      rows={rows}
      {...props}
      className={formInputStyles(!!error)}
    />
  </FieldGroup>
);

const renderSectionForm = (
    sectionId: SectionType, 
    item: any, 
    dispatch: Dispatch<Action>,
    errors: Record<string, string>,
    handleValidation: (name: string, value: string) => void
) => {
    const handleItemChange = (field: string, value: string | number) => {
        dispatch({ type: 'UPDATE_SECTION_ITEM', payload: { sectionId, item: { ...item, [field]: value } } });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldNameOnly = name.split('.').pop() || '';
        handleValidation(name, value);
        handleItemChange(fieldNameOnly, value);
    };

    const uniqueName = (field: string) => `${sectionId}.${item.id}.${field}`;

    switch (sectionId) {
        case 'experience':
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <Input name={uniqueName("role")} label="Role" value={item.role} onChange={handleChange} placeholder="e.g., Senior Frontend Developer" error={errors[uniqueName("role")]} />
                        <Input name={uniqueName("company")} label="Company" value={item.company} onChange={handleChange} placeholder="e.g., Tech Solutions Inc." error={errors[uniqueName("company")]}/>
                        <Input name="startDate" label="Start Date" value={item.startDate} onChange={handleChange} placeholder="e.g., Jan 2020" />
                        <Input name="endDate" label="End Date" value={item.endDate} onChange={handleChange} placeholder="e.g., Present" />
                    </div>
                    <Textarea 
                        name="description" 
                        label="Description" 
                        value={item.description} 
                        onChange={handleChange} 
                        rows={4} 
                        placeholder="Describe your role, responsibilities, and key achievements." 
                    />
                </div>
            );
        case 'education':
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <Input name={uniqueName("institution")} label="Institution" value={item.institution} onChange={handleChange} placeholder="e.g., University of Technology" error={errors[uniqueName("institution")]} />
                        <Input name={uniqueName("degree")} label="Degree" value={item.degree} onChange={handleChange} placeholder="e.g., B.S. in Computer Science" error={errors[uniqueName("degree")]} />
                        <Input name="startDate" label="Start Date" value={item.startDate} onChange={handleChange} placeholder="e.g., Sep 2012" />
                        <Input name="endDate" label="End Date" value={item.endDate} onChange={handleChange} placeholder="e.g., May 2016" />
                    </div>
                </div>
            );
        case 'skills':
            const proficiencyLevels: SkillProficiency[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
            return (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                    <Input name={uniqueName("name")} label="Skill" value={item.name} onChange={handleChange} placeholder="e.g., React" error={errors[uniqueName("name")]} />
                    <FieldGroup label="Level" htmlFor="level">
                        <select
                            name="level"
                            id="level"
                            value={item.level}
                            onChange={handleChange}
                            className={formInputStyles(false)}
                        >
                            {proficiencyLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </FieldGroup>
                </div>
            );
         case 'projects':
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        <Input name={uniqueName("name")} label="Project Name" value={item.name} onChange={handleChange} placeholder="e.g., Portfolio Website" error={errors[uniqueName("name")]}/>
                        <Input name="link" label="Link" value={item.link} onChange={handleChange} placeholder="e.g., my-project.com" />
                    </div>
                    <Textarea 
                        name="description" 
                        label="Description" 
                        value={item.description} 
                        onChange={handleChange} 
                        rows={3} 
                        placeholder="Briefly describe the project and your role." 
                    />
                </div>
            );
        case 'languages':
            // FIX: Changed Language['proficiency'] to LanguageSkill['proficiency'] to use the correct, non-conflicting type.
            const languageProficiencyLevels: LanguageSkill['proficiency'][] = ['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'];
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                    <Input name={uniqueName("name")} label="Language" value={item.name} onChange={handleChange} placeholder="e.g., English" error={errors[uniqueName("name")]} />
                     <FieldGroup label="Proficiency" htmlFor="proficiency">
                        <select
                            name="proficiency"
                            id="proficiency"
                            value={item.proficiency}
                            onChange={handleChange}
                            className={formInputStyles(false)}
                        >
                            {languageProficiencyLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </FieldGroup>
                </div>
            );
        case 'interests':
            return (
                <Input name={uniqueName("name")} label="Interest" value={item.name} onChange={handleChange} placeholder="e.g., Open Source" error={errors[uniqueName("name")]}/>
            );
        default:
            return null;
    }
};

export default ResumeForm;