import React from "react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      question: "How does the AI generate summaries from PDFs?",
      answer:
        "Our AI analyzes your uploaded PDF, understands context, and extracts key concepts to generate clear, concise summaries in seconds.",
    },
    {
      question: "Can I create flashcards and quizzes from my documents?",
      answer:
        "Yes. Flashcards and quizzes are automatically generated from your document content to help reinforce learning and test understanding.",
    },
    {
      question: "Is my uploaded data secure?",
      answer:
        "Absolutely. Your documents are securely stored and processed with strict access controls to ensure privacy and safety.",
    },
    {
      question: "Can I use this on mobile and tablets?",
      answer:
        "Yes, the platform is fully responsive and works smoothly across desktops, tablets, and mobile devices.",
    },
  ];

  return (
    <section
      id="faq"
      className="relative py-20 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        {/* Image */}
        <img
          className="max-w-sm w-full rounded-2xl border border-slate-700/50 object-cover"
          src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830"
          alt="FAQ"
        />

        {/* Content */}
        <div className="w-full">
          <button className="px-4 h-8 mb-3 border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs rounded-lg">
            FAQ
          </button>

          <h2 className="text-3xl md:text-4xl font-semibold">
            Got questions? We’ve got answers.
          </h2>

          <p className="text-slate-400 text-sm mt-4 max-w-lg">
            Everything you need to know about learning smarter with AI-powered
            summaries, flashcards, and quizzes.
          </p>

          {/* Accordion */}
          <div className="mt-6 space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="group cursor-pointer border-b border-slate-700/50 py-4"
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-base font-medium transition-colors ${
                      openIndex === index
                        ? "text-cyan-300"
                        : "text-slate-200 group-hover:text-white"
                    }`}
                  >
                    {faq.question}
                  </h3>

                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-300 ${
                      openIndex === index ? "rotate-180 text-cyan-400" : "text-slate-400"
                    }`}
                  >
                    <path
                      d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openIndex === index
                      ? "max-h-40 opacity-100 pt-3"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
