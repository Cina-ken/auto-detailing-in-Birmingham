// components/Hero.tsx
const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-bg flex items-center justify-center text-center relative overflow-hidden min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Replace with your auto detailing video URL */}
          <source
            src="/videos/Video1.mp4"
            type="video/mp4"
          />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay to maintain text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Existing Content with enhanced contrast */}
      <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 floating text-white drop-shadow-2xl"
          data-aos="fade-up"
        >
          {"Bring Back That " + " "}
          <span className="gradient-text drop-shadow-lg">Showroom Shine</span>
        </h1>

        <p
          className="text-xl md:text-2xl mb-8 text-gray-100 drop-shadow-xl font-medium"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Premium Auto Detailing in Birmingham - We Come to You
        </p>
        
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <button
            onClick={() => scrollToSection("quote")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 pulse-glow shadow-2xl border border-white/20"
          >
            Get Your Instant Quote
          </button>
          <button
            onClick={() => scrollToSection("gallery")}
            className="glass-effect hover:bg-white/30 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-xl border border-white/30"
          >
            See Transformations
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;