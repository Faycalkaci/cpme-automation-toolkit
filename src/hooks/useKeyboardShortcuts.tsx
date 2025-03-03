
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

type ShortcutAction = () => void;

interface ShortcutMapping {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: ShortcutAction;
  description: string;
}

/**
 * Hook for managing keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts: ShortcutMapping[], enabled: boolean = true) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Ignore shortcuts when the user is typing in an input field
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement instanceof HTMLSelectElement ||
      activeElement?.getAttribute('contenteditable') === 'true'
    ) {
      return;
    }
    
    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
      const altMatch = shortcut.altKey ? event.altKey : !event.altKey;
      const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
      
      if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts, enabled]);
  
  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
  
  const showAvailableShortcuts = useCallback(() => {
    const shortcutsList = shortcuts.map(s => {
      const modifiers = [
        s.ctrlKey ? 'Ctrl' : '',
        s.altKey ? 'Alt' : '',
        s.shiftKey ? 'Shift' : ''
      ].filter(Boolean).join('+');
      
      const key = s.key.toUpperCase();
      const combination = modifiers ? `${modifiers}+${key}` : key;
      
      return `${combination}: ${s.description}`;
    }).join('\n');
    
    toast.info("Raccourcis clavier disponibles", {
      description: (
        <pre className="text-xs mt-2 p-2 bg-slate-100 rounded font-mono">
          {shortcuts.map((s, index) => {
            const modifiers = [
              s.ctrlKey ? 'Ctrl' : '',
              s.altKey ? 'Alt' : '',
              s.shiftKey ? 'Shift' : ''
            ].filter(Boolean).join('+');
            
            const key = s.key.toUpperCase();
            const combination = modifiers ? `${modifiers}+${key}` : key;
            
            return (
              <div key={index} className="flex justify-between">
                <span className="font-bold">{combination}:</span>
                <span className="ml-4">{s.description}</span>
              </div>
            );
          })}
        </pre>
      ),
      duration: 10000
    });
  }, [shortcuts]);
  
  return { showAvailableShortcuts };
};
