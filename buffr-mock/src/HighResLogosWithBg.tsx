import React from "react";
import { Play } from "lucide-react";

export default function HighResLogosWithBg() {
  return (
    <div 
      className="min-h-screen p-8 backdrop-blur bg-white/70 dark:bg-gray-950/60 border-b border-gray-200/60 dark:border-gray-800" 
      style={{ 
        imageRendering: 'crisp-edges',
        imageRendering: '-webkit-optimize-contrast'
      }}
    >
      <div className="max-w-none space-y-32">
        
        {/* Navigation */}
        <div className="text-center mb-12">
          <div className="mb-4 space-x-4">
            <a href="#" className="inline-flex items-center text-lg text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
              ← Back to Landing Page
            </a>
            <a href="#hires" className="inline-flex items-center text-lg text-gray-600 hover:text-gray-700">
              Transparent Version
            </a>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            High Resolution Logo Assets (Header Background)
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Rendered with header background for context
          </p>
        </div>

        {/* Logo Mark Only - 2000px */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
            Logo Mark Only (2000px)
          </h2>
          <div className="flex justify-center">
            <div className="relative" style={{ width: '2000px', height: '2000px' }}>
              <div 
                className="rounded-full border-2 border-teal-500 retro-glow" 
                style={{ 
                  width: '2000px',
                  height: '2000px',
                  borderWidth: '80px',
                  imageRendering: 'crisp-edges'
                }} 
              />
              <div 
                className="pointer-events-none absolute bg-gradient-to-r from-transparent via-teal-500 to-transparent rotate-45" 
                style={{
                  top: '167px',
                  left: '167px',
                  right: '167px',
                  bottom: '167px',
                  imageRendering: 'crisp-edges'
                }}
              />
            </div>
          </div>
        </div>

        {/* Logo + Text - 4000x1000px */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
            Logo + Text (4000x1000px)
          </h2>
          <div className="flex justify-center items-center" style={{ gap: '100px' }}>
            <div className="relative" style={{ width: '1000px', height: '1000px' }}>
              <div 
                className="rounded-full border-2 border-teal-500 retro-glow" 
                style={{ 
                  width: '1000px',
                  height: '1000px',
                  borderWidth: '40px',
                  imageRendering: 'crisp-edges'
                }} 
              />
              <div 
                className="pointer-events-none absolute bg-gradient-to-r from-transparent via-teal-500 to-transparent rotate-45" 
                style={{
                  top: '83px',
                  left: '83px',
                  right: '83px',
                  bottom: '83px',
                  imageRendering: 'crisp-edges'
                }}
              />
            </div>
            <span 
              className="text-gray-900 dark:text-gray-100 font-black" 
              style={{ 
                fontFamily: 'Orbitron, -apple-system, BlinkMacSystemFont, sans-serif', 
                fontWeight: 900,
                fontSize: '830px',
                imageRendering: 'crisp-edges',
                textRendering: 'geometricPrecision'
              }}
            >
              buffr
            </span>
          </div>
        </div>

        {/* Text Only - 3000x800px */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
            Text Only (3000x800px)
          </h2>
          <div className="flex justify-center">
            <span 
              className="text-gray-900 dark:text-gray-100 font-black" 
              style={{ 
                fontFamily: 'Orbitron, -apple-system, BlinkMacSystemFont, sans-serif', 
                fontWeight: 900,
                fontSize: '600px',
                imageRendering: 'crisp-edges',
                textRendering: 'geometricPrecision'
              }}
            >
              buffr
            </span>
          </div>
        </div>

        {/* Header Pill - 3000x600px */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
            Header Pill (3000x600px)
          </h2>
          <div className="flex justify-center">
            <div 
              className="inline-flex items-center rounded border border-teal-600/30 text-teal-700 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-900/20"
              style={{ 
                gap: '40px',
                fontSize: '160px',
                fontWeight: '500',
                padding: '60px 120px',
                borderRadius: '40px',
                borderWidth: '8px',
                imageRendering: 'crisp-edges'
              }}
            >
              <span className="inline-block">Every day I'm</span>
              <span className="inline-block font-semibold relative">
                <span 
                  className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 relative"
                  style={{ fontWeight: '600' }}
                >
                  buffr.ing
                  <span 
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-teal-600 to-emerald-500"
                    style={{ height: '8px' }}
                  ></span>
                </span>
                <span 
                  className="absolute text-teal-600" 
                  style={{ 
                    right: '-120px', 
                    top: '-80px',
                    fontSize: '120px',
                    transform: 'translateY(-20px)'
                  }}
                >
                  <Play style={{ width: '120px', height: '120px' }} />
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Compact Pill - 1500x400px */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
            Compact Pill (1500x400px)
          </h2>
          <div className="flex justify-center">
            <div 
              className="inline-flex items-center rounded border border-teal-600/30 text-teal-700 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-900/20"
              style={{ 
                gap: '30px',
                fontSize: '120px',
                fontWeight: '600',
                padding: '40px 80px',
                borderRadius: '30px',
                borderWidth: '6px',
                imageRendering: 'crisp-edges'
              }}
            >
              <span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 relative"
              >
                buffr.ing
                <span 
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-teal-600 to-emerald-500"
                  style={{ height: '6px' }}
                ></span>
              </span>
              <Play 
                className="text-teal-600" 
                style={{ width: '80px', height: '80px', marginLeft: '20px' }} 
              />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center py-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Screenshot Instructions
            </h3>
            <div className="text-gray-600 dark:text-gray-400 space-y-2">
              <p>• Each logo is rendered at massive size (1000px - 2000px)</p>
              <p>• Use browser screenshot tools or extensions to capture individual elements</p>
              <p>• Right-click → "Inspect Element" → Right-click in DevTools → "Capture node screenshot"</p>
              <p>• For best quality, use full-screen mode (F11) before taking screenshots</p>
              <p>• This version has header background context</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
