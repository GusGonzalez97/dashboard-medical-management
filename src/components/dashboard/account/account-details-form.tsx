'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Grid2 } from '@mui/material';
import type { PlatformUserI } from '@/types/user';

interface AccountDetailFormProps {
  user: PlatformUserI | null;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
};

export function AccountDetailsForm({ user }: AccountDetailFormProps): React.JSX.Element {
  const defaultValues = React.useMemo(() => ({
    firstName: user?.name ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    role: Array.isArray(user?.roles) ? user.roles.join(', ') : user?.roles ?? '',
  }), [user]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm<FormValues>({ defaultValues });

  // Actualiza el formulario si cambia el user
  React.useEffect(() => {
    if (user) {
      reset({
        firstName: user.name ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        role: Array.isArray(user.roles) ? user.roles.join(', ') : user.roles ?? '',
      });
    }
  }, [user, reset]);

  const formValues = watch();

  const isFormChanged = React.useMemo(() => {
    return JSON.stringify(formValues) !== JSON.stringify(defaultValues);
  }, [formValues, defaultValues]);

  return (
    <form onSubmit={handleSubmit(() => { /* Add form submission logic here */ })}>
      <Card>
        <CardHeader subheader="Esta información puede ser editada" title="Perfil" />
        <Divider />
        <CardContent>
          <Grid2 container spacing={3}>
            <Grid2 size={{md:6,xs:12}}>
              <FormControl fullWidth required>
                <InputLabel>Nombre</InputLabel>
                <OutlinedInput {...register('firstName', { required: true })} label="Nombre" />
              </FormControl>
            </Grid2>
            <Grid2 size={{md:6,xs:12}}>
              <FormControl fullWidth required>
                <InputLabel>Apellido</InputLabel>
                <OutlinedInput {...register('lastName', { required: true })} label="Apellido" />
              </FormControl>
            </Grid2>
            <Grid2 size={{md:6,xs:12}}>
              <FormControl fullWidth required>
                <InputLabel>Email</InputLabel>
                <OutlinedInput {...register('email', { required: true })} label="Email" />
              </FormControl>
            </Grid2>
            <Grid2 size={{md:6,xs:12}}>
              <FormControl fullWidth>
                <InputLabel>Número de teléfono</InputLabel>
                <OutlinedInput {...register('phoneNumber')} label="Número de teléfono" />
              </FormControl>
            </Grid2>
            <Grid2 size={{md:6,xs:12}}>
              <FormControl fullWidth>
                <InputLabel>Rol de plataforma</InputLabel>
                <OutlinedInput {...register('role')} label="Rol" />
              </FormControl>
            </Grid2>
          </Grid2>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button disabled={!isFormChanged} type="submit" variant="contained">
            Guardar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
