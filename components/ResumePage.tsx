import React from 'react';

interface ResumePageProps {
  onNavigateToEditor: () => void;
}

const templates = [
  { name: 'Modern Two-Column', src: 'https://d.novoresume.com/images/doc/functional-resume-template.png' },
  { name: 'Creative Bold', src: 'https://d.novoresume.com/images/doc/creative-resume-template.png' },
  { name: 'Classic Chronological', src: 'https://d.novoresume.com/images/doc/simple-resume-template.png' },
  { name: 'Tech Innovator', src: 'https://d.novoresume.com/images/doc/professional-resume-template.png' },
];

const ResumePage: React.FC<ResumePageProps> = ({ onNavigateToEditor }) => {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Build a Job-Winning Resume in Minutes
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Choose from our professionally designed, ATS-friendly templates to create a resume that stands out to recruiters.
        </p>
        <button
          onClick={onNavigateToEditor}
          className="mt-8 px-8 py-3 text-base font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Your Resume Now
        </button>
      </section>

      {/* Template Gallery */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          Templates for Every Career Path
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {templates.map((template) => (
            <div key={template.name} className="group cursor-pointer">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200 group-hover:shadow-2xl transition-shadow duration-300">
                <img src={template.src} alt={template.name} className="w-full object-cover" />
              </div>
              <h3 className="mt-4 text-center font-semibold text-slate-700">{template.name}</h3>
            </div>
          ))}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 font-bold text-2xl mb-4">1</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Choose a Template</h3>
            <p className="text-slate-600">Select a professionally designed template that fits your style and industry.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 font-bold text-2xl mb-4">2</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Fill in Your Details</h3>
            <p className="text-slate-600">Use our intuitive form to add your experience, skills, and education.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 font-bold text-2xl mb-4">3</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Download & Apply</h3>
            <p className="text-slate-600">Export your finished resume as a high-quality PDF or DOCX file.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumePage;
