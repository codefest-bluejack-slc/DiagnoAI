import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  ReactElement,
  cloneElement,
} from 'react';
import { ITooltip } from '../../interfaces/ITooltip';

export default function Tooltip({
  content,
  children,
  position = 'bottom',
  trigger = 'hover',
  className = '',
  disabled = false,
}: ITooltip) {
  const [isVisible, setIsVisible] = useState(false);

  const triggerRef = useRef<HTMLElement>(null);

  const showTooltip = () => {
    if (disabled) return;
    setIsVisible(true);
  };

  const hideTooltip = () => {
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        trigger === 'click' &&
        isVisible &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        hideTooltip();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        hideTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, trigger]);

  const getTooltipClasses = () => {
    const baseClasses = `
      absolute z-50 px-3 py-2 text-sm font-medium text-slate-800
      bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20
      transition-all duration-200 ease-in-out max-w-xs
      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
    `;

    const positionClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    };

    return `${baseClasses} ${positionClasses[position]} ${className}`;
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
        id="tooltip"
        role="tooltip"
        className={getTooltipClasses()}
        aria-hidden={!isVisible}
      >
        {content}
      </div>
    </div>
  );
}
