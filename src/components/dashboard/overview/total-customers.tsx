'use client'
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CountUp from 'react-countup';
import { tertiary } from '@/styles/theme/colors';

export interface TotalCustomersProps {
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: number; // 👈 cambiamos de string a number
  title: string;
  icon: React.ReactNode;
}

export function TotalCustomers({ sx, value, title, icon }: TotalCustomersProps): React.JSX.Element {

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                {title}
              </Typography>
              <Typography variant="h4">
                <CountUp end={value} duration={2} separator="." />
              </Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: tertiary[400], height: '56px', width: '56px' }} alt='Imagen de perfil'>
              {icon}
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
