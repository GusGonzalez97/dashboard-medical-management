import type { MedicalAppointmentI } from '@/types/medical-appointment';
import { Card, CardContent, Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

interface AppointmentCardProps{
    appointment?:MedicalAppointmentI
} 

export default function AppointmentDetailCardResume({ appointment }: AppointmentCardProps): React.JSX.Element { 
  return (
    <Card sx={{ maxWidth: 400, borderRadius: 3, boxShadow: 3,pt:0 }}>
      <CardContent>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha de turno
            </Typography>
            <Typography variant="body2">{dayjs(appointment?.date).format('DD/MM/YYYY HH:MM')}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Motivo de consulta
            </Typography>
            <Typography variant="body2">{appointment?.reason}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Práctica
            </Typography>
            <Typography variant="body2">{appointment?.practice}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Sucursal
            </Typography>
            <Typography variant="body2">{appointment?.branch.name}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

