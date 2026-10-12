import React, { useState } from 'react';
import { generateArtworkFallback } from '../../utils/artworkFallback';

interface ArtworkImageProps {
  src?: string;
  alt: string;
  id: string;
  title: string;
  artistName?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  aspectRatio?: 'square' | 'wide';
}

export const ArtworkImage: React.FC<ArtworkImageProps> = ({
  src,
  alt,
  id,
  title,
  artistName = 'SONORA',
  className = '',
  size = 'md',
  aspectRatio = 'square',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fallbackUri = generateArtworkFallback(title, artistName, id);

  const sizeClasses = {
    sm: 'w-10 h-10 min-w-10',
    md: 'w-14 h-14 min-w-14',
    lg: 'w-24 h-24 min-w-24',
    xl: 'w-48 h-48 min-w-48 md:w-56 md:h-56',
    full: 'w-full h-full',
  }[size];

  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 'aspect-video';

  return (
    <div
      className={`relative overflow-hidden rounded-md bg-[#141820] select-none ${sizeClasses} ${aspectClass} ${className}`}
    >
      {/* Skeleton loading shimmer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#1E2533] animate-pulse" />
      )}

      <img
        src={hasError || !src ? fallbackUri : src}
        alt={alt || title}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
