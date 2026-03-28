import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--success-color)',
      color: '#fff',
      padding: '0.8rem 1.7rem',
      borderRadius: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      fontWeight: '600',
      boxShadow: '0 8px 24px rgba(35, 134, 54, 0.4)',
      zIndex: 1000,
      animation: 'slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
    }}>
      <CheckCircle size={20} />
      <span>{message}</span>
    </div>
  );
};
