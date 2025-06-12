
import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrlKey, metaKey, shiftKey, action }) => {
        const isCtrlMatch = ctrlKey === undefined || ctrlKey === event.ctrlKey;
        const isMetaMatch = metaKey === undefined || metaKey === event.metaKey;
        const isShiftMatch = shiftKey === undefined || shiftKey === event.shiftKey;
        const isKeyMatch = key.toLowerCase() === event.key.toLowerCase();

        if (isCtrlMatch && isMetaMatch && isShiftMatch && isKeyMatch) {
          event.preventDefault();
          action();
        }
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};
