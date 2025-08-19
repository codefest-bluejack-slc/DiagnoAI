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
      </div>
    </section>
  );
}
