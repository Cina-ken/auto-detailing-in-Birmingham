// components/Services.tsx
const Services = () => {
  const services = [
    {
      id: 1,
      title: "Express Wash",
      price: "$99",
      icon: "🚗",
      features: [
        "Exterior wash & dry",
        "Tire cleaning",
        "Window cleaning",
        "Quick interior vacuum"
      ],
      gradient: "from-gray-700 to-gray-800",
      buttonColor: "blue"
    },
    {
      id: 2,
      title: "Full Detailing",
      price: "$249",
      icon: "✨",
      features: [
        "Complete exterior detailing",
        "Deep interior cleaning",
        "Leather conditioning",
        "Engine bay cleaning",
        "Paint protection wax"
      ],
      gradient: "from-purple-700 to-purple-800",
      buttonColor: "purple",
      popular: true
    },
    {
      id: 3,
      title: "Ceramic Coating",
      price: "$899",
      icon: "💎",
      features: [
        "Full paint correction",
        "Professional ceramic coating",
        "2-year protection warranty",
        "Hydrophobic finish",
        "UV protection"
      ],
      gradient: "from-yellow-600 to-orange-600",
      buttonColor: "orange"
    }
  ]


  // Scroll to contact section
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section className="py-20 bg-gray-800" id="services">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text" data-aos="fade-up">
          Our Premium Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`bg-gradient-to-b ${service.gradient} rounded-xl p-8 text-center transform hover:scale-105 transition-all hover:shadow-2xl ${service.popular ? 'border-2 border-purple-500' : ''}`}
              data-aos="fade-up"
              data-aos-delay={100 * (index + 1)}
            >
              {service.popular && (
                <div className="text-sm font-bold text-purple-300 mb-2">MOST POPULAR</div>
              )}
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <div className="text-3xl font-bold text-blue-400 mb-4">{service.price}</div>
              <ul className="text-gray-300 space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button 
                onClick={scrollToContact}
                className={`w-full bg-${service.buttonColor}-600 hover:bg-${service.buttonColor}-700 py-3 rounded-lg font-semibold transition-colors`}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services