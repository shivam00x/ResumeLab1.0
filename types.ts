import { ReactNode } from "react";

// FIX: Removed self-import of `PersonalInfo` which was causing a conflict with its own declaration.
export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  profilePicture: string | null;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id:string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  details: string;
}

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Skill {
  id: string;
  name: string;
  level: SkillProficiency;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

// FIX: Renamed interface from Language to LanguageSkill to avoid conflict with the Language type alias for i18n.
export interface LanguageSkill {
    id: string;
    name: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

export interface Interest {
    id: string;
    name: string;
}

export type SectionType = 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'interests';

// FIX: Updated SectionItem to use LanguageSkill instead of the conflicting Language interface.
export type SectionItem = Experience | Education | Skill | Project | Certification | LanguageSkill | Interest;

export interface Section<T extends SectionItem> {
  id: SectionType;
  title: string;
  items: T[];
  isVisible?: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  sections: Section<SectionItem>[];
}

export type Action =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: Partial<PersonalInfo> }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'ADD_SECTION'; payload: { section: Section<SectionItem> } }
  | { type: 'REMOVE_SECTION'; payload: { sectionId: SectionType } }
  | { type: 'ADD_SECTION_ITEM'; payload: { sectionId: SectionType; item: SectionItem } }
  | { type: 'UPDATE_SECTION_ITEM'; payload: { sectionId: SectionType; item: SectionItem } }
  | { type: 'REMOVE_SECTION_ITEM'; payload: { sectionId: SectionType; itemId: string } }
  | { type: 'REORDER_SECTIONS'; payload: { startIndex: number; endIndex: number } }
  | { type: 'TOGGLE_SECTION_VISIBILITY'; payload: { sectionId: SectionType } };

export type TemplateId = 
  | 'classic' 
  | 'ats-minimal' 
  | 'modern-two-column' 
  | 'creative-bold' 
  | 'executive-summary' 
  | 'tech-innovator' 
  | 'academic-cv' 
  | 'fresher-skills-first' 
  | 'info-sidebar' 
  | 'corporate-header';

export interface Theme {
    name: string;
    primaryColor: string;
    secondaryColor: string;
}

export type FontFamily =
  | 'sans' // Inter
  | 'serif' // Merriweather
  | 'roboto'
  | 'lato'
  | 'playfair' // Playfair Display
  | 'montserrat'
  | 'open-sans'
  | 'raleway'
  | 'oswald'
  | 'poppins'
  | 'nunito-sans'
  | 'source-sans-pro'
  | 'lora'
  | 'pt-serif'
  | 'libre-baskerville'
  | 'eb-garamond'
  | 'arimo'
  | 'tinos'
  | 'fira-sans'
  | 'cardo';

export type View = 'home' | 'about' | 'editor' | 'resume' | 'cv' | 'cover-letter' | 'career-advice';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi';