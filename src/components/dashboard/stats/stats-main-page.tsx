import React from 'react';
import { Card, CardContent, Typography, Grid2 } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Auto-registra todos los elementos
import type { ChartOptions } from 'chart.js';
import { HealthInsuranceLabels, medicalAppointmentStatusDictionary } from '@/utils/dictionary/general';
import type { HealthInsuranceData } from '@/types/medical-record';
import type { AppointmentStatusData, BranchAppointmentsData } from '@/types/medical-appointment';
import { CHART_COLORS } from '@/utils/mocks/stats';

interface StatsPageProps {
  insuranceData: HealthInsuranceData[];
  appointmentsData: BranchAppointmentsData[];
  statusData: AppointmentStatusData[];
}

const chartOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};


export default function AppointmentsStatsCard ({
  insuranceData,
  appointmentsData,
  statusData,
}: StatsPageProps) : React.JSX.Element {

  const insuranceChart = {
    labels: insuranceData?.map((i) => HealthInsuranceLabels[i.healthInsuranceName]??'-'),
    datasets: [
      {
        data: insuranceData?.map((i) => i.count),
        backgroundColor: CHART_COLORS.slice(0, insuranceData.length),
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const appointmentsChart = {
    labels: appointmentsData?.map((a) => a.branchName),
    datasets: [
      {
        data: appointmentsData?.map((a) => a.count),
        backgroundColor: CHART_COLORS.slice(0, appointmentsData.length),
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const statusChart = {
    labels: statusData?.map((s) => medicalAppointmentStatusDictionary[s.status]),
    datasets: [
      {
        data: statusData?.map((s) => s.count),
        backgroundColor: CHART_COLORS.slice(0, statusData.length),
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card sx={{ padding: 3 }}>
      <CardContent>
        <Grid2 container spacing={8} justifyContent="center">
          <Grid2 size={{xs:12,md:5}}>
            <Typography align="center" variant="h5" mb={5}>
              Pacientes por obra social
            </Typography>
            <Pie data={insuranceChart} options={chartOptions} />
          </Grid2>
          <Grid2 size={{xs:12,md:5}}>
            <Typography align="center" variant="h5" mb={5}>
              Turnos por sucursal
            </Typography>
            <Pie data={appointmentsChart} options={chartOptions} />
          </Grid2>
          <Grid2 size={{xs:12,md:5}}>
            <Typography align="center" variant="h5" mb={5}>
              Turnos por estado
            </Typography>
            <Pie data={statusChart} options={chartOptions} />
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};
