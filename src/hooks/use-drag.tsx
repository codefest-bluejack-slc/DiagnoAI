import { useRef, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  dragOffset: Position;
  initialPosition: Position;
}

interface UseDragProps {
  onDragStart?: (elementId: string) => void;
  onDragEnd?: (elementId: string, position: Position) => void;
  onDrag?: (elementId: string, position: Position) => void;
  constrainToParent?: boolean;
  containerSelector?: string;
}

interface DragHandlers {
  onMouseDown: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
}

export function useDrag(elementId: string, options: UseDragProps = {}): DragHandlers {
  const dragStateRef = useRef<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    initialPosition: { x: 0, y: 0 }
  });

  const { onDragStart, onDragEnd, onDrag, constrainToParent = true, containerSelector } = options;

  const getContainer = useCallback((element: HTMLElement): HTMLElement | null => {
    if (containerSelector) {
      return document.querySelector(containerSelector) as HTMLElement;
    }
    return element.offsetParent as HTMLElement;
  }, [containerSelector]);

  const getElementPosition = useCallback((element: HTMLElement): Position => {
    const rect = element.getBoundingClientRect();
    const container = getContainer(element);
    const containerRect = container?.getBoundingClientRect() || { left: 0, top: 0 };
    
    const containerStyle = container ? window.getComputedStyle(container) : null;
    const paddingTop = containerStyle ? parseFloat(containerStyle.paddingTop) || 0 : 0;
    const paddingLeft = containerStyle ? parseFloat(containerStyle.paddingLeft) || 0 : 0;
    
    let headerOffset = 0;
    if (container && containerSelector === '.info-section-container') {
      const header = container.querySelector('.info-header');
      headerOffset = header?.getBoundingClientRect().height || 0;
    }
    
    return {
      x: rect.left - containerRect.left - paddingLeft,
      y: rect.top - containerRect.top - paddingTop - headerOffset
    };
  }, [getContainer, containerSelector]);

  const constrainPosition = useCallback((position: Position, element: HTMLElement): Position => {
    if (!constrainToParent) return position;

    const container = getContainer(element);
    if (!container) return position;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    const containerStyle = window.getComputedStyle(container);
    const paddingTop = parseFloat(containerStyle.paddingTop) || 0;
    const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
    const paddingBottom = parseFloat(containerStyle.paddingBottom) || 0;

    let headerOffset = 0;
    if (containerSelector === '.info-section-container') {
      const header = container.querySelector('.info-header');
      headerOffset = header?.getBoundingClientRect().height || 0;
    }

    const minX = paddingLeft;
    const minY = paddingTop;
    const maxX = containerRect.width - elementRect.width - paddingRight;
    const maxY = containerRect.height - elementRect.height - paddingBottom - headerOffset - 20;

    return {
      x: Math.max(minX, Math.min(maxX, position.x)),
      y: Math.max(minY, Math.min(maxY, position.y))
    };
  }, [constrainToParent, getContainer, containerSelector]);

  const updateElementPosition = useCallback((element: HTMLElement, position: Position) => {
    const constrainedPosition = constrainPosition(position, element);
    element.style.left = `${constrainedPosition.x}px`;
    element.style.top = `${constrainedPosition.y}px`;
    return constrainedPosition;
  }, [constrainPosition]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    const element = document.getElementById(elementId) as HTMLElement;
    if (!element) return;

    const container = getContainer(element);
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerStyle = window.getComputedStyle(container);
    const paddingTop = parseFloat(containerStyle.paddingTop) || 0;
    const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
    
    let headerOffset = 0;
    if (containerSelector === '.info-section-container') {
      const header = container.querySelector('.info-header');
      headerOffset = header?.getBoundingClientRect().height || 0;
    }
    
    const currentPosition = getElementPosition(element);
    
    const dragOffset = {
      x: clientX - containerRect.left - paddingLeft - currentPosition.x,
      y: clientY - containerRect.top - paddingTop - headerOffset - currentPosition.y
    };

    dragStateRef.current = {
      isDragging: true,
      dragOffset,
      initialPosition: currentPosition
    };

    element.style.zIndex = '1000';
    element.classList.add('dragging');
    
    onDragStart?.(elementId);
  }, [elementId, getContainer, getElementPosition, onDragStart, containerSelector]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!dragStateRef.current.isDragging) return;

    const element = document.getElementById(elementId) as HTMLElement;
    if (!element) return;

    const container = getContainer(element);
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerStyle = window.getComputedStyle(container);
    const paddingTop = parseFloat(containerStyle.paddingTop) || 0;
    const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
    
    let headerOffset = 0;
    if (containerSelector === '.info-section-container') {
      const header = container.querySelector('.info-header');
      headerOffset = header?.getBoundingClientRect().height || 0;
    }
    
    const newPosition = {
      x: clientX - containerRect.left - paddingLeft - dragStateRef.current.dragOffset.x,
      y: clientY - containerRect.top - paddingTop - headerOffset - dragStateRef.current.dragOffset.y
    };

    const finalPosition = updateElementPosition(element, newPosition);
    onDrag?.(elementId, finalPosition);
  }, [elementId, getContainer, updateElementPosition, onDrag, containerSelector]);

  const handleEnd = useCallback(() => {
    if (!dragStateRef.current.isDragging) return;

    const element = document.getElementById(elementId) as HTMLElement;
    if (!element) return;

    const finalPosition = getElementPosition(element);
    
    dragStateRef.current.isDragging = false;
    element.style.zIndex = '';
    element.classList.remove('dragging');

    onDragEnd?.(elementId, finalPosition);
  }, [elementId, getElementPosition, onDragEnd]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      handleMove(event.clientX, event.clientY);
    };

    const handleMouseUp = () => {
      handleEnd();
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];
      if (touch) {
        handleMove(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    if (dragStateRef.current.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleMove, handleEnd]);

  const onMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    handleStart(event.clientX, event.clientY);
  }, [handleStart]);

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) {
      handleStart(touch.clientX, touch.clientY);
    }
  }, [handleStart]);

  return {
    onMouseDown,
    onTouchStart
  };
}
