import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface PartnerStory {
  id: string;
  partner_name: string;
  partner_role: string;
  partner_image?: string;
  revenue: string;
  revenue_label: string;
  testimonial: string;
  rating: number;
  date?: string;
}

interface PartnerStoriesCarouselProps {
  stories: PartnerStory[];
}

export function PartnerStoriesCarousel({ stories }: PartnerStoriesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // If 3 or fewer stories, show in grid without carousel
  if (stories.length <= 3) {
    return (
      <div className="mt-16 text-center">
        <h3 className="text-xl md:text-2xl text-procell-dark mb-8">
          🌟 قصص نجاح شركائنا
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          * النتائج الفعلية قد تختلف حسب الجهد المبذول والشبكة الشخصية
        </p>
      </div>
    );
  }

  // Auto-scroll effect for more than 3 stories
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % stories.length);
      }, 4000); // Change story every 4 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, stories.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  // Get 3 visible stories (current, next, next+1)
  const getVisibleStories = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % stories.length;
      visible.push(stories[index]);
    }
    return visible;
  };

  const visibleStories = getVisibleStories();

  return (
    <div className="mt-16 text-center">
      <h3 className="text-xl md:text-2xl text-procell-dark mb-8">
        🌟 قصص نجاح شركائنا
      </h3>
      
      <div 
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            className="border-procell-primary/20 hover:bg-procell-primary/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="border-procell-primary/20 hover:bg-procell-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Stories Grid with Animation */}
        <div className="overflow-hidden">
          <div 
            className="grid md:grid-cols-3 gap-6 transition-all duration-700 ease-in-out"
            style={{
              transform: `translateX(0)`,
            }}
          >
            {visibleStories.map((story, idx) => (
              <div
                key={`${story.id}-${idx}`}
                className="animate-fade-in"
              >
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-procell-primary'
                  : 'w-2 bg-procell-primary/30 hover:bg-procell-primary/50'
              }`}
              aria-label={`Go to story ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        * النتائج الفعلية قد تختلف حسب الجهد المبذول والشبكة الشخصية
      </p>
    </div>
  );
}

function StoryCard({ story }: { story: PartnerStory }) {
  return (
    <Card className="p-6 border-procell-secondary/20 bg-procell-secondary/5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
      <div className="flex flex-col items-center space-y-4 h-full">
        <Avatar className="h-16 w-16 border-2 border-procell-primary/20">
          {story.partner_image && (
            <AvatarImage src={story.partner_image} alt={story.partner_name} />
          )}
          <AvatarFallback className="bg-procell-primary/10 text-procell-primary font-bold">
            {story.partner_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-procell-secondary mb-1">
            {story.revenue} ₪
          </div>
          <div className="text-sm text-muted-foreground mb-3">
            {story.revenue_label}
          </div>
          
          <div className="text-base font-medium text-procell-dark">
            {story.partner_name}
          </div>
          <Badge variant="outline" className="border-procell-accent text-procell-accent text-xs mt-2">
            {story.partner_role}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground text-center line-clamp-3 mt-3 flex-grow">
          {story.testimonial}
        </p>

        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < story.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {story.date && (
          <div className="text-xs text-muted-foreground mt-2">
            {story.date}
          </div>
        )}
      </div>
    </Card>
  );
}
