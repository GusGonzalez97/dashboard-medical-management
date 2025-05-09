'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useAuth } from '@/contexts/auth';
import dynamic from 'next/dynamic';

export interface AuthGuardProps {
  children: React.ReactNode;
}

const FullScreenLoader = dynamic(() => import('@/components/core/loader/loader'), { ssr: false });


export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = React.useState<boolean>(false);

  const checkPermissions = React.useCallback((): void => {
    setIsChecking(true);
    if (loading) {
      return;
    }
  
    if (!user) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
      router.replace(paths.auth.signIn);
      return;
    }
  
    setIsChecking(false);
  }, [loading, user, router]);
  
  React.useEffect(() => {
    checkPermissions()
  }, [checkPermissions]);

  if (isChecking && loading) {
    return <FullScreenLoader open={loading}/>
  }

  return <React.Fragment>{children}</React.Fragment>;
}
