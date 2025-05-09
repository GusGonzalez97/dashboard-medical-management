"use client";

import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Typography, Stack, Grid2, Box, Switch, FormControlLabel, Checkbox, ListItemText } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useCallback, useEffect, useState } from "react";
import { cities } from "@/utils/labels";
import { healthInsuranceList, patologyList } from "@/utils/mocks/medical-records";
import { PatientServices } from "@/services/patient/patient-services";
import { useToast } from "@/contexts/toast-provider";
import { CityEnum, type PatientI, type FormValues } from "@/types/pacient";
import { useRouter } from "next/navigation";
import { handleError } from "@/utils/helpers/error-mapper";
import dayjs from "dayjs";
import { config } from "@/config";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  lastname: z.string().min(1, "El apellido es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  documentNumber: z.string().min(1, "La cédula es requerido"),
  documentProcedureNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  street: z.string().min(1, "La calle es requerida"),
  city: z.enum([CityEnum.CR, CityEnum.CO], {
    required_error: "La ciudad es requerida"
  }),
  hasHealthInsurance: z.boolean(),
  healthInsuranceName: z.string().optional(),
  currentMedications: z.string().optional(),
  medicalHistory: z.array(z.any()).optional(),
  membershipNumber: z.string().optional(),
  email: z.string().optional(),
}).refine(data => {
  if (data.hasHealthInsurance) {
    return data.healthInsuranceName && data.membershipNumber;
  }
  return true;
}, {
  message: "Debe completar la el seguro médico y el número de afiliado",
  path: ["healthInsuranceName"],
});

interface FormProps {
  readonly defaultValues: FormValues
  readonly patientId?: string;
}

