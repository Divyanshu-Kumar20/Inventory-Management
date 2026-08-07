import React, { createContext, useContext, useState } from 'react';
import { Toast } from '../components/common/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', title = '') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, title }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const success = (message, title = 'Success') => addToast(message, 'success', title);
  const error = (message, title = 'Error') => addToast(message, 'danger', title);
  const warning = (message, title = 'Warning') => addToast(message, 'warning', title);
  const info = (message, title = 'Information') => addToast(message, 'info', title);

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast
            key={t.id}
            id={t.id}
            title={t.title}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
