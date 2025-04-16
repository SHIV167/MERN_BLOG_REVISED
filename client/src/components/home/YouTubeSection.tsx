import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaPlayCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

const YouTubeSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useMobile();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch YouTube videos data
  const { data: videos, isLoading } = useQuery({
    queryKey: ['/api/youtube-videos'],
  });

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (!videos) return;
    
    const maxSlide = Math.max(0, videos.length - getVisibleSlides());
    if (currentSlide < maxSlide) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const getVisibleSlides = () => {
    if (isMobile.isLarge) return 3;
    if (isMobile.isMedium) return 2;
    return 1;
  };

  const slideWidth = 100 / getVisibleSlides();
  const translateX = -currentSlide * slideWidth;

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-poppins font-bold text-center mb-12">My YouTube Videos</h2>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500" 
              style={{ transform: `translateX(${translateX}%)` }}
            >
              {isLoading ? (
                // Loading skeletons
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className={`flex-shrink-0 px-4`} style={{ width: `${slideWidth}%` }}>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
                      <Skeleton className="w-full h-48" />
                      <div className="p-6">
                        <Skeleton className="h-7 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Video cards
                videos?.map((video) => (
                  <div 
                    key={video.id} 
                    className={`flex-shrink-0 px-4`}
                    style={{ width: `${slideWidth}%` }}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
                      <div className="relative">
                        <img 
                          src={video.thumbnailUrl || "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"} 
                          alt={video.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-primary/50 w-full h-full absolute"></div>
                          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="z-10">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-16 h-16 text-white bg-primary/50 hover:bg-primary/70 rounded-full"
                            >
                              <FaPlayCircle className="w-12 h-12" />
                            </Button>
                          </a>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-poppins font-semibold mb-2">{video.title}</h3>
                        <p className="text-white/80 mb-4">{video.description}</p>
                        <a 
                          href={video.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-secondary hover:text-secondary/80 font-medium"
                        >
                          <span>Watch Video</span>
                          <FaPlayCircle className="ml-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <Button 
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 ml-2 transition-colors z-10"
            size="icon"
            variant="ghost"
          >
            <FaChevronLeft />
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!videos || currentSlide >= videos.length - getVisibleSlides()}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 mr-2 transition-colors z-10"
            size="icon"
            variant="ghost"
          >
            <FaChevronRight />
          </Button>
        </div>
        
        <div className="flex justify-center space-x-2 mt-8">
          {videos?.slice(0, Math.ceil(videos.length / getVisibleSlides())).map((_, index) => (
            <button 
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                Math.floor(currentSlide / getVisibleSlides()) === index
                  ? "bg-white" 
                  : "bg-white/40 hover:bg-white"
              }`}
              onClick={() => setCurrentSlide(index * getVisibleSlides())}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Subscribe to Channel
          </a>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
