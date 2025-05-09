import { ResponsiveFonts } from '@/components/core/responsive-fonts';
import PatientProfileFooter from '@/components/dashboard/customer/patient-detail-footer';
import  PatientProfileCard from '@/components/dashboard/customer/patient-profile-card';
import MedicalRecordsTable from '@/components/dashboard/integrations/medical-records-table';
import { PatientServices } from '@/services/patient/patient-services';
import RecordServices, {type GetRecordsResponseI } from '@/services/record/record-services';
import { tertiary } from '@/styles/theme/colors';
import type { PatientI } from '@/types/pacient';
import withSession from '@/utils/whitsession';
import { Stack, Typography } from '@mui/material';
import { cookies } from 'next/headers';
import React from 'react';

interface PageParams {
  readonly params: { patientId: string,};
}

export const dynamic = 'force-dynamic';

export default async function Page({params}:PageParams): Promise<React.JSX.Element> {
  const {patient,responseMedicalRecords} = await getData(params)

  return (
    <Stack width='100%' spacing={5} >
        <ResponsiveFonts align='center' mobileVariant='h5' color={tertiary[900]}  weight="600" variant='h4' text={`${patient?.name} ${patient?.lastname}`}/> 
        <PatientProfileCard patient={patient}/>
     {responseMedicalRecords?.pagination.total > 0 ?
     <MedicalRecordsTable 
      count={responseMedicalRecords?.pagination.total}
        page={0}
        isForClient
        rows={responseMedicalRecords?.data}
        rowsPerPage={responseMedicalRecords?.pagination.perPage}
        patientDocumentNumber={patient.documentNumber}
      /> :        <Typography variant='h5'  sx={{marginBottom:1}}>El paciente no tiene historial clínico</Typography>
}
      <PatientProfileFooter patientId={patient?._id} />
    </Stack>
  );
}

async function getData(params:{patientId:string}):Promise<{patient:PatientI,responseMedicalRecords:GetRecordsResponseI['data']}>{
    const _cookies = cookies()
    const sessionData = await withSession<{ patient: PatientI; responseMedicalRecords: GetRecordsResponseI['data'] }>(_cookies, async()=>{
      const patient = await PatientServices.getPatient(params.patientId)
      const filters = {"patient.documentNumber": { "contains": patient.data.documentNumber } }
      const { data } = await RecordServices.getAllRecords(
                  0,
                  10,
                  filters,
                  'createdAt',
                  'desc'
                );      
      return {patient:patient.data,responseMedicalRecords: data}
    });

    if (
      !sessionData ||
      typeof sessionData !== 'object' ||
      !('patient' in sessionData) ||
      !('responseMedicalRecords' in sessionData)
    ) {
      throw new Error('Invalid session data');
    }

    return sessionData as { patient: PatientI; responseMedicalRecords: GetRecordsResponseI['data'] };
}