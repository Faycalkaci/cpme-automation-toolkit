
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const IntroVideo = () => {
  return (
    <Card className="shadow-lg border-slate-200">
      <CardContent className="p-0 overflow-hidden rounded-lg">
        <div className="aspect-video relative">
          <iframe 
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Placeholder - replace with actual video
            title="CPME Tool Tutorial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium">Comment utiliser CPME Tool</h3>
          <p className="text-sm text-slate-600 mt-1">
            Cette vidéo vous guide à travers les fonctionnalités principales de notre outil pour vous aider à démarrer rapidement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
