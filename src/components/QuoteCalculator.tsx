// components/QuoteCalculator.tsx
'use client'

import React, { useState, useCallback, useMemo } from 'react'
import emailjs from '@emailjs/browser';
import { z } from 'zod'

// Types
interface ServicePackage {
  value: string
  label: string
  basePrice: number
  description?: string
}

interface VehicleType {
  value: string
  label: string
  multiplier: number
}

interface AddonOption {
  value: string
  label: string
  price: number
}

interface QuoteBreakdown {
  total: number
  breakdown: string[]
  isValid: boolean
}

interface FormData {
  name: string
  phone: string
  email: string
}

// Constants
const VEHICLE_TYPES: VehicleType[] = [
  { value: 'sedan', label: 'Sedan/Coupe', multiplier: 1 },
  { value: 'suv', label: 'SUV/Crossover', multiplier: 1.2 },
  { value: 'truck', label: 'Truck/Van', multiplier: 1.3 },
] as const

const SERVICE_PACKAGES: ServicePackage[] = [
  { 
    value: 'basic', 
    label: 'Express Wash', 
    basePrice: 99,
    description: 'Quick exterior wash and dry'
  },
  { 
    value: 'full', 
    label: 'Full Interior & Exterior', 
    basePrice: 249,
    description: 'Complete interior and exterior detailing'
  },
  { 
    value: 'ceramic', 
    label: 'Ceramic Coating', 
    basePrice: 899,
    description: 'Premium ceramic coating protection'
  },
] as const

const ADDON_OPTIONS: AddonOption[] = [
  { value: 'wax', label: 'Premium Wax', price: 50 },
  { value: 'headlight', label: 'Headlight Restoration', price: 75 },
  { value: 'engine', label: 'Engine Bay Cleaning', price: 100 },
] as const

// Validation schemas
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
})

// Custom hooks
const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = useCallback((field: keyof FormData, value: string) => {
    try {
      formSchema.pick({ [field]: true }).parse({ [field]: value })
      setErrors(prev => ({ ...prev, [field]: '' }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.issues[0]?.message || 'Invalid input' }))
      }
      return false
    }
  }, [])

  const validateForm = useCallback((data: FormData) => {
    try {
      formSchema.parse(data)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          if (typeof err.path[0] === 'string' || typeof err.path[0] === 'number') {
            newErrors[String(err.path[0])] = err.message;
          }
        });
        setErrors(newErrors)
      }
      return false
    }
  }, [])

  return { errors, validateField, validateForm, clearErrors: () => setErrors({}) }
}

