
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Check } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

// Schema de validation pour le formulaire d'inscription
const registerFormSchema = z.object({
  organizationName: z.string().min(2, {
    message: "Le nom de l'organisation doit contenir au moins 2 caractères.",
  }),
  firstName: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  lastName: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Veuillez entrer un numéro de téléphone valide.",
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Vous devez accepter les conditions d'utilisation."
  }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 10 
      } 
    }
  };

  // Initialiser le formulaire
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      organizationName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      acceptTerms: false,
    },
  });

  // Gestion de la soumission du formulaire
  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Appel à l'API d'inscription
      await register(data.email, data.password, `${data.firstName} ${data.lastName}`);
      
      // Afficher un toast de succès
      toast.success('Compte créé avec succès!', {
        description: 'Vous allez être redirigé vers la page de connexion.',
        duration: 5000,
      });
      
      // Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      toast.error('Erreur lors de l\'inscription', {
        description: 'Veuillez réessayer ultérieurement.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricingFeatures = [
    "Accès à tous les modèles de documents",
    "Génération illimitée de PDF",
    "Envoi d'emails automatisé",
    "Support technique prioritaire",
    "Mises à jour gratuites"
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <Toaster />
      
      <div className="max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-8" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l'accueil
        </Button>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Formulaire d'inscription */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Créer votre compte</CardTitle>
                <CardDescription>
                  Inscrivez-vous pour commencer à utiliser CPME Tool
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l'organisation</FormLabel>
                          <FormControl>
                            <Input placeholder="CPME Seine-Saint-Denis" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="exemple@cpme.fr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de téléphone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="01 23 45 67 89" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              J'accepte les{" "}
                              <Link to="/terms" className="text-primary hover:underline">
                                conditions d'utilisation
                              </Link>{" "}
                              et la{" "}
                              <Link to="/privacy" className="text-primary hover:underline">
                                politique de confidentialité
                              </Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Création en cours..." : "Créer un compte"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              
              <CardFooter className="flex justify-center border-t pt-6">
                <p className="text-sm text-muted-foreground">
                  Vous avez déjà un compte ?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Connexion
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Information sur l'abonnement */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-cpme to-cpme-dark text-white shadow-lg h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Abonnement CPME Tool</CardTitle>
                <CardDescription className="text-white/90">
                  Essai gratuit de 14 jours, sans carte bancaire
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <p className="text-5xl font-bold">29€<span className="text-lg font-normal">/mois</span></p>
                  <p className="text-white/80 mt-2">par organisation</p>
                </div>
                
                <div className="space-y-4">
                  <p className="font-medium">Ce que vous obtenez :</p>
                  <ul className="space-y-3">
                    {pricingFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="bg-white rounded-full p-1 mr-3 flex-shrink-0">
                          <Check className="h-3 w-3 text-cpme-dark" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-white/20 pt-6">
                <p className="text-sm text-white/80">
                  Vous pouvez annuler à tout moment pendant la période d'essai gratuit.
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
