
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';

interface VideoTutorialProps {
  title: string;
  description: string;
  videoUrl?: string;
  placeholderImage?: string;
  duration?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const VideoTutorial = ({
  title,
  description,
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
  placeholderImage = "https://via.placeholder.com/1280x720?text=CPME+Tool+Tutorial",
  duration = "1:00",
  onClose,
  showCloseButton = true
}: VideoTutorialProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  const handleReset = () => {
    setIsPlaying(false);
  };
  
  return (
    <Card className="overflow-hidden w-full max-w-4xl mx-auto">
      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {showCloseButton && onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="aspect-video bg-slate-100 rounded-md overflow-hidden relative">
          {!isPlaying ? (
            <div className="absolute inset-0">
              <img 
                src={placeholderImage} 
                alt={title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                <Button 
                  size="lg" 
                  className="rounded-full w-16 h-16 flex items-center justify-center mb-4"
                  onClick={handlePlay}
                >
                  <Play className="h-8 w-8" />
                </Button>
                <p className="text-white text-sm">Durée: {duration}</p>
              </div>
            </div>
          ) : (
            <iframe 
              className="w-full h-full" 
              src={videoUrl} 
              title={title} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-slate-500">
          Cette vidéo présente {title.toLowerCase()}.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={isPlaying ? handleReset : handlePlay}
        >
          {isPlaying ? "Revoir la vidéo" : "Regarder la vidéo"}
        </Button>
      </CardFooter>
    </Card>
  );
};
