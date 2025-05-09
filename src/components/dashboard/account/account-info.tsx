'use client'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { PlatformUserI } from '@/types/user';

interface AccountProps {
  user:PlatformUserI | null
}

export function AccountInfo({user}:AccountProps): React.JSX.Element{
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src='/assets/avatar.png' sx={{ height: '80px', width: '80px' }} alt='Imagen de perfil'/>
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{`${user?.name} ${user?.lastName}`}</Typography>
          </Stack>
        </Stack>
      </CardContent>
     
    </Card>
  );
}