// Main component
const QuoteCalculator: React.FC = () => {
  // Form state
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form validation
  const { errors, validateField, validateForm, clearErrors } = useFormValidation()

  // Memoized calculations
  const quote: QuoteBreakdown = useMemo(() => {
    if (!selectedVehicle || !selectedPackage) {
      return { total: 0, breakdown: [], isValid: false }
    }

    const vehicle = VEHICLE_TYPES.find(v => v.value === selectedVehicle)
    const servicePackage = SERVICE_PACKAGES.find(p => p.value === selectedPackage)
    
    if (!vehicle || !servicePackage) {
      return { total: 0, breakdown: [], isValid: false }
    }

    const adjustedBase = Math.round(servicePackage.basePrice * vehicle.multiplier)
    const breakdown = [`${servicePackage.label}: $${adjustedBase}`]
    
    let addonTotal = 0
    selectedAddons.forEach(addonValue => {
      const addon = ADDON_OPTIONS.find(a => a.value === addonValue)
      if (addon) {
        addonTotal += addon.price
        breakdown.push(`${addon.label}: $${addon.price}`)
      }
    })
    
    const total = adjustedBase + addonTotal
    return { total, breakdown, isValid: true }
  }, [selectedVehicle, selectedPackage, selectedAddons])

  // Event handlers
  const handleVehicleChange = useCallback((vehicle: string) => {
    setSelectedVehicle(vehicle)
    clearErrors()
  }, [clearErrors])

  const handlePackageChange = useCallback((packageValue: string) => {
    setSelectedPackage(packageValue)
    clearErrors()
  }, [clearErrors])

  const handleAddonToggle = useCallback((addon: string) => {
    setSelectedAddons(prev => 
      prev.includes(addon) 
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    )
  }, [])

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Real-time validation for better UX
    if (value.trim()) {
      validateField(field, value)
    }
  }, [validateField])

  const resetForm = useCallback(() => {
    setFormData({ name: '', phone: '', email: '' })
    setSelectedVehicle('')
    setSelectedPackage('')
    setSelectedAddons([])
    clearErrors()
    setSubmitMessage(null)
  }, [clearErrors])

  const handleSubmit = useCallback(async () => {
    if (!quote.isValid) {
      setSubmitMessage({ type: 'error', text: 'Please select your vehicle type and service package.' })
      return
    }
    if (!validateForm(formData)) {
      setSubmitMessage({ type: 'error', text: 'Please correct the errors above.' })
      return
    }
    setIsSubmitting(true)
    setSubmitMessage(null)
    try {
      // Prepare template params for EmailJS (match template variable names)
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone_number: formData.phone,
        vehicle_type: VEHICLE_TYPES.find(v => v.value === selectedVehicle)?.label || selectedVehicle,
        service_package: SERVICE_PACKAGES.find(p => p.value === selectedPackage)?.label || selectedPackage,
        addons: selectedAddons.map(a => ADDON_OPTIONS.find(opt => opt.value === a)?.label).filter(Boolean).join(', ') || 'None',
        price_breakdown: quote.breakdown.join('\n'),
        total_price: `$${quote.total}`,
        submission_date: new Date().toLocaleString(),
      };
      // Send email via EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setSubmitMessage({ 
        type: 'success', 
        text: 'Thank you! We\'ll contact you shortly with your personalized quote.' 
      });
      setTimeout(resetForm, 3000);
  } catch {
      setSubmitMessage({ 
        type: 'error', 
        text: 'Something went wrong. Please try again or call us directly.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, quote, selectedVehicle, selectedPackage, selectedAddons, validateForm, resetForm])

  // Render helpers
  const renderFormField = (
    field: keyof FormData, 
    type: string, 
    placeholder: string,
    autoComplete?: string
  ) => (
    <div className="space-y-1">
      <input
        type={type}
        placeholder={placeholder}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        onBlur={(e) => e.target.value && validateField(field, e.target.value)}
        autoComplete={autoComplete}
        className={`w-full bg-gray-700 rounded-lg px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[field] ? 'border-2 border-red-500' : ''
        }`}
        disabled={isSubmitting}
        aria-invalid={!!errors[field]}
        aria-describedby={errors[field] ? `${field}-error` : undefined}
      />
      {errors[field] && (
        <p id={`${field}-error`} className="text-red-400 text-sm" role="alert">
          {errors[field]}
        </p>
      )}
    </div>
  )

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900" id="quote">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text" data-aos="fade-up">
            Get Your Instant Quote
          </h2>
          <p className="text-gray-300 mt-4" data-aos="fade-up" data-aos-delay="100">
            Configure your perfect auto detailing package and get pricing instantly
          </p>
        </header>

        <div className="glass-effect rounded-xl p-8" data-aos="fade-up" data-aos-delay="200">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Configuration Section */}
            <div className="space-y-6">
              {/* Vehicle Type Selection */}
              <fieldset>
                <legend className="block text-lg font-semibold mb-3">
                  Vehicle Type <span className="text-red-400">*</span>
                </legend>
                <div className="space-y-3" role="radiogroup" aria-required="true">
                  {VEHICLE_TYPES.map(vehicle => (
                    <label 
                      key={vehicle.value} 
                      className={`flex items-center p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                        selectedVehicle === vehicle.value 
                          ? 'border-blue-500 bg-blue-900/30' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="vehicle"
                        value={vehicle.value}
                        checked={selectedVehicle === vehicle.value}
                        onChange={() => handleVehicleChange(vehicle.value)}
                        className="mr-3 text-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                      <span className="flex-1">
                        {vehicle.label}
                        {vehicle.multiplier !== 1 && (
                          <span className="text-sm text-gray-400 block">
                            +{Math.round((vehicle.multiplier - 1) * 100)}% size adjustment
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Service Package Selection */}
              <fieldset>
                <legend className="block text-lg font-semibold mb-3">
                  Service Package <span className="text-red-400">*</span>
                </legend>
                <div className="space-y-3" role="radiogroup" aria-required="true">
                  {SERVICE_PACKAGES.map(pkg => (
                    <label 
                      key={pkg.value} 
                      className={`flex items-center p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                        selectedPackage === pkg.value 
                          ? 'border-blue-500 bg-blue-900/30' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="package"
                        value={pkg.value}
                        checked={selectedPackage === pkg.value}
                        onChange={() => handlePackageChange(pkg.value)}
                        className="mr-3 text-blue-500 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{pkg.label} - ${pkg.basePrice}</div>
                        {pkg.description && (
                          <div className="text-sm text-gray-400">{pkg.description}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Add-ons Selection */}
              <fieldset>
                <legend className="block text-lg font-semibold mb-3">Add-ons (Optional)</legend>
                <div className="space-y-3">
                  {ADDON_OPTIONS.map(addon => (
                    <label 
                      key={addon.value} 
                      className={`flex items-center p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                        selectedAddons.includes(addon.value) 
                          ? 'border-green-500 bg-green-900/30' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="addon"
                        value={addon.value}
                        checked={selectedAddons.includes(addon.value)}
                        onChange={() => handleAddonToggle(addon.value)}
                        className="mr-3 text-green-500 focus:ring-green-500"
                        disabled={isSubmitting}
                      />
                      <span className="flex-1">{addon.label} - ${addon.price}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Quote Summary Section */}
            <div className="bg-gray-800 rounded-lg p-6 h-fit">
              <h3 className="text-2xl font-bold mb-4">Your Quote</h3>
              
              <div className="text-4xl font-bold gradient-text mb-4">
                {quote.isValid ? `$${quote.total}` : 'Select Options'}
              </div>

              {quote.breakdown.length > 0 && (
                <div className="text-sm text-gray-400 mb-6 space-y-1">
                  {quote.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.split(': ')[0]}</span>
                      <span>{item.split(': ')[1]}</span>
                    </div>
                  ))}
                  <hr className="border-gray-600 my-2" />
                  <div className="flex justify-between font-semibold text-white">
                    <span>Total</span>
                    <span>${quote.total}</span>
                  </div>
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                {renderFormField('name', 'text', 'Your Name', 'name')}
                {renderFormField('phone', 'tel', 'Phone Number', 'tel')}
                {renderFormField('email', 'email', 'Email Address', 'email')}

                {submitMessage && (
                  <div 
                    className={`p-3 rounded-lg text-sm ${
                      submitMessage.type === 'success' 
                        ? 'bg-green-900/50 text-green-300 border border-green-700' 
                        : 'bg-red-900/50 text-red-300 border border-red-700'
                    }`}
                    role="alert"
                  >
                    {submitMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !quote.isValid}
                  className={`w-full py-3 rounded-lg font-semibold transition-all transform ${
                    isSubmitting || !quote.isValid
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 hover:scale-105'
                  }`}
                  aria-describedby="submit-button-help"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Lock In This Price'
                  )}
                </button>
                <div id="submit-button-help" className="text-xs text-gray-400 text-center">
                  No payment required. We&apos;ll contact you to confirm details.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default React.memo(QuoteCalculator)