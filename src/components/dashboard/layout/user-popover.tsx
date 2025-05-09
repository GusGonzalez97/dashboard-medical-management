import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useAuth } from '@/contexts/auth';
import { RoleLabel } from '@/types/enum/roles.enum';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export default function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const {logout,user} = useAuth()
  
  const handleSignOut = React.useCallback( (): void => {
    try {
      logout()
    } catch (err) {
      logger.error('Sign out error', err);
    }
  }, [logout]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">{`${user?.name} ${user?.lastName}`}</Typography>
        <Typography color="text.secondary" variant="body2">
          {(user?.roles[1] && RoleLabel[user.roles[1] as keyof typeof RoleLabel]) ?? ''}
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem component={RouterLink} href={paths.dashboard.account} onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Perfil
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
