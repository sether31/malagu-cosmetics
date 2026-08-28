import React from "react";

export interface SliderItem {
  id: string | number;
  text?: string;
  icon?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

interface InfiniteSliderProps {
  items: SliderItem[];
  className?: string;
}

export const InfiniteSlider = ({ items, className = "" }: InfiniteSliderProps) => {
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className={`relative w-full overflow-hidden flex bg-surface py-6 group ${className}`}>
      
      <div className="absolute top-0 bottom-0 left-0 z-10 w-16 pointer-events-none md:w-32 bg-gradient-to-r from-surface to-transparent"></div>

      <div className="flex items-center w-max gap-8 pr-8 animate-infinite-scroll group-hover:[animation-play-state:paused] hover:cursor-not-allowed">
        {duplicatedItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className="flex items-center flex-shrink-0 gap-3 px-5 py-2.5  backdrop-blur-sm transition-colors cursor-pointer hover:cursor-not-allowed"
          >
            {item.imageSrc && (
              <div className="flex-shrink-0 w-12 h-8 overflow-hidden rounded-sm sm:h-10 sm:w-16">
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt || ""}
                  className="object-cover w-full h-full pointer-events-none select-none"
                  draggable="false"
                />
              </div>
            )}
            
            {item.icon && (
              <span className="flex-shrink-0 text-primary">
                {item.icon}
              </span>
            )}
            
            {item.text && (
              <span className="text-sm font-medium tracking-wide uppercase text-primary whitespace-nowrap">
                {item.text}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="absolute top-0 bottom-0 right-0 z-10 w-16 pointer-events-none md:w-32 bg-gradient-to-l from-surface to-transparent"></div>
    </div>
  );
};