'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface ToastState {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

let toastId = 0
const toastSubscribers: ((toasts: ToastState[]) => void)[] = []
let toasts: ToastState[] = []

const notifySubscribers = () => {
  toastSubscribers.forEach(callback => callback([...toasts]))
}

export const toast = {
  success: (message: string) => {
    const id = (++toastId).toString()
    toasts.push({ id, message, type: 'success' })
    notifySubscribers()
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id)
      notifySubscribers()
    }, 4000)
  },
  
  error: (message: string) => {
    const id = (++toastId).toString()
    toasts.push({ id, message, type: 'error' })
    notifySubscribers()
    
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id)
      notifySubscribers()
    }, 4000)
  }
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<ToastState[]>([])

  useEffect(() => {
    const handleToastUpdate = (newToasts: ToastState[]) => {
      setCurrentToasts(newToasts)
    }
    
    toastSubscribers.push(handleToastUpdate)
    
    return () => {
      const index = toastSubscribers.indexOf(handleToastUpdate)
      if (index > -1) {
        toastSubscribers.splice(index, 1)
      }
    }
  }, [])

  const removeToast = (id: string) => {
    toasts = toasts.filter(t => t.id !== id)
    notifySubscribers()
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-lg shadow-lg border max-w-sm animate-in slide-in-from-right duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.type === 'success' && (
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
          )}
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className={`ml-3 flex-shrink-0 rounded-full p-1 hover:bg-opacity-20 transition-colors ${
              toast.type === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
} 