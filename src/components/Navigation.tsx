// components/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false) // Close mobile menu after clicking
    }
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  const navItems = [
    { label: 'Services', section: 'services' },
    { label: 'Gallery', section: 'gallery' },
    { label: 'Get Quote', section: 'quote' },
  ]

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-effect backdrop-blur-md bg-gray-900/80' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 z-50">
            <Link href="/">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-2xl font-bold gradient-text hover:scale-105 transition-transform"
            >
              ShineWorks
            </button>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button 
                  key={item.section}
                  onClick={() => scrollToSection(item.section)} 
                  className="relative hover:text-blue-400 transition-colors px-3 py-2 text-sm font-medium group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
              <button 
                onClick={() => scrollToSection('contact')} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden z-50">
            
            <button
              onClick={toggleMenu}
              className={`relative w-8 h-8 flex flex-col justify-center items-center transition-all duration-300 ${
                isOpen ? 'rotate-0' : ''
              }`}
              aria-label="Toggle mobile menu"
            >
              {/* Hamburger lines */}
              <span 
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                }`}
              />
              <span 
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span 
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`md:hidden absolute top-0 left-0 w-full min-h-screen transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible'
        }`}
      >
        {/* Background overlay */}
        <div 
          className={`absolute inset-0 bg-gray-900/95 backdrop-blur-lg transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Menu content */}
        <div 
          className={`relative z-10 pt-20 pb-8 px-4 transition-all duration-300 ${
            isOpen ? 'translate-y-0' : '-translate-y-10'
          }`}
        >
          <div className="max-w-sm mx-auto space-y-6">
            {/* Mobile nav items */}
            {navItems.map((item, index) => (
              <button
                key={item.section}
                onClick={() => scrollToSection(item.section)}
                className={`block w-full text-left py-4 px-6 text-lg font-medium text-white hover:text-blue-400 transition-all duration-300 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transform hover:translate-x-2 ${
                  isOpen ? 'animate-fade-in-up' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-4 opacity-60"></span>
                  {item.label}
                </span>
              </button>
            ))}
            
            {/* Mobile CTA button */}
            <div className="pt-4">
              <button
                onClick={() => scrollToSection('contact')}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 px-6 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 ${
                  isOpen ? 'animate-fade-in-up' : ''
                }`}
                style={{ animationDelay: '400ms' }}
              >
                Book Now
              </button>
            </div>

            {/* Contact info in mobile menu */}
            <div 
              className={`pt-8 border-t border-white/10 ${
                isOpen ? 'animate-fade-in-up' : ''
              }`}
              style={{ animationDelay: '500ms' }}
            >
              <div className="space-y-4 text-center">
                <div>
                  <a 
                    href="tel:+1234567890" 
                    className="flex items-center justify-center space-x-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="text-xl">📞</span>
                    <span>(123) 456-7890</span>
                  </a>
                </div>
                <div>
                  <a 
                    href="https://wa.me/1234567890" 
                    className="flex items-center justify-center space-x-3 text-green-400 hover:text-green-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-xl">💬</span>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .glass-effect {
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </nav>
  )
}

export default Navigation