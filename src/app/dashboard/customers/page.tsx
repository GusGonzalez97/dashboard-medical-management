import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';

import { config } from '@/config';
import {type  GetPatientsResponseI, PatientServices } from '@/services/patient/patient-services';
import withSession from '@/utils/whitsession';
import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';
import { UserPlus } from '@phosphor-icons/react/dist/ssr';
import { Typography } from '@mui/material';

export const metadata = { title: `Pacientes | Dashboard | ${config.site.name}` } satisfies Metadata;

const CustomersTable = dynamic(
  () => import('@/components/dashboard/customer/customers-table').then((mod) => mod.default),
  { ssr: false }
)

const RouterHandlerButton = dynamic(()=> import('@/components/core/handler-router'),{ssr:false})
export default async function Page(): Promise<React.JSX.Element> {
  const {data,pagination} = await getData()

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={5} justifyContent="space-between" alignItems="center">
      <Typography variant="h4" sx={{ marginBottom: 2 }}>Pacientes</Typography>
          <RouterHandlerButton variant='contained' title='Agregar' icon={<UserPlus fontSize="var(--icon-fontSize-md)" />} path='customers/form' />
      </Stack>
      {CustomersTable && data?<CustomersTable
        count={pagination?.total}
        page={pagination?.page}
        rows={data}
        rowsPerPage={pagination?.perPage}
      />: null}
    </Stack>
  );
}

async function getData(): Promise<GetPatientsResponseI['data']>{
    const _cookies = cookies()
    const result = withSession(_cookies, async()=>{
      const res = await PatientServices.getAllPatients(0,10,{},'createdAt','desc')
      return res.data
    })

      if (result && 'data' in result && 'pagination' in result) {
        return result as GetPatientsResponseI['data'];
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