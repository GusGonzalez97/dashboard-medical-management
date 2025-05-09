'use client'
import 'react-toastify/dist/ReactToastify.css';
import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { toast, ToastContainer, type TypeOptions } from 'react-toastify';

const ToastContext = createContext<{ _toast: (title: string, type: TypeOptions) => void } | undefined>(undefined);

interface ToastProviderProps {
  readonly children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps): React.JSX.Element {
  const _toast = useCallback((title: string, type: TypeOptions) => {
    toast(title, {
      autoClose: 4000,
      theme: 'light',
      type,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, []);

  const value = useMemo(() => ({ _toast }), [_toast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastContainer
        closeOnClick
        draggable
        pauseOnFocusLoss
        pauseOnHover
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        position='top-right'
        rtl={false}
        theme='light'
      />
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = (): { _toast: (title: string, type: TypeOptions) => void } => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
};
