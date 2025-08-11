import React from 'react';
import Navbar from '../components/common/navbar';
import { WelcomeSections } from '../components/sections/welcome-sections';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main>
        <WelcomeSections />
      </main>
    </div>
  );
}
