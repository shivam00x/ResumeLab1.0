import React from 'react';

interface CVPageProps {
  onNavigateToEditor: () => void;
}

const CVPage: React.FC<CVPageProps> = ({ onNavigateToEditor }) => {
  return (
    <div className="w-full bg-white pb-20">
      {/* Hero Section */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Craft a Comprehensive Curriculum Vitae (CV)
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
          Ideal for academic, scientific, or international applications, a CV provides a detailed overview of your professional life.
        </p>
        <button
          onClick={onNavigateToEditor}
          className="mt-8 px-8 py-3 text-base font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transform transition-all duration-300"
        >
          Start Building Your CV
        </button>
      </section>

      {/* Main Content Section */}
      <section className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: What is a CV? */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">What is a CV?</h2>
            <p className="text-slate-600 space-y-4">
              <span>
                A Curriculum Vitae (Latin for "course of life") is a detailed document that provides a full history of your academic and professional accomplishments. Unlike a resume, which is a brief, one-to-two-page summary, a CV can be much longer.
              </span>
              <span>
                It's the standard format for job applications in academia and is also commonly used for international job searches.
              </span>
            </p>
          </div>
          
          {/* Right Column: Key Differences */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Resume vs. CV: Key Differences</h2>
            <ul className="list-disc list-inside space-y-3 text-slate-600">
              <li>
                <strong className="font-semibold text-slate-700">Length:</strong> Resumes are concise (1-2 pages), while CVs are detailed and can be multiple pages.
              </li>
              <li>
                <strong className="font-semibold text-slate-700">Content:</strong> Resumes are tailored to a specific job. CVs provide a comprehensive history of your academic credentials.
              </li>
              <li>
                <strong className="font-semibold text-slate-700">Purpose:</strong> Resumes are for industry jobs. CVs are for academic, research, and medical roles.
              </li>
            </ul>
          </div>
        </div>

        {/* What to Include Section */}
        <div className="mt-20">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">What to Include in Your CV</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-slate-700">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">Contact Information</div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">Research Interests</div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">Education</div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">Publications</div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">Teaching Experience</div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">Research Experience</div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">Awards and Honors</div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">Professional Memberships</div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default CVPage;
