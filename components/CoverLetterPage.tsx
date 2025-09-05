import React from 'react';

const CoverLetterPage: React.FC = () => {
  return (
    <div className="w-full bg-white pb-20">
      {/* Hero Section */}
      <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Write a Cover Letter That Gets Noticed
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
          A great cover letter tells your story and connects your skills to the job you want. Learn how to write one that complements your resume.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
          The Structure of a Professional Cover Letter
        </h2>
        
        <div className="space-y-8">
          {/* Section 1: Header */}
          <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl">1</div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold text-slate-800">Contact Information</h3>
              <p className="mt-1 text-slate-600">Include your name, phone number, email, and a link to your LinkedIn or portfolio. Follow this with the date and the employer's contact information.</p>
            </div>
          </div>
          
          {/* Section 2: Introduction */}
           <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl">2</div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold text-slate-800">Introduction</h3>
              <p className="mt-1 text-slate-600">Address the hiring manager by name. State the position you're applying for and where you saw the job posting. Grab their attention with a compelling opening sentence about your enthusiasm for the role.</p>
            </div>
          </div>

          {/* Section 3: Body Paragraphs */}
           <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl">3</div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold text-slate-800">Body Paragraphs (2-3)</h3>
              <p className="mt-1 text-slate-600">This is where you make your case. Connect your skills and experiences directly to the job requirements listed in the description. Use specific examples and quantify your achievements whenever possible.</p>
            </div>
          </div>

          {/* Section 4: Closing */}
           <div className="flex items-start">
            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl">4</div>
            <div className="ml-6">
              <h3 className="text-xl font-semibold text-slate-800">Closing Paragraph & Sign-off</h3>
              <p className="mt-1 text-slate-600">Reiterate your interest in the role and the company. State your confidence in your ability to contribute. Thank the hiring manager for their time and consideration, and end with a professional closing like "Sincerely," followed by your name.</p>
            </div>
          </div>
        </div>

        {/* Example Snippet */}
        <div className="mt-20 bg-slate-50 border border-slate-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">Example Snippet</h3>
            <p className="font-serif text-slate-700 italic leading-relaxed">
                "In my previous role at Tech Solutions Inc., I led a project that increased user engagement by 25% by implementing a new feature based on customer feedback. My experience in both frontend development and user-centric design aligns perfectly with the requirements for the Senior Developer position at your company. I am confident that my skills in React and my passion for creating intuitive user interfaces would make me a valuable asset to your team."
            </p>
        </div>
      </section>
    </div>
  );
};

export default CoverLetterPage;
