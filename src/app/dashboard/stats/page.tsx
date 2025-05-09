'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import AppointmentsStatsCard from '@/components/dashboard/stats/stats-main-page';
import StatsServices from '@/services/stats/stats-services';
import type { AppointmentStatusData, BranchAppointmentsData } from '@/types/medical-appointment';
import type { HealthInsuranceData } from '@/types/medical-record';
import dynamic from 'next/dynamic';

const FullScreenLoader = dynamic(()=> import('@/components/core/loader/loader'),{ssr:false})

export default function StatsPage(): React.JSX.Element {
  const [appointmentsByStatus, setAppointmentsByStatus] = useState<AppointmentStatusData[]>([]);
  const [appointmentsByBranch, setAppointmentsByBranch] = useState<BranchAppointmentsData[]>([]);
  const [patientsByHealthInsurance, setPatientsByHealthInsurance] = useState<HealthInsuranceData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async()=>{
    try {
      const [
        appointmentsStatus,
        healthInsurance,
        appointmentsBranch,
      ] = await Promise.all([
        StatsServices.getAppointmentCreationStatsByStatus(),
        StatsServices.getPatientByHealthInsuranceStats(),
        StatsServices.getAppointmentCreationStatsByBranch(),
      ]);
      setAppointmentsByStatus(appointmentsStatus.data.data);
      setPatientsByHealthInsurance(healthInsurance.data.data);
      setAppointmentsByBranch(appointmentsBranch.data.data);
    } catch (error) {
      return error
    } finally {
      setLoading(false);
    }
  },[])

  useEffect(() => {
    fetchData().catch((_error:unknown) => {
      //
    })
  }, [fetchData]);
  

  if (loading) return <FullScreenLoader label='Cargando datos de estadisticas' open={loading}/>;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Estadísticas</Typography>
      <AppointmentsStatsCard
        insuranceData={patientsByHealthInsurance}
        appointmentsData={appointmentsByBranch}
        statusData={appointmentsByStatus}
      />
    </Stack>
  );
}
