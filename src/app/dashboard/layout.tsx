'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { usePathname } from 'next/navigation';
import { hideSideNav } from '@/utils/helpers';
import dynamic from 'next/dynamic';

interface LayoutProps {
  readonly children: React.ReactNode;
}
// Cargar SideNav solo cuando se necesite
const SideNav = dynamic(() => import('@/components/dashboard/layout/side-nav'), { ssr: false });

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const pathname = usePathname()
  const [showSideNav,setShowSideNav] = React.useState<boolean>(true)

  React.useEffect(()=>{
    setShowSideNav(!hideSideNav(pathname))
  },[pathname])

  const bodyStyle = React.useMemo(() => ({
    '--MainNav-height': '56px',
    '--MainNav-zIndex': 1000,
    '--SideNav-width': showSideNav ? '280px' : '0px',
    '--SideNav-zIndex': 1100,
    '--MobileNav-width': '320px',
    '--MobileNav-zIndex': 1100,
  }), [showSideNav]);

  return (
    <AuthGuard>
      <GlobalStyles
        styles={{
          body: bodyStyle
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        {showSideNav ? <SideNav /> : null}
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
          <MainNav />
          <main>
            <Container sx={{ py: '48px' }}>
              {children}
            </Container>
          </main>
        </Box>
      </Box>
    </AuthGuard>
  );
}
