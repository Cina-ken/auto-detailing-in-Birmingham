// components/Hero.tsx
const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-bg flex items-center justify-center text-center relative">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 floating"
          data-aos="fade-up"
        >
          {"Bring Back That " + " "}
          <span className="gradient-text">Showroom Shine</span>
        </h1>

        <p
          className="text-xl md:text-2xl mb-8 text-gray-300"
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
            onClick={() => scrollToSection("contact")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 pulse-glow"
          >
            Book Now
          </button>
          <button
            onClick={() => scrollToSection("gallery")}
            className="glass-effect hover:bg-white/20 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
          >
            See Transformations
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
