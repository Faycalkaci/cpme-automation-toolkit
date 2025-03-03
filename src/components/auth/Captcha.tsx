
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CaptchaProps {
  onVerify: (success: boolean) => void;
  isRequired: boolean;
}

export const Captcha: React.FC<CaptchaProps> = ({ onVerify, isRequired }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);

  // Génère un nouveau texte de captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setError(false);
    setIsVerified(false);
    
    // Notifier le parent que la vérification a été réinitialisée
    if (isRequired) {
      onVerify(false);
    }
  };

  // Valide le captcha
  const validateCaptcha = () => {
    const isValid = userInput === captchaText;
    setIsVerified(isValid);
    setError(!isValid);
    onVerify(isValid);
    
    if (!isValid) {
      // Générer un nouveau captcha en cas d'échec
      setTimeout(generateCaptcha, 1000);
    }
  };

  // Initialiser le captcha au chargement
  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Vérification Captcha {isRequired ? '*' : '(optionnel)'}</div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateCaptcha} 
            type="button"
            aria-label="Rafraîchir le captcha"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div 
          className="text-center py-2 px-4 bg-slate-100 rounded select-none font-mono"
          style={{
            letterSpacing: '0.25em',
            textRendering: 'optimizeSpeed',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#334155',
            userSelect: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'smallGrid\' width=\'8\' height=\'8\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 8 0 L 0 0 0 8\' fill=\'none\' stroke=\'%23AAA\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23smallGrid)\'/%3E%3C/svg%3E")',
          }}
        >
          {captchaText}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            className={cn(
              "flex-1 p-2 border rounded text-center font-mono",
              error ? "border-red-500" : "border-input",
              isVerified ? "border-green-500" : ""
            )}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Entrez le texte ci-dessus"
          />
          <Button 
            type="button" 
            onClick={validateCaptcha}
            size="sm"
            variant={isVerified ? "default" : "outline"}
            disabled={userInput.length < captchaText.length}
            aria-label="Vérifier le captcha"
          >
            {isVerified ? (
              <Check className="h-4 w-4" />
            ) : (
              'Vérifier'
            )}
          </Button>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm flex items-center mt-1">
            <AlertCircle className="h-4 w-4 mr-1" />
            Code incorrect. Veuillez réessayer.
          </div>
        )}
        
        {isVerified && (
          <div className="text-green-500 text-sm flex items-center mt-1">
            <Check className="h-4 w-4 mr-1" />
            Validation réussie!
          </div>
        )}
      </div>
    </Card>
  );
};
