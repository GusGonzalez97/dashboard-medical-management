'use client'

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Typography, Stack, Box, Grid2, useTheme, useMediaQuery } from "@mui/material";
import { type ClinicalStudy, MedicalRecordStatus, type MedicalRecordI } from "@/types/medical-record";
import { SpeechToText } from "@/components/core/speach-recognition";
import { useToast } from "@/contexts/toast-provider";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponsiveFonts } from "@/components/core/responsive-fonts";
import RecordServices from "@/services/record/record-services";
import { type FileItem, FileServices } from "@/services/file/file-services";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/auth";
import PatientProfileCard from "../customer/patient-profile-card";
import type { PatientI } from "@/types/pacient";
import AppointmentDetailCardResume from "../appointments/MiniAppointmentDetail/mini-appointment-detail";
import FileUploaderWithList from "@/components/core/inputs/upload-file-combinated";
import { AppointmentServices } from "@/services/appointment/appointment-services";
import { AppointmentStatusEnum } from "@/types/medical-appointment";
import { config } from "@/config";
import { paths } from "@/paths";

const clinicalStudySchema = z.object({
  name: z.string(),
  fileUrl: z.string(),
});

interface MedicalRecordComponentProps {
  readonly record?: MedicalRecordI,
  readonly patient?: PatientI;
}

const schema = z.object({
  intraocular: z.object({
    rightEye: z
      .string()
      .transform((val) => parseFloat(val.replace(",", "."))).optional(),
    leftEye: z
      .string()
      .transform((val) => parseFloat(val.replace(",", "."))).optional()
  }).optional(),
  diagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  clinicalStudies: z.array(clinicalStudySchema).optional(),
  observations: z.string().optional(),
});

const FullScreenLoader = dynamic(() => import('@/components/core/loader/loader'), { ssr: false });

