'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { Grid2 } from '@mui/material';
import { useAuth } from '@/contexts/auth';

export default function Page(): React.JSX.Element {
  const {user} = useAuth()

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid2 container spacing={3}>
        <Grid2 size={{lg:4,md:6,xs:12}} >
          <AccountInfo user={user}/>
        </Grid2>
        <Grid2 size={{lg:8,md:6,xs:12}} >
          <AccountDetailsForm user={user}/>
        </Grid2>
      </Grid2>
    </Stack>
  );
}
