
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon, Users } from 'lucide-react';

export const CustomerExperience = () => {
  return (
    <Card className="shadow-lg border-slate-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="bg-cpme/10 p-6 rounded-full">
            <Users className="h-12 w-12 text-cpme" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-medium mb-2">L'expérience CPME Tool</h3>
            <p className="text-slate-600 mb-4">
              Des centaines de CPME à travers la France font confiance à notre solution pour automatiser leurs processus documentaires et gagner un temps précieux.
            </p>
            
            <div className="flex items-center">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium">Plus de 200 CPME satisfaites</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
