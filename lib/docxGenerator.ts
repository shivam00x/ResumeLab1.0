import { 
    Document, 
    Packer, 
    Paragraph, 
    TextRun, 
    AlignmentType, 
    TabStopType, 
    TabStopPosition, 
    BorderStyle 
} from 'docx';
// FIX: Changed import from Language to LanguageSkill to match the updated type definition.
import { ResumeData, Theme, FontFamily, Certification, Education, Experience, Interest, LanguageSkill, Project, Skill } from '../types';

const FONT_FAMILIES: Record<FontFamily, string> = {
  sans: 'Inter',
  serif: 'Merriweather',
  roboto: 'Roboto',
  lato: 'Lato',
  playfair: 'Playfair Display',
  montserrat: 'Montserrat',
  'open-sans': 'Open Sans',
  raleway: 'Raleway',
  oswald: 'Oswald',
  poppins: 'Poppins',
  'nunito-sans': 'Nunito Sans',
  'source-sans-pro': 'Source Sans Pro',
  lora: 'Lora',
  'pt-serif': 'PT Serif',
  'libre-baskerville': 'Libre Baskerville',
  'eb-garamond': 'EB Garamond',
  arimo: 'Arimo',
  tinos: 'Tinos',
  'fira-sans': 'Fira Sans',
  cardo: 'Cardo',
};

// Helper to create paragraphs from text that might contain newlines, preserving them in the docx.
const createParagraphsFromText = (text: string, options: any) => {
    return text.split('\n').map(line => new Paragraph({
        children: [new TextRun({ text: line, ...options })],
        spacing: { after: 100 }
    }));
};


export const generateDocx = async (resumeData: ResumeData, theme: Theme, font: FontFamily): Promise<void> => {
    const { personalInfo, summary, sections } = resumeData;
    const fontFamily = FONT_FAMILIES[font] || 'Inter';
    const primaryColor = theme.primaryColor.replace('#', '');

    const docChildren: any[] = [];

    // --- Header / Personal Info ---
    docChildren.push(new Paragraph({
        children: [new TextRun({ text: personalInfo.name || 'Your Name', font: fontFamily, size: 48, bold: true, color: primaryColor })],
        alignment: AlignmentType.CENTER,
    }));
    docChildren.push(new Paragraph({
        children: [new TextRun({ text: personalInfo.title || 'Your Title', font: fontFamily, size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
    }));
    const contactParts = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.website, personalInfo.linkedin, personalInfo.github].filter(Boolean);
    docChildren.push(new Paragraph({
        children: [new TextRun({ text: contactParts.join(' | '), font: fontFamily, size: 20 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
    }));

    // --- Summary ---
    if (summary) {
        docChildren.push(new Paragraph({
            children: [new TextRun({ text: 'Summary', font: fontFamily, size: 28, bold: true, color: primaryColor })],
            spacing: { after: 150, before: 300 },
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
        }));
        docChildren.push(...createParagraphsFromText(summary, { font: fontFamily, size: 22 }));
    }

    // --- Sections ---
    const visibleSections = sections.filter(s => s.isVisible);
    
    visibleSections.filter(s => s.id !== 'interests').forEach(section => {
        if (section.items.length === 0) return;
        
        docChildren.push(new Paragraph({
            children: [new TextRun({ text: section.title, font: fontFamily, size: 28, bold: true, color: primaryColor })],
            spacing: { after: 150, before: 300 },
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
        }));

        section.items.forEach(item => {
            switch (section.id) {
                case 'experience': {
                    const exp = item as Experience;
                    docChildren.push(new Paragraph({
                        children: [
                            new TextRun({ text: `${exp.role} - ${exp.company}`, font: fontFamily, size: 22, bold: true }),
                            new TextRun({ text: `\t${exp.startDate} - ${exp.endDate}`, font: fontFamily, size: 20 }),
                        ],
                        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                        spacing: { after: 50 },
                    }));
                    if (exp.description) {
                        docChildren.push(...createParagraphsFromText(exp.description, { font: fontFamily, size: 20, italics: true }));
                    }
                    break;
                }
                case 'education': {
                    const edu = item as Education;
                    docChildren.push(new Paragraph({
                        children: [
                            new TextRun({ text: edu.institution, font: fontFamily, size: 22, bold: true }),
                            new TextRun({ text: `\t${edu.startDate} - ${edu.endDate}`, font: fontFamily, size: 20 }),
                        ],
                        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                    }));
                    docChildren.push(new Paragraph({
                        children: [new TextRun({ text: edu.degree, font: fontFamily, size: 20, italics: true })],
                        spacing: { after: 200 }
                    }));
                    break;
                }
                case 'skills': {
                    const skill = item as Skill;
                    docChildren.push(new Paragraph({
                        children: [
                            new TextRun({ text: `${skill.name}: `, font: fontFamily, size: 22, bold: true }),
                            new TextRun({ text: skill.level, font: fontFamily, size: 22 })
                        ],
                        spacing: { after: 100 }
                    }));
                    break;
                }
                case 'projects': {
                    const proj = item as Project;
                    docChildren.push(new Paragraph({
                        children: [new TextRun({ text: proj.name, font: fontFamily, size: 22, bold: true })],
                    }));
                     if (proj.link) {
                        docChildren.push(new Paragraph({
                            children: [new TextRun({ text: proj.link, font: fontFamily, size: 20, color: '0000FF', underline: { type: 'single', color: '0000FF' } })],
                        }));
                    }
                    if (proj.description) {
                        docChildren.push(...createParagraphsFromText(proj.description, { font: fontFamily, size: 20, italics: true }));
                    }
                    break;
                }
                case 'certifications': {
                    const cert = item as Certification;
                    docChildren.push(new Paragraph({
                        children: [new TextRun({ text: `${cert.name} - ${cert.issuer} (${cert.date})`, font: fontFamily, size: 22 })],
                        spacing: { after: 100 }
                    }));
                    break;
                }
                case 'languages': {
                    // FIX: Changed type cast from Language to LanguageSkill to match updated type.
                    const lang = item as LanguageSkill;
                    docChildren.push(new Paragraph({
                        children: [
                            new TextRun({ text: `${lang.name}: `, font: fontFamily, size: 22, bold: true }),
                            new TextRun({ text: lang.proficiency, font: fontFamily, size: 22 })
                        ],
                        spacing: { after: 100 }
                    }));
                    break;
                }
            }
        });
    });

    const interestsSection = visibleSections.find(s => s.id === 'interests');
    if (interestsSection && interestsSection.items.length > 0) {
        docChildren.push(new Paragraph({
            children: [new TextRun({ text: interestsSection.title, font: fontFamily, size: 28, bold: true, color: primaryColor })],
            spacing: { after: 150, before: 300 },
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
        }));
        const interestNames = interestsSection.items.map(i => (i as Interest).name).join(', ');
        docChildren.push(new Paragraph({ children: [new TextRun({ text: interestNames, font: fontFamily, size: 22 })] }));
    }

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5 inch margins
                },
            },
            children: docChildren,
        }],
    });

    try {
        const blob = await Packer.toBlob(doc);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const fileName = `${resumeData.personalInfo.name.replace(/\s/g, '_') || 'resume'}.docx`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error generating DOCX:", error);
        throw error;
    }
};