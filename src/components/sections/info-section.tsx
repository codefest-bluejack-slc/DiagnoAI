import React, { useState, useEffect } from 'react';
import { useDrag } from '../../hooks/use-drag';
import '../../styles/info-section.css';

interface FeatureCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  tags: { text: string; variant: string }[];
  borderColor: string;
  iconBg: string;
}

export default function InfoSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [draggedCard, setDraggedCard] = useState<number | null>(null);

  const handleDragStart = (elementId: string) => {
    const cardId = parseInt(elementId.replace('info-card-', ''));
    setDraggedCard(cardId);
  };

  const handleDragEnd = (elementId: string) => {
    setDraggedCard(null);
  };

  const createDragHandlers = (cardId: number) => {
    return useDrag(`info-card-${cardId}`, {
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      constrainToParent: true,
      containerSelector: '.info-section-container'
    });
  };

  const features: FeatureCard[] = [
    {
      id: 1,
      title: 'AI Diagnosis',
      subtitle: 'Smart Health Assessment',
      description: 'Advanced AI-powered diagnostic system for accurate health insights',
      icon: '🔬',
      tags: [
        { text: 'AI Powered', variant: 'purple' },
        { text: 'Real-time', variant: 'indigo' }
      ],
      borderColor: 'var(--primary-purple)',
      iconBg: 'var(--primary-purple-100)'
    },
    {
      id: 2,
      title: 'Symptom Analysis',
      subtitle: 'Comprehensive Evaluation',
      description: 'Detailed symptom tracking and analysis for better health monitoring',
      icon: '📊',
      tags: [
        { text: 'Detailed', variant: 'pink' },
        { text: 'Tracking', variant: 'green' }
      ],
      borderColor: 'var(--secondary-pink)',
      iconBg: 'var(--secondary-pink-100)'
    },
    {
      id: 3,
      title: 'Health History',
      subtitle: 'Medical Records',
      description: 'Secure storage and management of your complete medical history',
      icon: '📋',
      tags: [
        { text: 'Secure', variant: 'indigo' },
        { text: 'Complete', variant: 'blue' }
      ],
      borderColor: 'var(--tertiary-indigo)',
      iconBg: 'var(--tertiary-indigo-100)'
    },
    {
      id: 4,
      title: 'Medicine Guide',
      subtitle: 'Treatment Recommendations',
      description: 'Personalized medicine recommendations based on your health profile',
      icon: '💊',
      tags: [
        { text: 'Personalized', variant: 'green' },
        { text: 'Expert', variant: 'yellow' }
      ],
      borderColor: 'var(--success-green)',
      iconBg: 'var(--success-green-100)'
    }
  ];

  const handleShuffle = () => {
    const container = document.querySelector('.info-section-container') as HTMLElement;
    
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const containerStyle = window.getComputedStyle(container);
      const paddingTop = parseFloat(containerStyle.paddingTop) || 0;
      const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
      const paddingBottom = parseFloat(containerStyle.paddingBottom) || 0;
      
      const headerHeight = document.querySelector('.info-header')?.getBoundingClientRect().height || 0;
      const controlsHeight = document.querySelector('.info-controls')?.getBoundingClientRect().height || 0;
      const availableHeight = containerRect.height - headerHeight - controlsHeight - paddingTop - paddingBottom - 100;
      const availableWidth = containerRect.width - paddingLeft - paddingRight;
      
      features.forEach((feature, index) => {
        const cardElement = document.getElementById(`info-card-${feature.id}`) as HTMLElement;
        if (cardElement) {
          const randomTop = headerHeight + paddingTop + Math.random() * (availableHeight - cardElement.offsetHeight);
          const randomLeft = paddingLeft + Math.random() * (availableWidth - cardElement.offsetWidth);
          const randomRotation = (Math.random() - 0.5) * 20;

          cardElement.style.top = `${randomTop}px`;
          cardElement.style.left = `${randomLeft}px`;
          cardElement.style.transform = `rotate(${randomRotation}deg)`;
          cardElement.style.zIndex = `${index + 1}`;
          cardElement.style.setProperty('--rotation', `${randomRotation}deg`);
        }
      });
    }
  };

  return (
    <section className="info-section">
      <div className="info-section-container" id="info-section-container">
        <div className="info-header">
          <h2 className="info-title">
            Discover DiagnoAI Features
          </h2>
          <p className="info-subtitle">
            Advanced healthcare solutions powered by artificial intelligence
          </p>
        </div>

        <div id="info-card-container" className="info-cards-container">
          {features.map((feature) => {
            const dragHandlers = createDragHandlers(feature.id);
            const isDragged = draggedCard === feature.id;
            
            return (
              <div
                key={feature.id}
                id={`info-card-${feature.id}`}
                className={`info-card ${isDragged ? 'dragging' : ''}`}
                style={{ borderTopColor: feature.borderColor }}
                onMouseEnter={() => !isDragged && setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onMouseDown={dragHandlers.onMouseDown}
                onTouchStart={dragHandlers.onTouchStart}
              >
              <div className="info-card-header">
                <div 
                  className="info-card-icon"
                  style={{ backgroundColor: feature.iconBg }}
                >
                  {feature.icon}
                </div>
                <div className="info-card-titles">
                  <div className="info-card-subtitle">{feature.subtitle}</div>
                  <h3 className="info-card-title">{feature.title}</h3>
                </div>
              </div>
              
              <p className="info-card-description">{feature.description}</p>
              
              <div className="info-card-tags">
                {feature.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className={`info-tag info-tag-${tag.variant}`}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>
          )})}
        </div>

        <div className="info-controls">
          <button 
            onClick={handleShuffle}
            className="shuffle-button"
          >
            Shuffle Cards
          </button>
        </div>
      </div>
    </section>
  );
}