export default function CreatePatientForm({ defaultValues, patientId }: FormProps): React.JSX.Element {
  const [loading, setLoading] = useState(false)
  const [patologies, setPatologies] = useState<Record<string, boolean>>({
    glaucoma: false,
    diabetes: false,
    hipertension: false,
    anticoagulado: false,
    miopia: false,
    atigmatismo: false,
    hipermetropia: false,
    cataratas: false
  });
  const { _toast } = useToast()
  const router = useRouter()
  const { control, handleSubmit, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const hasHealthInsurance = watch("hasHealthInsurance");

  useEffect(() => {
    if (!hasHealthInsurance) {
      setValue("healthInsuranceName", "");
      setValue("membershipNumber", "");
    }
  }, [hasHealthInsurance, setValue]);

  useEffect(() => {
    if (defaultValues?.medicalHistory) {
      const updatedPatologies = { ...patologies };
      defaultValues.medicalHistory.forEach((patology: string) => {
        if (updatedPatologies[patology] !== undefined) {
          updatedPatologies[patology] = true;
        }
      });
      setPatologies(updatedPatologies);
    }
  }, [defaultValues]);

  const handleChangePatology = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPatologies(prev => ({ ...prev, [name]: checked }));
  };

  const onSubmit = useCallback(async (values: FormValues): Promise<void> => {
    setLoading(true)
    try {

      const patologyKeys = Object.entries(patologies).reduce<string[]>((acc, [key, value]) => {
        if (value) acc.push(key);
        return acc;
      }, []);
      
      const medicalPatologiesResult = [...values?.medicalHistory ?? [], ...patologyKeys].reduce<string[]>((acc, item) => {
        if (!acc.includes(item)) {
          acc.push(item);
        }
        return acc;
      }, [])

      const data: PatientI = {
        name: values.name,
        lastname: values.lastname,
        phone: values.phone,
        documentNumber: values.documentNumber,
        dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
        address: {
          street: values.street,
          city: values.city,
        },
        healthInsurance: values.hasHealthInsurance ? {
          membershipNumber: Number(values.membershipNumber),
          healthInsuranceName: values.healthInsuranceName,
          documentProcedureNumber: values.documentProcedureNumber
        } : undefined,
        email: values.email,
        doctorId: config.doctorId, // Debe obtenerse dinámicamente
        ophthalmicHistory: values.ophthalmicHistory?.split(','),
        medicalHistory:   medicalPatologiesResult,
        currentMedications: values.currentMedications && values.currentMedications?.length > 0 ? values.currentMedications?.split(',') : []
      };
      if (patientId) {
        await PatientServices.updatePatient({ ...data }, patientId)
      } else {
        await PatientServices.createPatient({ ...data })
      }
      _toast(`Paciente ${patientId ? 'modificado' : 'creado'} con éxito!`, 'success')
      router.back()
    } catch (error) {
      interface ApiError extends Error {
        response?: {
          data?: {
            error?: string;
          };
        };
      }

      if (error instanceof Error && (error as ApiError)?.response?.data?.error) {
        if ((error as ApiError)?.response?.data?.error) {
          _toast(handleError((error as ApiError).response?.data?.error ?? "UNKNOWN_ERROR").message, 'error');
        } else {
          _toast('Ocurrió un error inesperado', 'error');
        }
      } else {
        _toast('Ocurrió un error inesperado', 'error');
      }
    } finally {
      setLoading(false)
    }
  }, [_toast, patientId, router, patologies])

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 20, paddingLeft: 0 }}>
      <Stack spacing={4}>
        <Grid2 container spacing={4} sx={{ marginBottom: 3 }}>
          <Grid2 size={{ xs: 12, md: 6 }} spacing={2}>
            <Typography variant="h6" mb={3}>Datos personales</Typography>
            <Grid2 container spacing={2} rowGap={3}>
              <Grid2 size={{ xs: 6 }} ><Controller name="name" control={control} render={({ field, fieldState }) => (<TextField {...field} label="Nombre" fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />)} /></Grid2>
              <Grid2 size={{ xs: 6 }}><Controller name="lastname" control={control} render={({ field, fieldState }) => (<TextField {...field} label="Apellido" fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />)} /></Grid2>
              <Grid2 size={{ xs: 6 }}><Controller name="documentNumber" control={control} render={({ field, fieldState }) => (<TextField {...field} label="Número de cédula" fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />)} /></Grid2>
              <Grid2 size={{ xs: 6 }}><Controller name="dateOfBirth" control={control} render={({ field, fieldState }) => (<TextField {...field} label="Fecha de Nacimiento" InputLabelProps={{ shrink: true }} type="date" fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />)} /></Grid2>
            </Grid2>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }} spacing={2}>
            <Typography variant="h6" mb={3}>Dirección</Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 6 }}><Controller name="city" control={control} render={({ field, fieldState }) => (<TextField select label="Ciudad" error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth {...field}>{cities.map(option => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}</TextField>)} /></Grid2>
              <Grid2 size={{ xs: 6 }}><Controller name="street" control={control} render={({ field, fieldState }) => (<TextField {...field} label="Dirección" fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />)} /></Grid2>
            </Grid2>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }} spacing={2}>
            <Typography variant="h6" mb={3}>Contacto</Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 6 }}><Controller name="phone" control={control} render={({ field, fieldState }) => (<TextField {...field} label="Teléfono" fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />)} /></Grid2>
              <Grid2 size={{ xs: 6 }}><Controller name="email" control={control} render={({ field, fieldState }) => (<TextField {...field} label="Email" type="email" fullWidth error={Boolean(fieldState.error)} helperText={fieldState.error?.message} />)} /></Grid2>
            </Grid2>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }} spacing={2}>
            <Grid2 container spacing={2} >
              <Grid2 size={{ xs: 12, md: 12 }} >
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 5 }}>
                  <Typography variant="h6">¿Tiene seguro médico?</Typography>
                  <FormControlLabel
                    control={
                      <Controller
                        name="hasHealthInsurance"
                        control={control}
                        render={({ field }) => <Switch {...field} checked={field.value} />}
                      />
                    }
                    label=''
                    sx={{ marginTop: -1 }}
                  />
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 12 }} spacing={2}>
                <Grid2 container spacing={2} >
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="healthInsuranceName"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          select
                          label="Seguro Médico"
                          fullWidth
                          {...field}
                          disabled={!hasHealthInsurance}
                          error={Boolean(fieldState.error)}
                          helperText={fieldState.error?.message}
                        >
                          {healthInsuranceList.map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="membershipNumber"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="Número de Afiliado"
                          type="number"
                          fullWidth
                          disabled={!hasHealthInsurance}
                          error={Boolean(fieldState.error)}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  </Grid2>
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
        <Typography variant="h6" >Antecedentes médicos</Typography>
        <Grid2 container spacing={2} >

          <Grid2 container size={{ md: 6, xs: 12 }} spacing={1} mt={2}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
              {Object.entries(patologies).map(([key, value]) => (

                <FormControlLabel
                  key={key}
                  sx={{ width: '150px' }}
                  control={
                    <Switch
                      checked={value}
                      onChange={handleChangePatology}
                      name={key}
                      color="primary"
                    />
                  }
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </Box>

          </Grid2>
          <Grid2 container size={{ md: 6, xs: 12 }} spacing={1} mt={2}>

            <Grid2 size={{ xs: 12, md: 12 }} >
              <Controller
                name="medicalHistory"
                control={control}
                render={({ field, fieldState }) => (
                    <TextField
                    select
                    label="Otros antecedentes"
                    fullWidth
                    SelectProps={{
                      multiple: true,
                      renderValue: (value: unknown) =>
                      (value as string[])?.map((selectedValue: string) => {
                        const match: { value: string; label: string } | undefined = patologyList.find((opt: { value: string; label: string }) => opt.value === selectedValue);
                        return match?.label ?? null;
                      })
                        .filter((label: string | null) => label !== null)
                        .join(", ")
                        
                    }}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    value={field.value || []}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { field.onChange(e.target.value) }}
                    >
                    {patologyList.map((option: { value: string; label: string }) => (
                      <MenuItem key={option.value} value={option.value}>
                      <Checkbox checked={field.value?.includes(option.value)} />
                      <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                    </TextField>
                )}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 12 }}>
              <Controller
                name="currentMedications"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    label="Medicamentos actuales"
                    fullWidth
                    type='text'
                    placeholder="Escribi una ',' entre cada medicamento"
                    {...field}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid2>
          </Grid2>
        </Grid2>
      </Stack>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }} mt={10}>
        <Button type="submit" variant="contained" sx={{ width: '28%' }} loading={loading} >
          Confirmar
        </Button>
      </Box>
    </form>
  );
}