export default function MedicalRecordForm({ record, patient }: MedicalRecordComponentProps): JSX.Element {
  const defaultValues = useMemo(() => ({
    doctorId: record?.doctorId ?? config.doctorId,
    status: record?.status,
    createdAt: record?.createdAt ?? new Date().toISOString().split("T")[0],
    updatedAt: record?.updatedAt ?? new Date().toISOString().split("T")[0],
    intraocular: record?.intraocular ?? { rightEye: "", leftEye: "" },
    diagnosis: record?.diagnosisRefinedByIA ?? record?.diagnosis ?? '',
    clinicalStudies: record?.clinicalStudies ?? [], // <- asegurate que esto sea un array de objetos con name y fileUrl
    treatmentPlan: record?.treatmentPlanRefinedByIA ?? record?.treatmentPlan ?? '',
    observations: record?.observations??''
  }), [record]);

  const { control, handleSubmit, watch, reset } = useForm<MedicalRecordI>({
    resolver: zodResolver(schema),
    defaultValues
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [interimDiagnosisText, setInterimDiagnosisText] = useState('')
  const [diagnosisText, setDiagnosisText] = useState('')
  const [interimTreatmentPlanText, setInterimTreatmentPlanText] = useState('')
  const [treatmentPlanText, setTreatmentPlanText] = useState('')
  const [files, setFiles] = useState<FileItem[]>([]);
  const [submitting, setSubmitting] = useState(false)
  const { _toast } = useToast();
  const router = useRouter()
  const isPending = useMemo(() => record?.status === MedicalRecordStatus.PENDING, [record])
  const { isDoctor } = useAuth()
  const theme = useTheme();
  const isLaptopOrUp = useMediaQuery(theme.breakpoints.up('md')); // md ~960px
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // md ~960px
  const formValues = watch();

  const isFormChanged = useMemo(() => {
    const currentValues = {
      ...formValues,
      diagnosis: diagnosisText, // Asegurando que diagnosisText se compara correctamente
      treatmentPlan: treatmentPlanText, // Asegurando que treatmentPlanText se compara correctamente
    };
    return (JSON.stringify(currentValues) !== JSON.stringify(defaultValues)) || files.length > 0;
  }, [formValues, defaultValues, diagnosisText, treatmentPlanText, files]);

  useEffect(() => {
    if (record?.diagnosis && record?.diagnosis.length > 0) {
      setDiagnosisText(record?.diagnosisRefinedByIA ?? record?.diagnosis);
    }
    if (record?.treatmentPlan && record?.treatmentPlan.length > 1) {
      setTreatmentPlanText(record?.treatmentPlanRefinedByIA ?? record?.treatmentPlan);
    }
  }, [record?.diagnosis, record?.treatmentPlan, record?.diagnosisRefinedByIA, record?.treatmentPlanRefinedByIA]);
  
  const onSubmitFiles = useCallback(async (): Promise<ClinicalStudy[]> => {
    const uploaded: ClinicalStudy[] = [];

    for (const file of files) {
      try {
        const  data  = await FileServices.uploadFile(`${record?.patient?._id}/image`, file);
        if (data.data) {
          uploaded.push({ name: file.name, fileUrl: data.data.key });
        }
      } catch (error) {
        _toast(`Error al subir el archivo ${file.name}`, 'error');
        throw error;
      }
    }
    return uploaded;
  }, [_toast, files, record?.patient]);

  const onSubmit = useCallback(async (data: MedicalRecordI): Promise<void> => {
    try {
      setSubmitting(true);

      // 1. Nuevo registro
      if (!record?.status) {
        const uploadedStudies = await onSubmitFiles();

        const basePayload = {
          clinicalStudies: uploadedStudies,
          doctorId: record?.doctorId,
          patientId: record?.patient?._id,
          appointmentId: record?.appointment?._id,
        };

        const payload = {
          ...basePayload,
          intraocular: data.intraocular,
          observations: data.observations
        };

        const response = await RecordServices.createRecord(payload);
        if (!response) throw new Error("Error al crear ficha clínica");

        _toast("Historia clínica creada con éxito", "success");
        if(record?.appointment?._id) await AppointmentServices.updateEvent(record.appointment._id,{status:AppointmentStatusEnum.CONFIRMED})
        router.back();
        return;
      }

      // 2. Edición de ficha existente
      const payload: Partial<MedicalRecordI> = {};

      const newStudiesLength = files.length;

      let uploadedStudies: ClinicalStudy[] = [];
      if (newStudiesLength > 0) {
        uploadedStudies = await onSubmitFiles();
      }

      if (
        record.status === MedicalRecordStatus.INPROGRESS ||
        (record.status === MedicalRecordStatus.DONE && isDoctor)
      ) {

        if(diagnosisText && diagnosisText !== record.diagnosisRefinedByIA){
          payload.diagnosis = diagnosisText;
        }
        if(treatmentPlanText && treatmentPlanText !== record.treatmentPlanRefinedByIA){
          payload.treatmentPlan = treatmentPlanText;
        }
        if(data.observations !== record.observations){
          payload.observations = data.observations
        }
        if(JSON.stringify(data.intraocular)!== JSON.stringify(record.intraocular)){
          payload.intraocular = data.intraocular;
        }
        if(isDoctor){
          payload.status = MedicalRecordStatus.DONE
        }
        if (uploadedStudies.length > 0) {
          payload.clinicalStudies = [
            ...record.clinicalStudies?.map(study => ({ name: study.name, fileUrl: study.fileUrl })) || [],
            ...uploadedStudies
          ];
        }
      } else {
        if(JSON.stringify(data.intraocular)!== JSON.stringify(record.intraocular)){
          payload.intraocular = data.intraocular;
        }

        if(data.observations !== record.observations){
          payload.observations = data.observations
        }

        if (uploadedStudies.length > 0) {
          payload.clinicalStudies = [
            ...record.clinicalStudies?.map(study => ({ name: study.name, fileUrl: study.fileUrl })) || [],
            ...uploadedStudies
          ]
        }
      }

      const response = await RecordServices.updateRecord(record._id ?? '', payload);
      if (!response) throw new Error("Error al editar la ficha clínica");

      _toast("Historia clínica guardada con éxito", "success");

      if(record.appointment?._id) await AppointmentServices.updateEvent(record.appointment._id,{status:AppointmentStatusEnum.CONFIRMED})
      if(isDoctor){
        router.refresh();
      }else{
        router.push(paths.dashboard.integrations);
      }
    } catch (error) {
      _toast("Hubo un error al guardar la ficha clínica", "error");
    } finally {
      setSubmitting(false);
    }
  }, [onSubmitFiles, diagnosisText, treatmentPlanText, isDoctor, router, record, files, _toast]);

  // const statusColorsConfig = useMemo(() => (
  //   {
  //     [MedicalRecordStatus.PENDING]: 'warning',
  //     [MedicalRecordStatus.INPROGRESS]: 'info',
  //     [MedicalRecordStatus.DONE]: 'success',
  //     [MedicalRecordStatus.ERROR]: 'error',
  //   }
  // ), [])

  // const messageAboutStatus = useMemo(() => {
  //   if (record?.status === MedicalRecordStatus.PENDING) return <Typography variant="body2"><strong>Iniciada </strong></Typography>
  //   if (record?.status === MedicalRecordStatus.INPROGRESS) return <Typography variant="body2"><strong>En progreso</strong></Typography>
  //   if (record?.status === MedicalRecordStatus.DONE) return <Typography variant="body2"> <strong>Completada</strong></Typography>
  // }, [record?.status])

  if (submitting) {
    return <FullScreenLoader open />;
  }

  return (
    <Box>
      <Box maxWidth={180}>
        {/* {record?.status ? <Alert variant='standard' severity={statusColorsConfig[record?.status]}>{messageAboutStatus}</Alert>
          : null} */}
      </Box>
      <Stack
        direction="row"
        gap={1}
        alignItems="flex-start"
        marginBottom={4}
        marginTop={2}
        flexWrap="wrap"
        width='100%'
      >
        <Box flex={1} minWidth={!isLaptopOrUp ? '' : 800}>
          <PatientProfileCard patient={patient} />
        </Box>

        {isLaptopOrUp ? (
          <Box flex={1} minWidth={200} maxWidth={250}>
            <AppointmentDetailCardResume appointment={record?.appointment} />
          </Box>
        ) : null}
      </Stack>

      <Stack width='100%' margin='0 auto' mt={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2} mt={2} minHeight={280} border={1} borderColor={theme.palette.grey[300]} borderRadius={2} padding={4}>
            <Grid2 size={{ xs: 12, lg: 8, md: 8 }} >
            <ResponsiveFonts align="left" variant="h6" mobileVariant="body1" text="Estudios" />
<FileUploaderWithList isMobile={isMobile} uploadDisabled={isDoctor} uploadedFiles={record?.clinicalStudies?? []} onInputItemsChange={setFiles} inputItems={files} />
            </Grid2>

            <Grid2 size={{ xs: 12, lg: 4, md: 4 }} >
            <ResponsiveFonts align="left" variant="h6" mobileVariant="body1" text="Presión intraocular" />
          <Grid2 container spacing={4} mt={4}>
            <Grid2 size={{ xs: 6, lg: 6 }}>
              <Controller name="intraocular.rightEye" control={control} render={({ field, fieldState }) => <TextField fullWidth type='text' slotProps={{
                inputLabel: { shrink: true }
              }} helperText={fieldState.error?.message} error={Boolean(fieldState.error)} disabled={isDoctor} label="Ojo Derecho (mmHg)" {...field} />} />
            </Grid2>
            <Grid2 size={{ xs: 6, lg: 6 }}>
              <Controller name="intraocular.leftEye" control={control} render={({ field, fieldState }) => <TextField fullWidth type='text' slotProps={{
                inputLabel: { shrink: true }
              }} label="Ojo Izquierdo (mmHg)" disabled={isDoctor} helperText={fieldState.error?.message} error={Boolean(fieldState.error)} {...field} />} />
            </Grid2>
            <Grid2 size={{ xs: 12, lg: 12 }}>
              <Controller name="observations" control={control} render={({ field, fieldState }) => <TextField fullWidth type='text' slotProps={{
                inputLabel: { shrink: true }
              }} label="Observaciones" disabled={isDoctor} helperText={fieldState.error?.message} error={Boolean(fieldState.error)} {...field} />} />
            </Grid2>
          </Grid2>
            </Grid2>
            </Grid2>

          <Grid2 spacing={3} container mt={8} mb={4}>
            <Grid2 size={{ xs: 12, lg: 7, md: 7 }} >
              <Typography variant="h6" align="left" mb={3}>Diagnóstico</Typography>
              <SpeechToText title="Diagnostico del paciente" interimText={interimDiagnosisText} setInterimText={setInterimDiagnosisText} isListening={isListening} disabled={isPending || !record?.status} setIsListening={setIsListening} text={diagnosisText} onChangeText={setDiagnosisText} />
            </Grid2>

            <Grid2 size={{ xs: 12, lg: 5, md: 5 }} >
              <Typography variant="h6" align="left" mb={3} >Tratamiento o Receta</Typography>
              <SpeechToText title="Receta para el paciente" interimText={interimTreatmentPlanText} setInterimText={setInterimTreatmentPlanText} isListening={isRecording} disabled={isPending || !record?.status} setIsListening={setIsRecording} text={treatmentPlanText} onChangeText={setTreatmentPlanText} />
            </Grid2>
          </Grid2>
          <Box display='flex' width='40%' justifyContent='center' alignItems='center' margin='0 auto'>
            <Button loading={submitting} disabled={!isFormChanged} fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 10 }}>{record?.status ? 'Guardar' : 'Crear Historia Clínica'}</Button>
          </Box>
        </form>
      </Stack>
    </Box>

  );
}
