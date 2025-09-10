// app/page.tsx
'use client'


import { useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import SliderSection from '@/components/SliderSection'
import QuoteCalculator from '@/components/QuoteCalculator'
import Services from '@/components/Services'
import Gallery from '@/components/Gallery'
import Testimonials from '@/components/Testimonials'
import WhyChooseUs from '@/components/WhyChooseUs'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  useEffect(() => {
    // Initialize AOS animation
    import('aos').then((AOS) => {
      AOS.init({
        duration: 1000,
        once: true
      })
    })

    // Set minimum date to today for date inputs
    const today = new Date().toISOString().split('T')[0]
    const dateInputs = document.querySelectorAll('input[type="date"]')
    dateInputs.forEach(input => {
      (input as HTMLInputElement).min = today
    })
  }, [])

  return (
    <main className="bg-gray-900 text-white">
      <Navigation />
      <Hero />
      <SliderSection />
      <QuoteCalculator />
      <Services />
      <Gallery />
      <Testimonials />
      <WhyChooseUs />
      <ContactSection />
      <Footer />
    </main>
  )
}