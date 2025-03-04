
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface PasswordInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ value, onChange, onBlur, name, disabled = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <Input 
          placeholder="••••••••" 
          type={showPassword ? "text" : "password"} 
          autoComplete="current-password"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          ref={ref}
          disabled={disabled}
          {...props} 
        />
        <button
          type="button"
          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
          onClick={togglePasswordVisibility}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
