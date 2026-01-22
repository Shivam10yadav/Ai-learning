import React from 'react'

const FAQ = () => {
    const [openIndex, setOpenIndex] = React.useState(null);

    const faqs = [
        {
            question: "How to use this component?",
            answer: "To use this component, you need to import it in your project and use it in your JSX code. Here's an example of how to use it:",
        },
        {
            question: "Are there any other components available?",
            answer: "Yes, there are many other components available in this library. You can find them in the 'Components' section of the website.",
        },
        {
            question: "Are components responsive?",
            answer: "Yes, all components are responsive and can be used on different screen sizes.",
        },
        {
            question: "Can I customize the components?",
            answer: "Yes, you can customize the components by passing props to them. You can find more information about customizing components in the 'Customization' section of the website.",
        },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                * { font-family: 'Poppins', sans-serif; }
            `}</style>
            
            {/* Main Section Background set to Black to match Testimonials */}
            <section id="faq" className="bg-black py-20 px-4 md:px-0">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-center gap-12">
                    
                    {/* Image */}
                    <img
                        className="max-w-sm w-full rounded-2xl h-auto border border-neutral-800 object-cover"
                        src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop"
                        alt="FAQ Illustration"
                    />
                    
                    {/* Text Content */}
                    <div className="w-full">
                        <p className="text-indigo-400 text-sm font-medium mb-2">FAQ's</p>
                        <h1 className="text-3xl md:text-4xl font-medium text-white">Looking for answers?</h1>
                        <p className="text-sm text-gray-400 mt-4 pb-6 leading-relaxed">
                            Ship Beautiful Frontends Without the Overhead — Customizable, Scalable and Developer-Friendly UI Components.
                        </p>
                        
                        {/* Accordion Items */}
                        <div className="space-y-2">
                            {faqs.map((faq, index) => (
                                <div 
                                    className="border-b border-neutral-800 py-4 cursor-pointer group" 
                                    key={index} 
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className={`text-base font-medium transition-colors duration-300 ${openIndex === index ? "text-indigo-400" : "text-gray-200 group-hover:text-white"}`}>
                                            {faq.question}
                                        </h3>
                                        <svg 
                                            width="18" 
                                            height="18" 
                                            viewBox="0 0 18 18" 
                                            fill="none" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out opacity-70 group-hover:opacity-100`}
                                        >
                                            {/* Changed stroke to white/gray for dark mode */}
                                            <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="currentColor" className="text-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div 
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-[300px] opacity-100 pt-4" : "max-h-0 opacity-0"}`}
                                    >
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default FAQ;