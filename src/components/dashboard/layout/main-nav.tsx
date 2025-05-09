'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { usePopover } from '@/hooks/use-popover';

import { usePathname } from 'next/navigation';
import { ArrowLeft } from '@phosphor-icons/react';
import { hideSideNav } from '@/utils/helpers';
import dynamic from 'next/dynamic';

const MobileNav = dynamic(()=> import('@/components/dashboard/layout/mobile-nav'),{ssr:false})
const UserPopover = dynamic(() => import('./user-popover'), { ssr: false });
const RouterHandlerButton = dynamic(()=> import('@/components/core/handler-router'),{ssr:false})


export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [showListButton,setShowListButton] = React.useState(true)
  const pathname = usePathname();

  React.useEffect(()=>{
    setShowListButton(!hideSideNav(pathname))
  },[pathname])

  const userPopover = usePopover<HTMLDivElement>();

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: '#c7f8ff',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '80px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
         {showListButton ?
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>: 
                <RouterHandlerButton variant='text' title='Volver' icon={<ArrowLeft />} />
              }
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              alt='Imagen de perfil'
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
