
import { useState, useEffect, useCallback } from 'react'

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
  action?: ToastActionElement
  variant?: 'default' | 'destructive'
}

const TOAST_LIMIT = 20
const TOAST_REMOVE_DELAY = 1000

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((toast: Omit<ToastProps, "id">) => {
    setToasts((toasts) => {
      const id = Math.random().toString(36).substring(2, 9)
      return [...toasts, { ...toast, id }].slice(-TOAST_LIMIT)
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

  const toast = useCallback(
    (props: Omit<ToastProps, "id">) => {
      addToast(props)
    },
    [addToast]
  )

  return {
    toast,
    dismiss,
    toasts,
  }
}

export { toast } from "@/components/ui/use-toast"
