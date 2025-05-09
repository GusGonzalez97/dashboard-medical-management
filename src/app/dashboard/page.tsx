'use server'
import * as React from 'react';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { File } from '@phosphor-icons/react/dist/ssr';
import { Grid2 } from '@mui/material';
import RecordServices ,{ type GetRecordsResponseI } from '@/services/record/record-services';
import { cookies } from 'next/headers';
import withSession from '@/utils/whitsession';
import dynamic from 'next/dynamic';
import StatsServices from '@/services/stats/stats-services';

const MedicalRecordsTable = dynamic(()=> import('@/components/dashboard/integrations/medical-records-table'),{ssr:false})

interface GetDataInterface{
  records: GetRecordsResponseI["data"],
  patientsCount:number,
  medicalRecordsCount:number
}

export default async function Page(): Promise<React.JSX.Element> {
  const page = 0;
  const {records,patientsCount,medicalRecordsCount} = await getData()

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={{lg:4,md:6,sm:12}} >
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value={patientsCount} title='Total de pacientes registrados' icon={<UsersIcon fontSize="var(--icon-fontSize-lg)" />}/>
      </Grid2>
      <Grid2 size={{lg:4,md:6,sm:12}} >
        <TotalCustomers icon={<File fontSize="var(--icon-fontSize-lg)" />} diff={16} trend="down" sx={{ height: '100%' }} title='Historias clínicas creadas' value={medicalRecordsCount} />
      </Grid2>
       <MedicalRecordsTable 
       count={records.pagination.total}
       showPanel={false}
       page={page}
       rows={records.data}
       rowsPerPage={records.pagination.perPage}
       />
    </Grid2>
  );
}

async function getData(): Promise<GetDataInterface>{
    const _cookies = cookies()
    const sessionData = await withSession<GetDataInterface | null>(_cookies, async (): Promise<GetDataInterface> => {
      const [recordRes, patientsStatsRes, medicalRecordsStatsRes] = await Promise.all([RecordServices.getAllRecords(0,5,{},'createdAt','desc'),StatsServices.getPatientCreationStats(),StatsServices.getRecordCreationStats()]);
      return { records: recordRes.data, patientsCount: patientsStatsRes.data.total, medicalRecordsCount: medicalRecordsStatsRes.data.total };
    });

    if (!sessionData || !('records' in sessionData)) {
      throw new Error('Session is invalid or missing');
    }

    return sessionData as GetDataInterface;
}