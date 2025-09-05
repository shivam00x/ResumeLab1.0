import { useReducer, useEffect } from 'react';
import { INITIAL_RESUME_DATA } from '../constants';
import { Action, ResumeData, Section } from '../types';

const RESUME_STORAGE_KEY = 'resumeLabData';

const resumeReducer = (state: ResumeData, action: Action): ResumeData => {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personalInfo: { ...state.personalInfo, ...action.payload } };
    case 'UPDATE_SUMMARY':
      return { ...state, summary: action.payload };
    case 'ADD_SECTION':
        if (state.sections.find(s => s.id === action.payload.section.id)) {
            return state; // Avoid adding duplicate sections
        }
        return {
            ...state,
            sections: [...state.sections, action.payload.section]
        };
    case 'REMOVE_SECTION':
        return {
            ...state,
            sections: state.sections.filter(section => section.id !== action.payload.sectionId)
        };
    case 'ADD_SECTION_ITEM': {
        const { sectionId, item } = action.payload;
        return {
            ...state,
            sections: state.sections.map(section =>
                section.id === sectionId ? { ...section, items: [...section.items, item] } : section
            )
        };
    }
    case 'UPDATE_SECTION_ITEM': {
        const { sectionId, item: updatedItem } = action.payload;
        return {
            ...state,
            sections: state.sections.map(section =>
                section.id === sectionId
                    ? { ...section, items: section.items.map(item => item.id === updatedItem.id ? updatedItem : item) }
                    : section
            )
        };
    }
    case 'REMOVE_SECTION_ITEM': {
        const { sectionId, itemId } = action.payload;
        return {
            ...state,
            sections: state.sections.map(section =>
                section.id === sectionId ? { ...section, items: section.items.filter(item => item.id !== itemId) } : section
            )
        };
    }
    case 'REORDER_SECTIONS': {
        const { startIndex, endIndex } = action.payload;
        const newSections = Array.from(state.sections);
        const [removed] = newSections.splice(startIndex, 1);
        newSections.splice(endIndex, 0, removed);
        return { ...state, sections: newSections };
    }
    case 'TOGGLE_SECTION_VISIBILITY': {
        const { sectionId } = action.payload;
        return {
            ...state,
            sections: state.sections.map(section =>
                section.id === sectionId ? { ...section, isVisible: !section.isVisible } : section
            )
        };
    }
    default:
      return state;
  }
};

const initializer = (): ResumeData => {
    try {
        const savedData = localStorage.getItem(RESUME_STORAGE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData) as ResumeData;
             // Ensure backward compatibility for isVisible property
            if (parsedData.sections) {
                parsedData.sections = parsedData.sections.map((section: Section<any>) => ({
                    ...section,
                    isVisible: section.isVisible !== false, // Default to true if undefined or true
                }));
            }
            return parsedData;
        }
    } catch (error) {
        console.error("Failed to load resume data from localStorage:", error);
        localStorage.removeItem(RESUME_STORAGE_KEY);
    }
    return INITIAL_RESUME_DATA;
};

export const useResume = () => {
  const [state, dispatch] = useReducer(resumeReducer, undefined, initializer);

  useEffect(() => {
    try {
        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Could not save resume data to localStorage", error);
    }
  }, [state]);

  return { state, dispatch };
};