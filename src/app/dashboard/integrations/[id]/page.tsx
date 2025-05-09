'use client'
import { ResponsiveFonts } from "@/components/core/responsive-fonts";
import { config } from "@/config";
import { AppointmentServices } from "@/services/appointment/appointment-services";
import { FileServices } from "@/services/file/file-services";
import { PatientServices } from "@/services/patient/patient-services";
import RecordServices, { type GetRecordResponseI } from "@/services/record/record-services";
import { tertiary } from "@/styles/theme/colors";
import { MedicalRecordStatus, type ClinicalStudy, type MedicalRecordI } from "@/types/medical-record";
import { Box, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

interface PageParams {
  readonly params: { id: string, };
  readonly searchParams: { patientId: string, appointmentId: string, isEditing: string };
}

const MedicalRecordForm = dynamic(() => import('@/components/dashboard/integrations/medical-record-form'), { ssr: false })
const PDFComponent = dynamic(() => import('@/components/dashboard/integrations/medical-record-pdf'), {
  ssr: false
});
const FullScreenLoader = dynamic(() => import('@/components/core/loader/loader'), { ssr: false });

export default function CreateOrEditMedicalRecordPage({ params, searchParams }: PageParams): React.JSX.Element {
  const [data, setData] = useState<MedicalRecordI | null>(null);
  const [loading,setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getData({ params, searchParams })
      .then(result => { setData(result) })
      .catch((_error: unknown) => { 
        // Replace with a logging service or handle the error appropriately
        // Example: logErrorService.log("Error fetching data:", error);
      }).finally(() => {
        setLoading(false)
      });
  }, [params, searchParams]);

  if (loading) return <FullScreenLoader open={!data} label="Cargando historia clínica..." />;

  return <Stack spacing={4} >
    <Box display='flex' alignItems='center'>
      <Box flexGrow={1} display="flex" justifyContent="flex-start" alignItems="center">
        <ResponsiveFonts mobileVariant='h5' color={tertiary[700]} weight="600" variant='h3' text={`${data?.patient?.name} ${data?.patient?.lastname}`} />
      </Box>
      {data && data.status === MedicalRecordStatus.DONE ? <PDFComponent data={data} /> : null}
    </Box>
    {data ? 
      <MedicalRecordForm record={data} patient={data.patient} /> 
       : null}
  </Stack>
}

async function getSignedUrls(clinicalStudies: ClinicalStudy[]) : Promise<ClinicalStudy[]> {
  if (!clinicalStudies.length) return [];
  try {
    return await Promise.all(
      clinicalStudies.map(async (file) => {
        try {
          const response = await FileServices.getFile(file.fileUrl, 3600);
          const data = response.data as { url: string };
          return { ...file, fileUrl: data.url }; // Devuelve el estudio con la URL firmada
        } catch (error) {
          return file; // Devuelve el estudio sin cambios si falla la firma
        }
      })
    );
  } catch (error) {
    return [];
  }
}

async function getData({ params, searchParams }: PageParams): Promise<MedicalRecordI> {
    if (params.id === 'create' && searchParams.patientId && searchParams.appointmentId) {
      const [patient, appointment] = await Promise.all([
        PatientServices.getPatient(searchParams.patientId),
        AppointmentServices.getEvent(searchParams.appointmentId)
      ]);

      return {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        doctorId: config.doctorId,
        prescription: { rightEye: "", leftEye: "" },
        intraocular: { rightEye: "", leftEye: "" },
        patient: patient.data,
        appointment: appointment.data,
        observations:''
      };
    }

    const medicalRecordDetail: GetRecordResponseI = await RecordServices.getRecord(params.id);
    if (!medicalRecordDetail) throw new Error('Record no encontrado');

    const { data } = medicalRecordDetail;

    const [signedStudies, appointmentData] = await Promise.all([
      data.clinicalStudies?.length ? getSignedUrls(data.clinicalStudies) : [],
      data.appointment?._id ? AppointmentServices.getEvent(data.appointment._id) : null
    ]);

    return {
      ...data,
      clinicalStudies: signedStudies,
      appointment: appointmentData ? appointmentData.data : data.appointment
    };
}
