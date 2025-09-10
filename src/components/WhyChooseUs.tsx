// components/WhyChooseUs.tsx
const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: "🚗",
      title: "Mobile Service",
      description: "We come to you! No need to leave your home or office."
    },
    {
      id: 2,
      icon: "🌱",
      title: "Eco-Friendly",
      description: "Safe, biodegradable products that protect your car and the environment."
    },
    {
      id: 3,
      icon: "👨‍🔧",
      title: "Expert Team",
      description: "5+ years experience with certified professionals."
    },
    {
      id: 4,
      icon: "✅",
      title: "Satisfaction Guaranteed",
      description: "100% satisfaction guarantee or we'll make it right."
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text" data-aos="fade-up">
          Why Choose ShineWorks?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className="text-center"
              data-aos="fade-up"
              data-aos-delay={100 * (index + 1)}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs