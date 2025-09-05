import React from 'react';

const articles = [
  {
    title: 'How to Tailor Your Resume for Any Job',
    description: 'Learn the art of customizing your resume to match job descriptions and pass through Applicant Tracking Systems (ATS).',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800',
    category: 'Resume Writing',
  },
  {
    title: '5 Common Interview Questions and How to Answer Them',
    description: 'Prepare for your next interview by mastering these common questions with our expert tips and examples.',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800',
    category: 'Interviews',
  },
  {
    title: 'The Power of Networking: How to Build Connections',
    description: 'Discover effective strategies for building a professional network that can open doors to new opportunities.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800',
    category: 'Career Growth',
  },
  {
    title: 'Writing a Cover Letter That Stands Out',
    description: 'A great cover letter is more than just a summary of your resume. Here’s how to make yours compelling.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800',
    category: 'Job Search',
  },
];

const CareerAdvicePage: React.FC = () => {
  return (
    <div className="w-full bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">
          Expert Career Advice
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Actionable tips and insights to help you navigate your job search and advance your career.
        </p>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {articles.map((article, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative">
                <img className="h-56 w-full object-cover" src={article.image} alt={article.title} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm font-semibold text-indigo-600">{article.category}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="mt-3 text-slate-600 flex-grow">
                  {article.description}
                </p>
                <div className="mt-6">
                   <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CareerAdvicePage;
