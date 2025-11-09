"use client"

import Link from "next/link"
import { Search, ArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsNavigating(true)
    // Smooth fade-out transition before navigation
    setTimeout(() => {
      router.push("/scene")
    }, 500)
  }

  return (
    <div className={`min-h-screen bg-white flex flex-col overflow-hidden transition-opacity duration-500 ${isNavigating ? 'opacity-0' : 'opacity-100'}`}>
      {/* Main Content */}
      <div className="flex-1 flex items-center px-6 md:px-12 lg:px-16 py-8">
        <div className="max-w-5xl w-full">
          {/* Main Text Block */}
          <div className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] font-light transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className={`text-left mb-2 md:mb-3 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <span className="font-bold text-black">Every angle</span>
            </div>
            <div className={`text-gray-400 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <span className="font-normal">tells </span>
              <span className="font-bold text-black">a story,</span>
            </div>
            <div className={`text-gray-400 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <span className="font-normal">every detail </span>
              <span className="font-bold text-black">holds the truth.</span>
            </div>
            <div className={`text-gray-400 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <span className="font-normal">Reconstructing </span>
              <span className="font-bold text-black">reality</span>
            </div>
            <div className={`text-gray-400 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
              <span className="font-normal">through </span>
              <span className="font-bold text-black">three dimensions.</span>
            </div>
          </div>
        </div>
      </div>

      {/* History Link */}
      <div className={`pb-8 md:pb-12 lg:pb-16 flex justify-center transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Link 
          href="/scene"
          onClick={handleLinkClick}
          className="group flex items-baseline gap-1 text-6xl md:text-7xl lg:text-8xl font-bold text-gray-700 hover:text-black transition-all duration-300"
        >
          <span className="group-hover:translate-x-[-2px] transition-transform duration-300">Hist</span>
          <span className="relative inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Search className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 stroke-[1] -mt-1" />
          </span>
          <span className="group-hover:translate-x-[2px] transition-transform duration-300">ry</span>
          <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ml-1 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300" />
        </Link>
      </div>
    </div>
  )
}
