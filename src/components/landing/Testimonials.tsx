
import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle } from 'lucide-react';

const testimonials = [
  {
    name: "Marie-Claire Durand",
    role: "Assistante Administrative, CPME 93",
    content: "Avant CPME Tool, je passais des heures à copier-coller des données. Maintenant, je génère tous mes documents en quelques clics !",
    rating: 5
  },
  {
    name: "Valérie Martin",
    role: "Présidente, CPME Seine-Saint-Denis",
    content: "Une solution adaptée à nos besoins qui a considérablement amélioré notre productivité. Notre équipe gagne un temps précieux.",
    rating: 5
  },
  {
    name: "Philippe Dubois",
    role: "Directeur, CPME Loire",
    content: "L'interface est intuitive et la génération de documents fonctionne parfaitement. Le support client est également très réactif.",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Ce que nos utilisateurs disent</h2>
          <p className="mt-4 text-lg text-slate-600">
            Découvrez l'expérience de nos utilisateurs avec CPME Tool
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: index * 0.1, duration: 0.5 }} 
              className="bg-white p-8 rounded-lg shadow-soft border border-slate-100"
            >
              <div className="flex mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
                  />
                ))}
              </div>
              <p className="text-slate-600 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cpme-dark flex items-center justify-center mr-3">
                  <MessageCircle className="h-5 w-5 text-cpme" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
