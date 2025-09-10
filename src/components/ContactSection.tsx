// components/ContactSection.tsx
'use client'

import React, { useState } from 'react'
import { sendEmail, initEmailJS } from '../lib/email'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    notes: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  // Initialize EmailJS (only once on client)
  React.useEffect(() => {
    initEmailJS();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      // Align template params with EmailJS template fields
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone_number: formData.phone,
        service_package: formData.service,
        preferred_date: formData.date,
        additional_notes: formData.notes,
        submission_date: new Date().toLocaleString(),
      };
      await sendEmail(templateParams);
      setSubmitMessage('Thank you for your booking request! We will contact you shortly.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        date: '',
        notes: ''
      });
    } catch {
      setSubmitMessage('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
      // Clear the message after 3 seconds
      setTimeout(() => setSubmitMessage(null), 3000);
    }
  }

  return (
    <section className="py-20 bg-gray-900" id="contact">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text" data-aos="fade-up">
          Book Your Service Today
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-effect rounded-xl p-8" data-aos="fade-right">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Service Needed</label>
                  <select 
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option value="Express Wash">Express Wash - $99</option>
                    <option value="Full Detailing">Full Interior & Exterior - $249</option>
                    <option value="Ceramic Coating">Ceramic Coating - $899</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Date</label>
                  <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3} 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Tell us about your vehicle or special requirements..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 pulse-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Book My Service'}
                </button>
                {submitMessage && (
                  <p className={`mt-4 text-center ${submitMessage.startsWith('Thank') ? 'text-green-400' : 'text-red-400'}`}>{submitMessage}</p>
                )}
              </div>
            </form>
          </div>
          
          {/* Contact Info & Map */}
          <div className="space-y-8" data-aos="fade-left">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📞</div>
                  <div>
                    <div className="font-semibold">Call Us</div>
                    <a href="tel:+1234567890" className="text-blue-400 hover:underline">(123) 456-7890</a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-2xl mr-4">💬</div>
                  <div>
                    <div className="font-semibold">WhatsApp</div>
                    <a href="https://wa.me/1234567890" className="text-green-400 hover:underline">Quick Chat</a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📧</div>
                  <div>
                    <div className="font-semibold">Email</div>
                    <a href="mailto:info@shineworks.com" className="text-blue-400 hover:underline">info@shineworks.com</a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📍</div>
                  <div>
                    <div className="font-semibold">Service Area</div>
                    <div className="text-gray-300">Birmingham & Surrounding Areas</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-semibold mb-3">Business Hours</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>8:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Service Area Map */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Our Service Area</h3>
              <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <rect fill="#374151" width="400" height="200"/>
                  <circle fill="#3B82F6" cx="200" cy="100" r="50" opacity="0.3"/>
                  <circle fill="#3B82F6" cx="200" cy="100" r="30" opacity="0.5"/>
                  <circle fill="#3B82F6" cx="200" cy="100" r="10"/>
                  <text x="200" y="105" textAnchor="middle" fill="white" fontSize="12">Birmingham</text>
                  <text x="200" y="170" textAnchor="middle" fill="#9CA3AF" fontSize="10">25 mile service radius</text>
                </svg>
              </div>
              <p className="text-sm text-gray-400 mt-3">We proudly serve Birmingham and all surrounding areas within a 25-mile radius. Mobile service available!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection