// components/Gallery.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface GalleryItem {
  id: number
  title: string
  category: 'exterior' | 'interior' | 'before-after' | 'ceramic' | 'wheels'
  beforeImage: string
  afterImage?: string
  description: string
  tags: string[]
  isBeforeAfter: boolean
}

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<GalleryItem | null>(null)
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({})
  const [sliderPosition, setSliderPosition] = useState(50)
  const [showMore, setShowMore] = useState(false)
  const [visibleItems] = useState(6) // Show 6 items initially

  // Production-ready placeholder images with proper dimensions
  const defaultGalleryItems: GalleryItem[] = [
    {
      id: 1,
      title: "Luxury Sedan Complete Transformation",
      category: "before-after",
      beforeImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop&crop=center&auto=format",
      afterImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center&auto=format",
      description: "Complete exterior and interior detailing transformation of a luxury sedan",
      tags: ["exterior", "interior", "luxury", "sedan"],
      isBeforeAfter: true
    },
    {
      id: 2,
      title: "Premium SUV Ceramic Coating",
      category: "ceramic",
      beforeImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center&auto=format",
      description: "9H ceramic coating application providing ultimate paint protection",
      tags: ["ceramic", "suv", "protection", "premium"],
      isBeforeAfter: false
    },
    {
      id: 3,
      title: "Sports Car Interior Detailing",
      category: "interior",
      beforeImage: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&h=600&fit=crop&crop=center&auto=format",
      description: "Luxury leather conditioning and deep interior cleaning",
      tags: ["interior", "leather", "sports car", "luxury"],
      isBeforeAfter: false
    },
    {
      id: 4,
      title: "Classic Car Paint Restoration",
      category: "exterior",
      beforeImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&crop=center&auto=format",
      description: "Multi-stage paint correction and protection for classic vehicle",
      tags: ["exterior", "classic", "paint correction", "restoration"],
      isBeforeAfter: false
    },
    {
      id: 5,
      title: "Performance Wheels & Tire Detailing",
      category: "wheels",
      beforeImage: "/images/Wheels.jpg",
      description: "Deep cleaning and protection for high-performance wheels",
      tags: ["wheels", "performance", "tires", "cleaning"],
      isBeforeAfter: false
    },
    {
      id: 6,
      title: "Truck Complete Makeover",
      category: "before-after",
      beforeImage: "/images/Truck2.jpg",
      afterImage: "/images/Truck.jpg",
      description: "Full exterior and interior transformation of work truck",
      tags: ["truck", "exterior", "interior", "transformation"],
      isBeforeAfter: true
    },
    {
      id: 7,
      title: "Luxury Interior Deep Clean",
      category: "interior",
      beforeImage: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=600&fit=crop&crop=center&auto=format",
      description: "Premium interior cleaning with steam treatment",
      tags: ["interior", "luxury", "steam", "deep clean"],
      isBeforeAfter: false
    },
    {
      id: 8,
      title: "Convertible Paint Enhancement",
      category: "exterior",
      beforeImage: "/images/Exterior5.jpg",
      description: "Paint enhancement and ceramic coating for convertible",
      tags: ["exterior", "convertible", "paint enhancement", "ceramic"],
      isBeforeAfter: false
    },
    {
      id: 9,
      title: "Racing Wheels Restoration",
      category: "wheels",
      beforeImage: "/images/Racing-wheels.jpg",
      description: "Professional wheel restoration and protection",
      tags: ["wheels", "racing", "restoration", "protection"],
      isBeforeAfter: false
    },
    {
      id: 10,
      title: "Vintage Car Complete Restoration",
      category: "before-after",
      beforeImage: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop&crop=center&auto=format",
      afterImage: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&crop=center&auto=format",
      description: "Complete restoration of vintage automobile with modern protection",
      tags: ["vintage", "restoration", "exterior", "interior"],
      isBeforeAfter: true
    },
    {
      id: 11,
      title: "Motorcycle Detailing Excellence",
      category: "exterior",
      beforeImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center&auto=format",
      description: "Professional motorcycle detailing and paint protection",
      tags: ["motorcycle", "exterior", "detailing", "protection"],
      isBeforeAfter: false
    },
    {
      id: 12,
      title: "Luxury Vehicle Interior Perfection",
      category: "interior",
      beforeImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center&auto=format",
      description: "Premium leather treatment and interior protection",
      tags: ["luxury", "interior", "leather", "protection"],
      isBeforeAfter: false
    }
  ]

  const categories = [
    { id: 'all', label: 'All Work', icon: '🏆' },
    { id: 'before-after', label: 'Transformations', icon: '✨' },
    { id: 'exterior', label: 'Exterior', icon: '🚗' },
    { id: 'interior', label: 'Interior', icon: '🪑' },
    { id: 'ceramic', label: 'Ceramic Coating', icon: '💎' },
    { id: 'wheels', label: 'Wheels & Tires', icon: '⚡' }
  ]


  // State for uploaded items
  const [uploadedItems, setUploadedItems] = useState<GalleryItem[]>([]);

  // Fetch uploaded gallery items on mount
  useEffect(() => {
    fetch('/uploads/metadata.json')
      .then(res => res.ok ? res.json() : [])
      .then((data: unknown[]) => {
        // Only include items for gallery section
        setUploadedItems(
          (data || [])
            .filter((item): item is GalleryItem & { section?: string } => typeof item === 'object' && item !== null && 'section' in item && (item as { section?: string }).section === 'gallery')
            .map((item, idx) => ({
              id: 10000 + idx, // Ensure unique id
              title: (item as { title: string }).title,
              category: (item as { category?: GalleryItem['category'] }).category || 'before-after',
              beforeImage: (item as { beforeImage: string }).beforeImage,
              afterImage: (item as { afterImage?: string }).afterImage || undefined,
              description: (item as { description: string }).description,
              tags: (item as { tags?: string[] }).tags || [],
              isBeforeAfter: !!(item as { afterImage?: string }).afterImage,
            }))
        );
      })
      .catch(() => setUploadedItems([]));
  }, []);

  // Merge uploaded and default items
  const galleryItems: GalleryItem[] = [...uploadedItems, ...defaultGalleryItems];

  const filteredItems = activeFilter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  const displayedItems = showMore ? filteredItems : filteredItems.slice(0, visibleItems);

  const openLightbox = (item: GalleryItem) => {
    setCurrentImage(item)
    setLightboxOpen(true)
    setSliderPosition(50)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentImage(null)
    document.body.style.overflow = 'unset'
  }

  const handleImageLoad = (id: number) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }))
  }

  const handleViewMore = () => {
    setShowMore(true)
  }

  const handleViewLess = () => {
    setShowMore(false)
  }

  // Handle filter change - reset show more state
  useEffect(() => {
    setShowMore(false)
  }, [activeFilter])

  // Handle slider for before/after images
  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentImage?.isBeforeAfter) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') {
          closeLightbox()
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [lightboxOpen])

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative" id="gallery">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Our Work Speaks for Itself
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the transformative power of professional auto detailing through our portfolio of exceptional work
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12" data-aos="fade-up" data-aos-delay="200">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeFilter === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="hidden sm:inline">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800 cursor-pointer transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20"
              data-aos="fade-up"
              data-aos-delay={100 * (index % 6)}
              onClick={() => openLightbox(item)}
            >
              {/* Loading Skeleton */}
              {!imageLoaded[item.id] && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/50 to-transparent -skew-x-12 animate-shimmer"></div>
                </div>
              )}

              {/* Next.js Image Component */}
              <Image
                src={item.beforeImage}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onLoad={() => handleImageLoad(item.id)}
                priority={index < 6} // Priority loading for first 6 images
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-600/20 backdrop-blur-sm text-blue-300 text-xs rounded-full border border-blue-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-30">
                <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
                  {categories.find(cat => cat.id === item.category)?.label}
                </span>
              </div>

              {/* Before/After Badge */}
              {item.isBeforeAfter && (
                <div className="absolute top-4 right-4 z-30">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full shadow-lg">
                    Before/After
                  </span>
                </div>
              )}

              {/* View Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <span className="text-2xl text-white">👁️</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More/Less Button */}
        {filteredItems.length > visibleItems && (
          <div className="text-center mt-12" data-aos="fade-up">
            {!showMore ? (
              <button 
                onClick={handleViewMore}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 mr-4"
              >
                View More Work ({filteredItems.length - visibleItems} more)
              </button>
            ) : (
              <button 
                onClick={handleViewLess}
                className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                Show Less
              </button>
            )}
          </div>
        )}

        {/* Results Counter */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Showing {displayedItems.length} of {filteredItems.length} projects
            {activeFilter !== 'all' && ` in ${categories.find(cat => cat.id === activeFilter)?.label}`}
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && currentImage && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 border border-white/20"
          >
            <span className="text-2xl">✕</span>
          </button>

          <div className="max-w-4xl w-full">
            {/* Image Container */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-900">
              {currentImage.isBeforeAfter && currentImage.afterImage ? (
                // Before/After Slider
                <div 
                  className="relative w-full h-full cursor-ew-resize"
                  onMouseMove={handleSliderMove}
                >
                  {/* Before Image */}
                  <Image
                    src={currentImage.beforeImage}
                    alt="Before"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  {/* After Image */}
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`
                    }}
                  >
                    <Image
                      src={currentImage.afterImage}
                      alt="After"
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                  {/* Slider Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <span className="text-gray-800 text-xs">↔</span>
                    </div>
                  </div>
                  {/* Labels */}
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                    Before
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                    After
                  </div>
                </div>
              ) : (
                // Single Image
                <Image
                  src={currentImage.beforeImage}
                  alt={currentImage.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              )}
            </div>

            {/* Image Info */}
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-3">{currentImage.title}</h3>
              <p className="text-gray-300 text-lg mb-4">{currentImage.description}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {currentImage.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-blue-600/20 backdrop-blur-sm text-blue-300 text-sm rounded-full border border-blue-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
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
    </section>
  )
}

export default Gallery

