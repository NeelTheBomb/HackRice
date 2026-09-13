import { useState } from "react";
import type { LocationMedia } from "../types/tour";

interface MediaCarouselProps {
  media: readonly LocationMedia[];
  title: string;
}

export function MediaCarousel({ media, title }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleItems = media.length > 1;

  const move = (direction: -1 | 1) => {
    if (!hasMultipleItems) return;
    setActiveIndex((currentIndex) =>
      (currentIndex + direction + media.length) % media.length,
    );
  };

  return (
    <section className="media-carousel" aria-label={`${title} media`}>
      <div className="media-carousel__viewport">
        <div
          className="media-carousel__track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {media.map((item, index) => (
            <figure
              className="media-carousel__slide"
              key={`${item.type}-${item.src}`}
              aria-hidden={index !== activeIndex}
              inert={index !== activeIndex}
            >
              {item.type === "image" ? (
                <img src={item.src} alt={item.alt} />
              ) : (
                <video
                  src={item.src}
                  aria-label={item.label}
                  poster={item.poster}
                  controls
                  preload="metadata"
                />
              )}
            </figure>
          ))}
        </div>
      </div>

      <div className="media-carousel__controls">
        <button
          type="button"
          aria-label="Previous media"
          disabled={!hasMultipleItems}
          onClick={() => move(-1)}
        >
          Previous
        </button>
        <span aria-live="polite" aria-atomic="true">
          {media.length === 0 ? 0 : activeIndex + 1} of {media.length}
        </span>
        <button
          type="button"
          aria-label="Next media"
          disabled={!hasMultipleItems}
          onClick={() => move(1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
