import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      date: "Jun 10, 2026",
      text: "“This AI study tool turned my bulky PDFs into clean summaries and flashcards. Studying before exams is insanely faster now.”",
      name: "Aarav Sharma",
      role: "Computer Science Student",
      img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    },
    {
      id: 2,
      date: "Jun 12, 2026",
      text: "“The quizzes adapt to what I don’t know. It feels like a personal tutor made just for my syllabus.”",
      name: "Neha Patel",
      role: "Engineering Student",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    },
    {
      id: 3,
      date: "Jun 15, 2026",
      text: "“Uploading notes and instantly getting summaries + flashcards saved me hours every week.”",
      name: "Rohit Verma",
      role: "Medical Aspirant",
      img: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    },
    {
      id: 4,
      date: "Jul 02, 2026",
      text: "“The AI explanations make complex topics feel simple. Perfect for last-minute revision.”",
      name: "Simran Kaur",
      role: "BCA Student",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    },
    {
      id: 5,
      date: "Jul 10, 2026",
      text: "“This app completely changed how I learn from PDFs. It’s structured, smart, and addictive.”",
      name: "Aditya Singh",
      role: "Final Year Student",
      img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 3 >= testimonials.length ? 0 : prev + 3));
  const handlePrev = () =>
    setCurrentIndex((prev) =>
      prev - 3 < 0 ? Math.max(testimonials.length - 3, 0) : prev - 3
    );

  return (
    <section
      id="testimonials"
      className="relative py-20 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <button className="px-4 h-8 border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs rounded-lg mb-4">
          Testimonials
        </button>

        <h2 className="text-3xl md:text-[40px]/12 font-semibold text-center">
          Loved by Students
        </h2>
        <p className="text-slate-400 text-center max-w-xl mx-auto mt-3">
          See how students are learning smarter with AI-powered summaries,
          flashcards, and quizzes.
        </p>

        <div className="hidden md:flex justify-end gap-2 mt-6">
          <button
            onClick={handlePrev}
            className="h-10 w-10 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-cyan-500/50"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="h-10 w-10 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-cyan-500/50"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {testimonials
            .slice(currentIndex, isMobile ? currentIndex + 1 : currentIndex + 3)
            .map((item) => (
              <div
                key={item.id}
                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:-translate-y-2 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10 space-y-4">
                  <p className="text-sm/6 text-slate-300">{item.text}</p>

                  <div className="flex items-center gap-4 pt-4">
                    <img
                      src={item.img}
                      className="w-12 h-12 rounded-full object-cover"
                      alt=""
                    />
                    <div>
                      <p className="text-sm text-slate-100">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
