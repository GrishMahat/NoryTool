/** @format */

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  afterStyle?: React.CSSProperties;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  before,
  after,
  afterStyle,
  className,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const newPosition = Math.max(0, Math.min(x, rect.width));
      setSliderPosition((newPosition / rect.width) * 100);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => handleMove(e.clientX), [handleMove]);
  const handleTouchMove = useCallback((e: TouchEvent) => handleMove(e.touches[0].clientX), [handleMove]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("touchmove", handleTouchMove);
      };

      container.addEventListener("mousedown", () => {
        document.addEventListener("mousemove", handleMouseMove);
      });
      container.addEventListener("touchstart", () => {
        document.addEventListener("touchmove", handleTouchMove);
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);

      return () => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [handleMouseMove, handleTouchMove]);

  return (
    <div
      ref={containerRef}
      className={`relative cursor-ew-resize select-none ${className}`}>
      <div className='absolute top-0 left-0 w-full h-full'>
        <Image
          src={before}
          alt='Original'
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div
        className='absolute top-0 left-0 w-full h-full overflow-hidden'
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
        <div className='relative w-full h-full'>
          <Image
            src={after}
            alt='Filtered'
            layout="fill"
            objectFit="cover"
            style={afterStyle}
          />
        </div>
      </div>
      <div
        className='absolute top-0 bottom-0 w-0.5 bg-white shadow-lg'
        style={{ left: `calc(${sliderPosition}% - 0.5px)` }}>
        <div className='absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M21 12H3M9 5l-7 7 7 7M15 5l7 7-7 7' />
          </svg>
        </div>
      </div>
    </div>
  );
};
