import React from 'react'

const Features = () => {
 const featuresData = [
        {
            icon: <svg className='text-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
            title: "AI Summaries",
            description: "Upload any PDF and get instant, comprehensive summaries that capture key concepts and main ideas in seconds."
        },
        {
            icon: <svg className='text-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>,
            title: "Smart Flashcards",
            description: "Automatically generated flashcards from your documents help reinforce learning and improve memory retention."
        },
        {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
            title: "Adaptive Quizzes",
            description: "AI-generated quizzes test your knowledge and adapt to your learning pace, ensuring you master every topic."
        },
        {
            icon: <svg className='text-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
            title: "Multi-Format Support",
            description: "Upload PDFs, textbooks, research papers, or lecture notes - our AI understands them all."
        },
        {
            icon: <svg className='text-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>,
            title: "Study Insights",
            description: "Track your progress, identify weak areas, and get personalized recommendations to optimize your learning journey."
        },
        {
            icon: <svg className='text-white' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
            title: "24/7 AI Tutor",
            description: "Ask questions about your materials anytime and get instant, detailed explanations to deepen your understanding."
        }
    ];

    return (
        <>
            <style>
                {`@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

                * {
                    font-family: "Poppins", sans-serif;
                }`}
            </style>

            <section id="features" className="relative py-20 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-center items-center gap-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                <button className='px-4 h-8 border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all duration-300'>
                    Features
                </button>
                <h2 className="text-3xl md:text-[40px]/12 font-semibold text-slate-50 max-w-2xl text-center leading-tight">
                    Transform Any PDF Into Your Personal Study Guide
                </h2>
                <p className='text-base/7 text-slate-400 max-w-2xl text-center'>
                    Upload, learn, and master any subject with AI-powered summaries, flashcards, and quizzes designed for how you learn best.
                </p>
                <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {featuresData.map((feature, index) => (
                        <div 
                            key={index} 
                            className='group relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 space-y-3 hover:-translate-y-2 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20'
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <p className='font-semibold text-lg text-slate-50 mt-4'>{feature.title}</p>
                                <p className='text-sm/6 text-slate-400'>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Features