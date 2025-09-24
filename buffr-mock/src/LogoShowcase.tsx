import React from "react";
import { Play } from "lucide-react";

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-transparent p-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <a href="#" className="inline-flex items-center text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
              ← Back to Landing Page
            </a>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Buffr Logo Showcase
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Logo variations with transparent backgrounds
          </p>
        </div>

        {/* Just the Logo */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Logo Mark Only
          </h2>
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-teal-500" style={{ 
                boxShadow: '0 0 20px rgba(20,184,166,0.08), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(20,184,166,0.05)'
              }} />
              <div className="pointer-events-none absolute inset-[8px] bg-gradient-to-r from-transparent via-teal-500 to-transparent rotate-45" />
            </div>
          </div>
        </div>

        {/* Logo + Text */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Logo + Text
          </h2>
          <div className="flex justify-center items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-3 border-teal-500" style={{ 
                boxShadow: '0 0 20px rgba(20,184,166,0.08), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(20,184,166,0.05)'
              }} />
              <div className="pointer-events-none absolute inset-[6px] bg-gradient-to-r from-transparent via-teal-500 to-transparent rotate-45" />
            </div>
            <span className="text-4xl font-black tracking-wide text-gray-900 dark:text-gray-100" style={{ 
              fontFamily: 'Orbitron, -apple-system, BlinkMacSystemFont, sans-serif', 
              fontWeight: 900 
            }}>
              buffr
            </span>
          </div>
        </div>

        {/* Header Pill (Static) */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Header Pill (Static)
          </h2>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 rounded text-sm font-medium px-3 py-2 border border-teal-600/30 text-teal-700 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-900/20">
              <span className="inline-block">Every day I'm</span>
              <span className="inline-block font-semibold relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 relative">
                  buffr.ing
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-teal-600 to-emerald-500"></span>
                </span>
                <span className="absolute -right-4 -top-3 text-xs select-none" style={{ transform: 'translateY(-2px)' }}>
                  <Play className="w-4 h-4 text-teal-600" />
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Individual Components for Easy Copy */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
            Individual Components
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Logo Only - Larger */}
            <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Large Logo</h3>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full border-4 border-teal-500" style={{ 
                    boxShadow: '0 0 20px rgba(20,184,166,0.08), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(20,184,166,0.05)'
                  }} />
                  <div className="pointer-events-none absolute inset-[10px] bg-gradient-to-r from-transparent via-teal-500 to-transparent rotate-45" />
                </div>
              </div>
            </div>

            {/* Text Only */}
            <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Text Only</h3>
              <div className="flex justify-center">
                <span className="text-3xl font-black tracking-wide text-gray-900 dark:text-gray-100" style={{ 
                  fontFamily: 'Orbitron, -apple-system, BlinkMacSystemFont, sans-serif', 
                  fontWeight: 900 
                }}>
                  buffr
                </span>
              </div>
            </div>

            {/* Pill Compact */}
            <div className="text-center p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Compact Pill</h3>
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-1 rounded text-xs font-medium px-2 py-1 border border-teal-600/30 text-teal-700 dark:text-teal-300 bg-teal-50/60 dark:bg-teal-900/20">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500 relative font-semibold">
                    buffr.ing
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-teal-600 to-emerald-500"></span>
                  </span>
                  <Play className="w-3 h-3 text-teal-600 ml-1" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
