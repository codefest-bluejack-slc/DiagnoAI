import React from 'react';
import Navbar from '../components/common/navbar';
import HeroSection from '../components/sections/hero-section';
import SyringeBackground from '../components/animations/syringe-animation';

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <SyringeBackground />
      
      <div className="relative" style={{ zIndex: 10 }}>
        <Navbar />
        <main className="min-h-screen flex items-center">
          <div className="w-full">
            <HeroSection />
          </div>
        </main>
      </div>
    </div>
  );
}
