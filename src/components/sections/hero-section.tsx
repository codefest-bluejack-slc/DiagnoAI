import React from 'react';

export default function HeroSection() {
  return (
    <div className="flex flex-col justify-center h-full w-full px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
          <span className="color-text-primary">Diagno</span>
          <span className="color-primary">AI</span>
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl color-text-secondary mb-8 leading-relaxed max-w-2xl">
          Advanced AI-powered diagnostic assistance for healthcare professionals. 
          Precision medicine meets intelligent technology.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button className="bg-primary hover:bg-primary-dark transition-all duration-300 
                           px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-white font-semibold text-base sm:text-lg
                           shadow-lg hover:shadow-glow transform hover:-translate-y-1">
            Start Diagnosis
          </button>
          
          <button className="bg-glass hover:bg-glass-hover transition-all duration-300 
                           px-6 sm:px-8 py-3 sm:py-4 rounded-lg color-text-primary font-semibold text-base sm:text-lg
                           border border-default hover:border-hover">
            Learn More
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
          <div>
            <div className="text-2xl sm:text-3xl font-bold color-primary mb-2">98%</div>
            <div className="color-text-muted text-sm">Accuracy Rate</div>
          </div>
          
          <div>
            <div className="text-2xl sm:text-3xl font-bold color-secondary mb-2">24/7</div>
            <div className="color-text-muted text-sm">Availability</div>
          </div>
          
          <div>
            <div className="text-2xl sm:text-3xl font-bold color-tertiary mb-2">1M+</div>
            <div className="color-text-muted text-sm">Diagnoses</div>
          </div>
        </div>
      </div>
    </div>
  );
}
