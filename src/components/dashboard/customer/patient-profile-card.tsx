'use client'
import StatusChip from "@/components/core/Chip/status-chip";
import type { PatientI } from "@/types/pacient";
import { branchDictionary, patologiesDictionary } from "@/utils/dictionary/general";
import { patologyStatusColorMap } from "@/utils/mocks/medical-records";
import { Card, CardContent, Chip, Grid2, Typography, useMediaQuery, useTheme } from "@mui/material";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es'; // 👈 Importar el locale español
import React from "react";

interface PatientProps {
  readonly patient?: PatientI;
  readonly hiddenOpthalmicData?: boolean;
}

dayjs.extend(utc);
dayjs.extend(timezone);

export default function PatientProfileCard({ patient, hiddenOpthalmicData }: PatientProps): React.JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={{maxWidth:'100%',
      p: {
        xs: 0.3, sm: 1, background: 'linear-gradient(180deg, rgba(199,248,255,0.7973564425770308) 0%, rgba(224,251,255,0.7973564425770308) 63%, rgba(255,255,255,1) 100%)'
      }
    }}>
      <CardContent>
        <Grid2 container spacing={2} alignItems="start">
          <Grid2 size={{ xs: 12, md: 5 }} container spacing={2}>
            <Grid2 size={{ xs: 12 }} display="flex" gap={0.5}>
              <Typography variant="body1" fontWeight={600}>Cédula:</Typography>
              <Typography variant="body1">{Number(patient?.documentNumber).toLocaleString('es-AR')}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }} display="flex" gap={0.5}>
              <Typography variant="body1" fontWeight={600}>Fecha de nacimiento:</Typography>
              <Typography variant="body1">    {dayjs.utc(patient?.dateOfBirth).add(5,'hours').format('DD/MM/YYYY')}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }} display="flex" gap={0.5}>
              <Typography variant="body1" fontWeight={600}>Dirección:</Typography>
              <Typography variant="body1">{ branchDictionary[patient?.address.city ?? '']}, {patient?.address?.street}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }} display="flex" gap={0.5}>
              <Typography variant="body1" fontWeight={600}>Email:</Typography>
              <Typography variant="body1">{patient?.email}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12 }} display="flex" gap={0.5}>
              <Typography variant="body1" fontWeight={600}>Teléfono:</Typography>
              <Typography variant="body1">{patient?.phone}</Typography>
            </Grid2>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 7 }} container spacing={2}>
            {!hiddenOpthalmicData && (
              <Grid2 size={{ xs: 12 }} container spacing={1}>
                {patient?.medicalHistory ? (
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="body1" fontWeight={600}>Antecedentes:</Typography>
                    <Grid2 display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                      {patient.medicalHistory.map((opthalmicPatology) => (
                       patologiesDictionary[opthalmicPatology] && <StatusChip
                          key={opthalmicPatology}
                          status={opthalmicPatology}
                          statusDictionary={patologiesDictionary}
                          size="small"
                          variant='filled'
                          statusColorMap={patologyStatusColorMap}
                        />
                      ))}
                    </Grid2>
                  </Grid2>
                ) : null}
                {patient?.currentMedications ? (
                  <Grid2 size={{ xs: 12 }} >
                    <Typography variant="body1" fontWeight={600}>Medicamentos:</Typography>
                    <Grid2 display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                      {patient.currentMedications.length > 0 ? (
                        patient.currentMedications.map((medication) => (
                          <Chip
                            key={medication}
                            label={medication}
                            sx={{ fontSize: 12 }}
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="body2">-</Typography>
                      )}
                    </Grid2>
                  </Grid2>
                ) : null}
              </Grid2>
            )}
            <Grid2 size={{ xs: 12 }} display="flex" gap={0.5}>
              <Typography variant="body1" fontWeight={600}>{isMobile ? 'Seg. Médico: ' :'Seguro Médico:'}</Typography>
              <Typography variant="body1">
                {patient?.healthInsurance?.healthInsuranceName} ({patient?.healthInsurance?.membershipNumber})
              </Typography>
            </Grid2>
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
}
