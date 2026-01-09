import { CheckCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function SuccessNotification({ 
  message, 
  onClose, 
  autoClose = true, 
  duration = 3000 
}: SuccessNotificationProps) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideInRight">
      <div className="bg-white rounded-xl shadow-2xl border border-green-200 p-4 flex items-start gap-3 min-w-[320px] max-w-md">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-green-900 mb-1">Success!</h3>
          <p className="text-sm text-gray-700">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
