import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { ThemeProviderLocal } from '@/components/core/theme-provider/theme-provider';
import { ToastProvider } from '@/contexts/toast-provider';
import { AuthProvider } from '@/contexts/auth';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        <title>Centro de la visión</title>
      </head>
      <body>
        <ToastProvider>
          <AuthProvider>
            <ThemeProviderLocal>{children}</ThemeProviderLocal>
          </AuthProvider>
          </ToastProvider>
      </body>
    </html>
  );
}
