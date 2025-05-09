'use server'
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { MedicalAppointmentsTable } from '@/components/dashboard/appointments/appointments-table';
import { paths } from '@/paths';
import { Calendar } from '@phosphor-icons/react/dist/ssr/Calendar';
import RouterHandlerButton from '@/components/core/handler-router';
import { cookies } from 'next/headers';
import withSession from '@/utils/whitsession';
import { AppointmentServices,type GetAppointmentsResponseI } from '@/services/appointment/appointment-services';

export default async  function Page(): Promise< React.JSX.Element >{
  const {data,pagination} = await getData()

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3} justifyContent='space-between' alignItems="center">
          <Typography variant="h4">Turnos</Typography>
          <RouterHandlerButton title='Ver Calendario' icon={<Calendar fontSize="var(--icon-fontSize-md)" />} variant='contained' path={paths.dashboard.calendar}/>
      </Stack>
      <MedicalAppointmentsTable
        count={pagination.total}
        page={pagination.page}
        rows={data}
        rowsPerPage={pagination.perPage}
      />
    </Stack>
  );
}

async function getData(): Promise<GetAppointmentsResponseI['data']>{
    const _cookies = cookies()
    const result = await withSession<GetAppointmentsResponseI['data']>(_cookies, async()=>{
      const res = await AppointmentServices.getAllEvents(0,10,{},'date','desc')
      return res.data
    });

    if (result && 'data' in result && 'pagination' in result) {
      return result as GetAppointmentsResponseI['data'];
    }
    return { 
      data: [], 
      pagination: { 
        total: 0, 
        page: 1, 
        perPage: 30, 
        totalPages: 1, 
        nextPage: null, 
        prevPage: null 
      } 
    };
}