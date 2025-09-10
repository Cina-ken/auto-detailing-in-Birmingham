// components/Testimonials.tsx
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      color: "blue",
      rating: "⭐⭐⭐⭐⭐",
      comment: "Absolutely incredible service! My car looks better than when I first bought it. The team is professional and thorough."
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      color: "green",
      rating: "⭐⭐⭐⭐⭐",
      comment: "The ceramic coating is amazing! Water just rolls right off. Worth every penny and the convenience of mobile service is unbeatable."
    },
    {
      id: 3,
      name: "Lisa Chen",
      color: "purple",
      rating: "⭐⭐⭐⭐⭐",
      comment: "They transformed my dirty SUV into showroom condition. The before and after photos speak for themselves!"
    }
  ]

  return (
    <section className="py-20 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text" data-aos="fade-up">
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-gray-700 rounded-xl p-6"
              data-aos="fade-up"
              data-aos-delay={100 * (index + 1)}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-${testimonial.color}-500 rounded-full mr-4`}></div>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-yellow-400">{testimonial.rating}</div>
                </div>
              </div>
              <p className="text-gray-300">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials