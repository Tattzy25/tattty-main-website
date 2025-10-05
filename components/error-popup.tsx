"use client"

import { AlertCircle } from "lucide-react"

interface ErrorPopupProps {
  message: string // User-friendly message only
  onRetry?: () => void
  onClose?: () => void
  retryCount?: number // Track retry attempts
}

export function ErrorPopup({ message, onRetry, onClose, retryCount = 0 }: ErrorPopupProps) {
  const showRetry = onRetry && retryCount < 1 // Only allow 1 retry

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500 rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform animate-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-white mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-3 w-full">
            {showRetry && (
              <button
                onClick={onRetry}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200"
              >
                {showRetry ? "Cancel" : "Close"}
              </button>
            )}
          </div>

          {retryCount >= 1 && (
            <p className="text-sm text-gray-400 mt-4">
              Still having trouble? Please refresh the page or contact support.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
