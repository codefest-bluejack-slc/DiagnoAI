import { useState, useEffect, useRef } from 'react';
import diagnoaiLogo from '../../assets/diagnoai_logo.png';

interface WelcomeSectionsProps {
  onNavigate?: () => void;
}

export default function WelcomeSections({ onNavigate }: WelcomeSectionsProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        setIsScrolled(scrollTop > 100);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleLayerClick = (layerIndex: number) => {
    setSelectedLayer(selectedLayer === layerIndex ? null : layerIndex);
  };

  return (
    <div ref={containerRef} className="welcome-container">
      <section className="welcome-section section-1">
        <div className={`logo-title-container ${isScrolled ? 'moved' : ''}`}>
          <img src={diagnoaiLogo} alt="DiagnoAI Logo" className="logo" />
          <h1 className="title">DiagnoAI</h1>
        </div>
        <div className="scroll-content">
          <div className="content-area">
            <h2>Advanced AI Diagnostics</h2>
            <p>
              Revolutionizing healthcare with cutting-edge artificial
              intelligence
            </p>
          </div>
          <div className="content-area">
            <h2>Accurate Results</h2>
            <p>Get precise diagnostic insights powered by machine learning</p>
          </div>
          <div className="content-area">
            <h2>Ready to Start?</h2>
            <button onClick={onNavigate} className="cta-button">
              Begin Diagnosis
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
