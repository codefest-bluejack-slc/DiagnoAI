import React, { useState, useRef, useEffect, ReactNode, ReactElement, cloneElement } from 'react';
import { ITooltip } from '../../interfaces/ITooltip';

export default function Tooltip({
  content,
  children,
  position = 'auto',
  trigger = 'hover',
  delay = 200,
  className = '',
  arrow = true,
  disabled = false,
  offset = 8,
  maxWidth = 250
}: ITooltip) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    if (position !== 'auto') {
      setActualPosition(position);
      return;
    }

    const spaceTop = triggerRect.top;
    const spaceBottom = viewport.height - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewport.width - triggerRect.right;

    const tooltipHeight = tooltipRect.height || 40;
    const tooltipWidth = tooltipRect.width || 200;

    let bestPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

    if (spaceTop >= tooltipHeight + offset) {
      bestPosition = 'top';
    } else if (spaceBottom >= tooltipHeight + offset) {
      bestPosition = 'bottom';
    } else if (spaceRight >= tooltipWidth + offset) {
      bestPosition = 'right';
    } else if (spaceLeft >= tooltipWidth + offset) {
      bestPosition = 'left';
    } else {
      bestPosition = spaceBottom > spaceTop ? 'bottom' : 'top';
    }

    setActualPosition(bestPosition);
  };

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(timeout);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (trigger === 'click') {
      e.stopPropagation();
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
    if (children.props.onClick) {
      children.props.onClick(e);
    }
  };

  const handleTriggerFocus = (e: React.FocusEvent) => {
    if (trigger === 'focus') {
      showTooltip();
    }
    if (children.props.onFocus) {
      children.props.onFocus(e);
    }
  };

  const handleTriggerBlur = (e: React.FocusEvent) => {
    if (trigger === 'focus') {
      hideTooltip();
    }
    if (children.props.onBlur) {
      children.props.onBlur(e);
    }
  };

  const handleTriggerMouseEnter = (e: React.MouseEvent) => {
    if (trigger === 'hover') {
      showTooltip();
    }
    if (children.props.onMouseEnter) {
      children.props.onMouseEnter(e);
    }
  };

  const handleTriggerMouseLeave = (e: React.MouseEvent) => {
    if (trigger === 'hover') {
      hideTooltip();
    }
    if (children.props.onMouseLeave) {
      children.props.onMouseLeave(e);
    }
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (trigger === 'click' && isVisible && 
          tooltipRef.current && 
          !tooltipRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)) {
        hideTooltip();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        hideTooltip();
      }
    };

    const handleResize = () => {
      if (isVisible) {
        calculatePosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isVisible, trigger]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const getTooltipClasses = () => {
    const baseClasses = `
      absolute z-50 px-3 py-2 text-sm font-medium text-white
      bg-gray-900 rounded-lg shadow-lg border border-gray-700
      transition-all duration-200 ease-in-out
      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
    `;

    const positionClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2',
      left: 'right-full top-1/2 transform -translate-y-1/2',
      right: 'left-full top-1/2 transform -translate-y-1/2'
    };

    return `${baseClasses} ${positionClasses[actualPosition]} ${className}`;
  };

  const getArrowClasses = () => {
    if (!arrow) return '';

    const arrowClasses = {
      top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900'
    };

    return `absolute w-0 h-0 border-4 ${arrowClasses[actualPosition]}`;
  };

  const getTooltipStyle = () => {
    const style: React.CSSProperties = {
      maxWidth: `${maxWidth}px`,
      zIndex: 9999
    };

    switch (actualPosition) {
      case 'top':
        style.marginBottom = `${offset}px`;
        break;
      case 'bottom':
        style.marginTop = `${offset}px`;
        break;
      case 'left':
        style.marginRight = `${offset}px`;
        break;
      case 'right':
        style.marginLeft = `${offset}px`;
        break;
    }

    return style;
  };

  const triggerElement = cloneElement(children, {
    ref: triggerRef,
    onClick: handleTriggerClick,
    onFocus: handleTriggerFocus,
    onBlur: handleTriggerBlur,
    onMouseEnter: handleTriggerMouseEnter,
    onMouseLeave: handleTriggerMouseLeave,
    'aria-describedby': isVisible ? 'tooltip' : undefined,
  });

  return (
    <div className="relative inline-block">
      {triggerElement}
      <div
        ref={tooltipRef}
        id="tooltip"
        role="tooltip"
        className={getTooltipClasses()}
        style={getTooltipStyle()}
        aria-hidden={!isVisible}
      >
        {content}
        {arrow && <div className={getArrowClasses()} />}
      </div>
    </div>
  );
}