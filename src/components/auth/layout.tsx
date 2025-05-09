import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { fourth, secondary } from '@/styles/theme/colors';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'flex' },
        flexDirection: 'row-reverse',
        minHeight: '100%',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        background: `radial-gradient(50% 50% at 50% 50%, ${fourth[900]} 0%, ${fourth[200]} 100%)`,
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', flexGrow:.4 }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          flexGrow:.6,
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography color="inherit" sx={{ fontSize: '30px', lineHeight: '32px', textAlign: 'center' }} variant="h1">
              Bienvenido a{' '}
              <Box component="span" sx={{ color: secondary[800] }}>
                Centro de la visión
              </Box>
            </Typography>
            <Typography align="center" variant="h6" fontWeight='300'>
             Centro de medicina ocular
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              alt="Widgets"
              src="/assets/logo/cdv_logo_sin_fondo.png"
              sx={{ height: 'auto', width: '100%', maxWidth: '350px' }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
