'use server'

import { ResponsiveFonts } from "@/components/core/responsive-fonts";
import CreatePatientForm from "@/components/dashboard/customer/create-patient-form";
import { PatientServices } from "@/services/patient/patient-services";
import { _patient, type FormValues } from "@/types/pacient";
import withSession from "@/utils/whitsession";
import {  Stack } from "@mui/material";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import React from "react";

interface PageProps{
  readonly searchParams:{patient:string}
}

async function Page({searchParams}:PageProps):Promise<React.JSX.Element>{
  const patientId = searchParams.patient?.toString()??null
    const patient = await getData(patientId)
    return <Stack spacing={5}>
      <ResponsiveFonts align="left" variant='h4'  mobileVariant="h5" text={ patient.name.length> 0 ? 'Editar Paciente': 'Agregar Paciente'}/>
        <CreatePatientForm defaultValues={patient} patientId={patientId}/>
    </Stack>
}

async function getData(patientId?:string):Promise<FormValues>{
    if(!patientId) return _patient

    const _cookies = cookies()
    const sessionData = await withSession<FormValues | null>(_cookies, async () => {
      const { data } = await PatientServices.getPatient(patientId);
      const patientData: FormValues = {
        ..._patient,
        name: data.name,
        lastname: data.lastname,
        city: data.address.city,
        documentNumber: data.documentNumber,
        documentProcedureNumber: data.healthInsurance?.documentProcedureNumber ?? '',
        dateOfBirth: dayjs(data.dateOfBirth).format('YYYY-MM-DD'),
        street: data.address.street,
        hasHealthInsurance: Boolean(data.healthInsurance),
        healthInsuranceName: data.healthInsurance?.healthInsuranceName ?? '',
        membershipNumber: data.healthInsurance?.membershipNumber?.toString() ?? '',
        email: data.email ?? '',
        phone: data.phone,
        medicalHistory: data.medicalHistory ?? [''],
        currentMedications: data?.currentMedications?.join(',') ?? '',
      };
      return patientData;
    });

    return (sessionData as FormValues) ?? _patient;
}

export default Page