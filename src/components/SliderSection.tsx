"use client";

import { useEffect, useRef, useCallback, useState, memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility function
import Link from "next/link";

// Types
interface SliderProps {
  id: string;
  title: string;
  beforeImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  afterImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  initialPosition?: number;
  className?: string;
  onPositionChange?: (position: number, sliderId: string) => void;
  "data-aos"?: string;
}

interface SliderSectionProps {
  sliders?: SliderProps[];
  className?: string;
}

// Individual Before/After Slider Component
const BeforeAfterSlider = memo<SliderProps>(
  ({
    id,
    title,
    beforeImage,
    afterImage,
    initialPosition = 50,
    className,
    onPositionChange,
    "data-aos": dataAos,
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
  // const [error, setError] = useState<string | null>(null); // removed unused
    const requestRef = useRef<number | undefined>(undefined);

    // Track errors for before/after images separately
    const [imageErrors, setImageErrors] = useState<{
      before: boolean;
      after: boolean;
    }>({ before: false, after: false });

    // Optimized position update with RAF
    const updatePosition = useCallback(
      (newPosition: number) => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }

        requestRef.current = requestAnimationFrame(() => {
          const clampedPosition = Math.max(0, Math.min(100, newPosition));
          setPosition(clampedPosition);
          onPositionChange?.(clampedPosition, id);

          const container = containerRef.current;
          if (!container) return;

          const afterImage = container.querySelector(
            ".after-image"
          ) as HTMLElement;
          const handle = container.querySelector(
            ".slider-handle"
          ) as HTMLElement;

          if (afterImage) {
            afterImage.style.clipPath = `polygon(${clampedPosition}% 0%, 100% 0%, 100% 100%, ${clampedPosition}% 100%)`;
          }
          if (handle) {
            handle.style.left = `${clampedPosition}%`;
            handle.style.transform = "translateX(-50%)";
          }
        });
      },
      [onPositionChange, id]
    );

    const getPositionFromEvent = useCallback(
      (clientX: number): number => {
        const container = containerRef.current;
        if (!container) return position;

        const rect = container.getBoundingClientRect();
        return ((clientX - rect.left) / rect.width) * 100;
      },
      [position]
    );

    // Mouse handlers
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      document.body.style.cursor = "col-resize";
    }, []);

    // Touch handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(true);
    }, []);

    // Keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const step = e.shiftKey ? 10 : 2;
        let newPosition = position;

        switch (e.key) {
          case "ArrowLeft":
          case "ArrowDown":
            e.preventDefault();
            newPosition = position - step;
            break;
          case "ArrowRight":
          case "ArrowUp":
            e.preventDefault();
            newPosition = position + step;
            break;
          case "Home":
            e.preventDefault();
            newPosition = 0;
            break;
          case "End":
            e.preventDefault();
            newPosition = 100;
            break;
          default:
            return;
        }

        updatePosition(newPosition);
      },
      [position, updatePosition]
    );

    // Global event handlers
    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const newPosition = getPositionFromEvent(e.clientX);
        updatePosition(newPosition);
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const newPosition = getPositionFromEvent(touch.clientX);
        updatePosition(newPosition);
        e.preventDefault();
      };

      const handleEnd = () => {
        setIsDragging(false);
        document.body.style.cursor = "";
      };

      // Add listeners with proper options
      document.addEventListener("mousemove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleEnd, { passive: true });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleEnd, { passive: true });

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEnd);
        document.body.style.cursor = "";
      };
    }, [isDragging, getPositionFromEvent, updatePosition]);

    // Initialize position
    useEffect(() => {
      updatePosition(initialPosition);
      setIsLoaded(true);
    }, [initialPosition, updatePosition]);

    // Cleanup RAF on unmount
    useEffect(() => {
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }, []);

    const handleImageError = useCallback((imageName: "before" | "after") => {
      setImageErrors((prev) => ({ ...prev, [imageName]: true }));
    }, []);

    // Remove the error block, as we now show SVG fallback for each image

    return (
      <div className={cn("slider-wrapper", className)} data-aos={dataAos}>
        <h3 className="text-2xl font-semibold mb-6 text-white">{title}</h3>

        <div
          ref={containerRef}
          className={cn(
            "slider-container group relative overflow-hidden rounded-xl bg-gray-200 shadow-2xl transition-all duration-300",
            "hover:shadow-3xl hover:-translate-y-1",
            "focus-within:ring-4 focus-within:ring-blue-500/30",
            isDragging && "cursor-col-resize",
            !isLoaded && "animate-pulse"
          )}
          style={{ aspectRatio: `${beforeImage.width}/${beforeImage.height}` }}
          role="img"
          aria-label={`Before and after comparison: ${beforeImage.alt} vs ${afterImage.alt}`}
        >
          {/* Before Image */}
          <div className="before-image absolute inset-0 z-10">
            {imageErrors.before ? (
              // SVG Fallback for before image
              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 400 300" role="img">
                  <rect fill="#4a5568" width="400" height="300" />
                  <rect
                    fill="#2d3748"
                    x="50"
                    y="50"
                    width="300"
                    height="150"
                    rx="20"
                  />
                  <circle fill="#1a202c" cx="120" cy="220" r="30" />
                  <circle fill="#1a202c" cx="280" cy="220" r="30" />
                  <g opacity="0.7">
                    <circle fill="#8b4513" cx="80" cy="80" r="8" />
                    <circle fill="#8b4513" cx="320" cy="90" r="6" />
                    <circle fill="#8b4513" cx="150" cy="70" r="4" />
                    <path
                      d="M100,120 Q120,110 140,120 Q160,130 180,120"
                      stroke="#654321"
                      strokeWidth="3"
                      fill="none"
                    />
                  </g>
                  <text
                    x="200"
                    y="160"
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize="16"
                    fontWeight="600"
                  >
                    Dirty Car (Before)
                  </text>
                </svg>
              </div>
            ) : (
              <Image
                src={beforeImage.src}
                alt={beforeImage.alt}
                width={beforeImage.width}
                height={beforeImage.height}
                className="w-full h-full object-cover"
                priority
                onError={() => handleImageError("before")}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>

          {/* After Image */}
          <div
            className="after-image absolute inset-0 z-20 transition-all duration-100 ease-out"
            style={{
              clipPath: `polygon(${position}% 0%, 100% 0%, 100% 100%, ${position}% 100%)`,
            }}
          >
            {imageErrors.after ? (
              // SVG Fallback for after image
              <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 400 300" role="img">
                  <defs>
                    <linearGradient
                      id="skyGrad"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#87ceeb", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#4682b4", stopOpacity: 1 }}
                      />
                    </linearGradient>
                    <linearGradient
                      id="carGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#ff6b6b", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#ee5a52", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <rect fill="url(#skyGrad)" width="400" height="300" />
                  <rect
                    fill="url(#carGrad)"
                    x="50"
                    y="50"
                    width="300"
                    height="150"
                    rx="20"
                  />
                  <circle fill="#2c3e50" cx="120" cy="220" r="30" />
                  <circle fill="#2c3e50" cx="280" cy="220" r="30" />
                  <g opacity="0.4">
                    <ellipse fill="white" cx="200" cy="125" rx="80" ry="20" />
                    <ellipse fill="white" cx="250" cy="110" rx="30" ry="8" />
                    <circle fill="white" cx="150" cy="80" r="3" />
                    <circle fill="white" cx="250" cy="90" r="2" />
                  </g>
                  <text
                    x="200"
                    y="160"
                    textAnchor="middle"
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    Clean Car (After)
                  </text>
                </svg>
              </div>
            ) : (
              <Image
                src={afterImage.src}
                alt={afterImage.alt}
                width={afterImage.width}
                height={afterImage.height}
                className="w-full h-full object-cover"
                priority
                onError={() => handleImageError("after")}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>

          {/* Slider Handle */}
          <button
            className={cn(
              "slider-handle absolute top-1/2 z-30 flex items-center justify-center",
              "w-12 h-12 bg-white rounded-full border-4 border-blue-500 shadow-lg",
              "text-blue-600 font-bold text-xl cursor-col-resize",
              "transition-all duration-200 ease-out",
              "hover:scale-110 hover:shadow-xl hover:border-blue-400",
              "focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:scale-110",
              "active:scale-95",
              isDragging && "scale-110 shadow-xl ring-4 ring-blue-500/50",
              "md:w-14 md:h-14 md:text-2xl"
            )}
            style={{
              left: `${position}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onKeyDown={handleKeyDown}
            aria-label={`Drag to compare images. Current position: ${Math.round(
              position
            )}%. Use arrow keys to adjust, Shift+arrow for larger steps.`}
            tabIndex={0}
          >
            <span className="select-none" aria-hidden="true">
              ↔
            </span>
          </button>

          {/* Loading overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-300 animate-pulse z-40 flex items-center justify-center">
              <div className="text-gray-500">Loading comparison...</div>
            </div>
          )}

          {/* Labels */}
          <div className="absolute top-4 left-4 z-30">
            <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              Before
            </span>
          </div>
          <div className="absolute top-4 right-4 z-30">
            <span className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">
              After
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <p>Drag slider to see the transformation</p>
          <span className="font-mono bg-gray-700 px-2 py-1 rounded">
            {Math.round(position)}%
          </span>
        </div>
      </div>
    );
  }
);

BeforeAfterSlider.displayName = "BeforeAfterSlider";

// Main SliderSection Component
const SliderSection: React.FC<SliderSectionProps> = ({
  sliders: customSliders,
  className,
}) => {
  // Default sliders data - replace with your actual images
  const defaultSliders: SliderProps[] = [
    {
      id: "exterior",
      title: "Exterior Transformation",
      beforeImage: {
        src: "/images/BeforeImage.jpg",
        alt: "Dirty car exterior before professional detailing",
        width: 800,
        height: 600,
      },
      afterImage: {
        src: "/images/afterImage.jpg",
        alt: "Clean car exterior after professional detailing",
        width: 800,
        height: 600,
      },
      "data-aos": "fade-right",
    },
    {
      id: "interior",
      title: "Interior Deep Clean",
      beforeImage: {
        src: "/Images/BeforeImage1.jpg",
        alt: "Dirty car interior before deep cleaning",
        width: 800,
        height: 600,
      },
      afterImage: {
        src: "/images/afterImage1.jpg",
        alt: "Clean car interior after professional detailing",
        width: 800,
        height: 600,
      },
      "data-aos": "fade-left",
    },
  ];


  // State for uploaded slider items
  const [uploadedSliders, setUploadedSliders] = useState<SliderProps[]>([]);

  // Fetch uploaded slider items on mount
  useEffect(() => {
    fetch('/uploads/metadata.json')
      .then(res => res.ok ? res.json() : [])
  .then((data: unknown[]) => {
        setUploadedSliders(
          (data || [])
            .filter((item): item is { section: string; beforeImage: string; afterImage: string; title: string } =>
              typeof item === 'object' && item !== null &&
              'section' in item && (item as { section?: string }).section === 'slider' &&
              'beforeImage' in item && typeof (item as { beforeImage?: string }).beforeImage === 'string' &&
              'afterImage' in item && typeof (item as { afterImage?: string }).afterImage === 'string' &&
              'title' in item && typeof (item as { title?: string }).title === 'string'
            )
            .map((item, idx) => ({
              id: `uploaded-${idx}`,
              title: item.title,
              beforeImage: {
                src: item.beforeImage,
                alt: item.title + ' before',
                width: 800,
                height: 600,
              },
              afterImage: {
                src: item.afterImage,
                alt: item.title + ' after',
                width: 800,
                height: 600,
              },
              'data-aos': 'fade-up',
            }))
        );
      })
      .catch(() => setUploadedSliders([]));
  }, []);

  const sliders = customSliders || [...uploadedSliders, ...defaultSliders];

  // Analytics callback
  const handlePositionChange = useCallback(
    (position: number, sliderId: string) => {
      // Add your analytics tracking here
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "slider_interaction", {
          event_category: "engagement",
          event_label: sliderId,
          value: Math.round(position),
        });
      }
    },
    []
  );

  return (
    <section
      className={cn(
        "relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden",
        className
      )}
      id="transformations"
      aria-labelledby="transformations-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            id="transformations-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text"
            data-aos="fade-up"
          >
            See the Magic Happen
          </h2>
          <p
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Experience the dramatic transformation our professional detailing
            services bring to your vehicle. Slide to see the incredible before
            and after results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {sliders.map((slider) => (
            <BeforeAfterSlider
              key={slider.id}
              {...slider}
              onPositionChange={handlePositionChange}
              className="w-full"
            />
          ))}
        </div>

        {/* CTA Section */}
        <div
          className="text-center mt-16"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <p className="text-gray-300 mb-6">Ready to transform your vehicle?</p>
          <Link href="#contact">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
              Book Your Detailing Service
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(
            135deg,
            #667eea 0%,
            #764ba2 50%,
            #f093fb 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        @media (max-width: 768px) {
          .slider-container {
            margin-left: -1rem;
            margin-right: -1rem;
            border-radius: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default SliderSection;
