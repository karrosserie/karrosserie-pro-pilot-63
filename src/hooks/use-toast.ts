
import { useState, useCallback } from 'react'

// Interfaces for the toast functionality
export interface ToastActionElement {
  altText?: string
  onClick: () => void
  children: React.ReactNode
}

export interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
}

const TOAST_LIMIT = 20
const TOAST_REMOVE_DELAY = 1000

// Create a toast function outside the hook to avoid recreation on each render
const toastFn = (props: Omit<ToastProps, "id">) => {
  // This will be replaced by the actual implementation in the hook
  console.warn("Toast called outside of context");
};

// Singleton pattern to make toast accessible outside of React components
export const toast = Object.assign(toastFn, {
  // Default empty implementation
  dismiss: (toastId?: string) => {},
});

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((props: Omit<ToastProps, "id">) => {
    setToasts((toasts) => {
      const id = Math.random().toString(36).substring(2, 9)
      return [...toasts, { ...props, id }].slice(-TOAST_LIMIT)
    })
  }, [])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((toasts) => {
      if (toastId) {
        return toasts.filter((toast) => toast.id !== toastId)
      }
      return []
    })
  }, [])

  // Update the singleton methods to use the current function
  const memoizedToast = useCallback(
    (props: Omit<ToastProps, "id">) => {
      addToast(props)
    },
    [addToast]
  )

  // Update the singleton methods with the current implementation
  toast.dismiss = dismiss;
  
  // Return the toast interface
  return {
    toast: memoizedToast,
    dismiss,
    toasts,
  }
}
