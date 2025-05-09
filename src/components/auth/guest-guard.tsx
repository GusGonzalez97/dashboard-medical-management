'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/auth';
import { logger } from '@/lib/default-logger';
import { paths } from '@/paths';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const { user, loading } = useAuth();
  const router = useRouter()
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  
  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

      if (user) {
        logger.debug('[GuestGuard]: User is logged in, redirecting to dashboard');
        router.replace(paths.dashboard.overview);
        return;
      }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, loading]);

  if (isChecking) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
