
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

// Global state for toasts
let globalToasts: ToastProps[] = []
let listeners: Array<(toasts: ToastProps[]) => void> = []

const addToast = (props: Omit<ToastProps, "id">) => {
  const id = Math.random().toString(36).substring(2, 9)
  globalToasts = [...globalToasts, { ...props, id }].slice(-TOAST_LIMIT)
  listeners.forEach(listener => listener(globalToasts))
}

const dismissToast = (toastId?: string) => {
  if (toastId) {
    globalToasts = globalToasts.filter((toast) => toast.id !== toastId)
  } else {
    globalToasts = []
  }
  listeners.forEach(listener => listener(globalToasts))
}

// Singleton toast function
export const toast = (props: Omit<ToastProps, "id">) => {
  addToast(props)
}

toast.dismiss = dismissToast

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>(globalToasts)

  const addListener = useCallback((listener: (toasts: ToastProps[]) => void) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  const memoizedToast = useCallback(
    (props: Omit<ToastProps, "id">) => {
      addToast(props)
    },
    []
  )

  const dismiss = useCallback((toastId?: string) => {
    dismissToast(toastId)
  }, [])

  // Subscribe to global toast changes
  useState(() => {
    const unsubscribe = addListener(setToasts)
    return unsubscribe
  })

  return {
    toast: memoizedToast,
    dismiss,
    toasts,
  }
}
