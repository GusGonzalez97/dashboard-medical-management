'use client'

import React, { useState, useCallback, useEffect } from "react";
import type { EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogTitle, DialogContent, Button, TextField, MenuItem, Switch, Typography, Box, Grid2 } from "@mui/material";
import esLocale from "@fullcalendar/core/locales/es";
import { secondary } from "@/styles/theme/colors";
import { AppointmentServices } from "@/services/appointment/appointment-services";
import { useToast } from "@/contexts/toast-provider";
import { AppointmentStatusEnum, type CheckAvailabilityInterface, PracticesOptions, type MedicalAppointmentI } from "@/types/medical-appointment";
import { formatDateTime } from "@/utils/helpers/format-date";
import dayjs, { extend } from "dayjs";
import utc from "dayjs/plugin/utc";
import { HealthInsuranceLabels, reasonDictionary } from "@/utils/dictionary/general";
import { PatientServices } from "@/services/patient/patient-services";
import { useRouter } from "next/navigation";
import { handleError } from "@/utils/helpers/error-mapper";
import ConfirmActionDialog from "@/components/core/dialog/confirm-action.dialog";
import { useAuth } from "@/contexts/auth";
import dynamic from "next/dynamic";
import PatientForm, { type PatientFormValue } from "../form/PatientFormAppointment";
import { CityEnum, type PatientI } from "@/types/pacient";
import { config } from "@/config";

extend(utc);

interface CalendarProps {
  readonly appointments: MedicalAppointmentI[]
}

const FullScreenLoader = dynamic(() => import('@/components/core/loader/loader'), { ssr: false })

function Calendar({ appointments }: CalendarProps): React.JSX.Element {

  const [events, setEvents] = useState([
    { _id: "1", date: new Date().toISOString(), title: 'Office', practice: '', endDate: new Date().toISOString(), branch: '67c7c6cbc8f2b6f9af5e29b5', status: AppointmentStatusEnum.PENDING, patient: {} as PatientI },
  ]);
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState(false);
  const [eventData, setEventData] = useState({
    _id: "",
    date: "",
    endDate: "",
    branch: "",
    title: "",
    practice: "",
    patientDocument: '',
    status: AppointmentStatusEnum.PENDING,
    observations: '',
    name: '',
    lastname: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [appointmentSelected, setAppointmentSelected] = useState<boolean>(false)
  const [deletingAppointment, setDeletingAppointment] = useState<boolean>(false)
  const { isDoctor } = useAuth()
  const { _toast } = useToast()
  const router = useRouter()
  const [invitedUser, setInvitedUser] = useState<PatientFormValue>({ name: '', lastname: '', documentNumber: '', healthInsuranceName: undefined, phone: '+54' })
  const [isPatient, setIsPatient] = useState(false)

  useEffect(() => {
    const _data = appointments.map(d => {
      const safePractice = PracticesOptions.includes(d.practice) ? d.practice : ''
      return { ...d, _id: d._id ?? '', "title": d.reason, branch: d.branch.name, practice: safePractice, date: formatDateTime(d.date), endDate: d.endDate, status: d.status, patientDocument: d.patient.documentNumber, patientId: d.patient._id }
    })
    const isSame = JSON.stringify(_data) === JSON.stringify(events)
    if (!isSame) {
      setEvents(_data)
    }
  }, [appointments, events]);

  const handleDateClick = useCallback((arg: { date: Date }): void => {
    const start = dayjs(arg.date).tz('America/Argentina/Buenos_Aires').hour(9).minute(0).second(0);
    const end = start.add(15, 'minute'); // Sumar 15 minutos

    setEventData({
      _id: String(events.length + 1),
      date: start.format('YYYY-MM-DDTHH:mm'),
      endDate: end.format('YYYY-MM-DDTHH:mm'),
      branch: "",
      title: "",
      practice: "",
      patientDocument: '',
      status: AppointmentStatusEnum.PENDING,
      observations: '',
      name: '',
      lastname: ''
    });

    setIsEditing(false);
    setOpen(true);
  }, [events]);

  const handleEventClick = useCallback(async (clickInfo: EventClickArg): Promise<void> => {
    try {
      const { extendedProps, start, title } = clickInfo.event;
      const typedExtendedProps = extendedProps as {
        _id?: string;
        endDate?: string;
        branch: string;
        practice: string;
        patient?: PatientI;
        name: string;
        lastname: string;
        status: AppointmentStatusEnum;
        observations: string;
      };
      setEventData({
        _id: typedExtendedProps._id ?? "",
        date: dayjs(start).format("YYYY-MM-DDTHH:mm"),
        endDate: formatDateTime(String(typedExtendedProps.endDate)),
        branch: typedExtendedProps.branch,
        title,
        practice: typedExtendedProps.practice,
        patientDocument: Number(typedExtendedProps.patient?.documentNumber).toLocaleString('es-AR'),
        status: typedExtendedProps.status,
        observations: typedExtendedProps.observations,
        name: typedExtendedProps.patient?.name ?? '',
        lastname: typedExtendedProps?.patient?.lastname ?? ''
      });
      setIsEditing(true);
      setOpen(true);
    } catch (error) {
      _toast('Error al cargar los datos', 'error');
    }
  }, [_toast]);

  const CheckAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const AvailabilityData: CheckAvailabilityInterface = {
        startDate: eventData.date,
        doctorId: config.doctorId,
        branchId: eventData.branch,
        duration: dayjs(eventData.endDate).diff(dayjs(eventData.date), "minutes")
      }
      const { data } = await AppointmentServices.checkAvailavility(AvailabilityData)
      return !data.conflicts.includes('branch')
    } catch (error) {
      setLoading(false)
      return false
    }

  }, [eventData])

  const handleEventSave = useCallback(async (): Promise<void> => {
    setLoading(true);
    let patient;

    const diferenceBetweenDates = dayjs(eventData.endDate).diff(dayjs(eventData.date), "minutes");
    if (diferenceBetweenDates < 0) {
      _toast('La fecha de finalización es anterior a la de inicio', 'error');
      setLoading(false);
      return;
    }
    if (eventData.branch === 'Comodoro Rivadavia') {
      eventData.branch = '67c7c6cbc8f2b6f9af5e29b5'
    } else {
      eventData.branch = '67c7c6c2c8f2b6f9af5e29b2'
    }
    const isBranchAvailable: boolean = await CheckAvailability()

    if (!isBranchAvailable) {
      _toast('La sucursal no esta disponible para el horario o dia seleccionado', 'error')
      setLoading(false)
      return
    }

    if (!isPatient && invitedUser.documentNumber) {
      const healthInsurance = invitedUser.healthInsuranceName ? { healthInsuranceName: invitedUser.healthInsuranceName, membershipNumber: 0 } : undefined;
      let patientBaseData: PatientI = {
        name: invitedUser.name,
        lastname: invitedUser.lastname,
        documentNumber: invitedUser.documentNumber,
        phone: invitedUser.phone,
        doctorId: config.doctorId,
        dateOfBirth: new Date().toISOString().split("T")[0],
        address: { city: CityEnum.CO, street: ' ' }
      }
      if (healthInsurance) {
        patientBaseData = { ...patientBaseData, healthInsurance }
      }
      const response = await PatientServices.createPatient(patientBaseData)
      //Manejar la respuesta en la que PATIENT_EXIST 
      patient = response.data as PatientI
    } else {
      const filters = { "documentNumber": { "contains": eventData.patientDocument } };
      const { data } = await PatientServices.getAllPatients(0, 1, filters);
      if (data.data.length === 0) {
        _toast('Paciente no encontrado!', 'error');
        setLoading(false)
        return
      }
      patient = data.data[0]
    }

    const patientId = patient._id ?? '';

    try {
      const _data = {
        date: eventData.date,
        branch: eventData.branch,
        reason: eventData.title,
        practice: eventData.practice,
        doctor: config.doctorId,
        patient: patientId,
        duration: diferenceBetweenDates,
        observations: eventData.observations
      };

      if (isEditing && patientId) {
        setEvents(events.map(event => event._id === eventData._id ? { ...eventData, patient: event.patient } : event));
        await AppointmentServices.createEvent(_data);
      } else if (patientId) {
        setEvents(events.map(event => event._id === eventData._id ? { ...eventData, patient: event.patient } : event));
        await AppointmentServices.createEvent(_data);
        _toast('Se ha agendado el turno con éxito!', 'success');
        setEvents([...events, { ...eventData, patient: {} as PatientI }]);
      }

      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error && (error as { response: { data: { error: string } } }).response?.data?.error) {
        if (typeof error === 'object' && error !== null && 'response' in error) {
          const responseError = error as { response: { data: { error: string } } };
          _toast(handleError(responseError.response.data.error).message, 'error');
        } else {
          _toast('Error al procesar datos', 'error');
        }
      } else {
        _toast('Error al procesar datos', 'error');
      }
    } finally {
      setInvitedUser({ name: '', lastname: '', documentNumber: '', healthInsuranceName: undefined, phone: '' })
      setIsPatient(false)
      router.refresh();
      setLoading(false);
    }
  }, [isEditing, eventData, events, _toast, router, isPatient, invitedUser, CheckAvailability]);

  const handleEventDelete = useCallback((): void => {
    setAppointmentSelected(true);
  }, []);

  const onCancelAppointment = useCallback(async () => {
    setDeletingAppointment(true)
    try {
      const newEvents = events.filter(event => event._id !== eventData._id)
      setEvents(newEvents)
      await AppointmentServices.cancelEvent(eventData._id)
      router.refresh()
      _toast('Turno cancelado con éxito', 'success')
    } catch (error) {
      _toast('Error al cancelar el turno', 'error')
    }
    finally {
      setDeletingAppointment(false)
      setAppointmentSelected(false)
      setOpen(false);
    }
  }, [_toast, eventData._id, events, router])

  const renderEventContent = useCallback((eventInfo: EventClickArg): React.JSX.Element => {
    const isCanceled = eventInfo.event.extendedProps.status === AppointmentStatusEnum.CANCELLED;
    return (
      <div
        style={{
          backgroundColor: secondary[500],
          border: 'none',
          borderRadius: "5px",
          height: "100%",
          display: "flex",
          width: '100%',
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection:'column',
          padding:1.2
        }}
      >
        <span
          style={{
            fontSize: 12,
            textDecoration: isCanceled ? "line-through" : "none",
            color: 'white',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            margin:'none',
            gap:1.2,
          }}
        >
          <strong>      
          {reasonDictionary[eventInfo.event.title]??'-'}  
          </strong>-
          <p style={{
            fontSize: 10, color:'white', margin:0,fontWeight:'500'
          }}>
          {eventInfo.event?.extendedProps?.practice??'-'}
          </p>
        </span>
        
        <span
          style={{
            fontSize: 10,
            fontWeight: '600',
            textDecoration: isCanceled ? "line-through" : "none",
            color: 'white'
          }}
        >
          {`${(eventInfo.event?.extendedProps as { patient?: PatientI })?.patient?.name ?? '-'} ${(eventInfo.event?.extendedProps as { patient?: PatientI })?.patient?.lastname ?? '-'}`}
          </span>

          <span
          style={{
            fontSize: 10,
            fontWeight: '400',
            textDecoration: isCanceled ? "line-through" : "none",
            color: 'white',
            marginTop:2
          }}
        >
          { HealthInsuranceLabels[(eventInfo.event?.extendedProps as {patient?:PatientI})?.patient?.healthInsurance?.healthInsuranceName as keyof typeof HealthInsuranceLabels] ?? ''}
          </span>
      </div>
    );
  }, []);

  const onChangeIsPatient = useCallback((value: boolean) => {
    if (!value) {
      setInvitedUser({ name: '', lastname: '', documentNumber: '', healthInsuranceName: undefined, phone: '' })
    }
    setIsPatient(value)
  }, [])

  if (deletingAppointment) {
    return <FullScreenLoader open={deletingAppointment} />
  }

  return (
    <div className="p-3" >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        locale={esLocale}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable
        weekends={false}
        selectable
        eventContent={renderEventContent}
      />
      <Dialog open={open} onClose={() => { setOpen(false); onChangeIsPatient(false) }} >
        <DialogTitle mt={3} mb={3} variant="h4" align='center'>{isEditing ? "Editar turno" : "Agendar turno"}</DialogTitle>
        <DialogContent sx={{ minHeight: isEditing ? 500 : 620 }}>
          {!isEditing ? <Box display='flex' alignItems='center' justifyContent='flex-start' gap={3} mb={2}>
            <Typography variant="h6">¿Es paciente?</Typography>
            <Switch value={!isPatient} onChange={() => { onChangeIsPatient(!isPatient) }} />
          </Box> : null}

          {eventData.name && eventData.lastname ? <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 6, md: 6, lg: 6 }}>
              <TextField
                fullWidth
                label="Nombre"
                variant="outlined"
                placeholder="Nombre de paciente"
                value={eventData.name}
                disabled
                margin="dense"
              />
            </Grid2>
            <Grid2 size={{ xs: 6, md: 6, lg: 6 }}>
              <TextField
                fullWidth
                label="Apellido"
                variant="outlined"
                disabled
                placeholder="Apellido del paciente"
                value={eventData.lastname}
                margin="dense"
              />
            </Grid2>

          </Grid2> : null}

          {isPatient || isEditing ? (<TextField
            fullWidth
            label="Documento"
            variant="outlined"
            placeholder="Ingrese el DNI del paciente"
            value={eventData.patientDocument}
            onChange={(e) => { setEventData({ ...eventData, patientDocument: e.target.value }) }}
            margin="dense"
          />) : (<Box width='100%'> <PatientForm patient={invitedUser} setPatient={setInvitedUser} /></Box>)}
          <TextField
            fullWidth
            label="Motivo"
            variant="outlined"
            value={eventData.title}
            onChange={(e) => { setEventData({ ...eventData, title: e.target.value }) }}
            margin="dense"
            select
          >
            <MenuItem value="Office">Consultorio</MenuItem>
            <MenuItem value="Surgical">Quirúrgico</MenuItem>
            <MenuItem value="Pre-surgical">Pre-Quirúrgico</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Práctica"
            variant="outlined"
            value={eventData.practice}
            onChange={(e) => { setEventData({ ...eventData, practice: e.target.value }) }}
            margin="dense"
            select
          >
            {PracticesOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Fecha y Hora de Inicio"
            type="datetime-local"
            slotProps={{
              inputLabel: { shrink: true }, htmlInput: {
                min: new Date().toISOString().slice(0, 16) // Fecha mínima = ahora
              }
            }}
            variant="outlined"
            value={eventData.date}
            defaultValue={eventData.date}
            onChange={(e) => { setEventData({ ...eventData, date: e.target.value }) }}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Fecha y Hora de Fin"
            type="datetime-local"
            slotProps={{
              inputLabel: { shrink: true }, htmlInput: {
                min: eventData.date // Fecha mínima = fecha de inicio
              }
            }}
            variant="outlined"
            value={eventData.endDate}
            onChange={(e) => { setEventData({ ...eventData, endDate: e.target.value }) }}
            margin="dense"
          />
          <TextField
            fullWidth
            select
            label="Sucursal"
            variant="outlined"
            value={eventData.branch}
            defaultValue='co'
            onChange={(e) => { setEventData({ ...eventData, branch: e.target.value }) }}
            margin="dense"
          >
            <MenuItem value="Comodoro Rivadavia">Comodoro Rivadavia</MenuItem>
            <MenuItem value="Caleta Olivia">Caleta Olivia</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Observaciones"
            variant="outlined"
            placeholder="Ingrese observaciones del paciente"
            value={eventData.observations}
            onChange={(e) => { setEventData({ ...eventData, observations: e.target.value }) }}
            margin="dense"
          />
          <div style={{ display: "flex", width: '100%', justifyContent: "flex-end", marginTop: "26px", gap: 10 }}>
            <Button variant="contained" color="primary" disabled={isDoctor || Boolean(eventData.name)} onClick={handleEventSave} loading={loading}>
              Confirmar turno
            </Button>
            {isEditing ? (
              <Button disabled={isDoctor} variant='outlined' color="error" onClick={handleEventDelete}>
                Cancelar turno
              </Button>
            ) : null}
          </div>

        </DialogContent>

      </Dialog>
      <ConfirmActionDialog
        open={Boolean(appointmentSelected)}
        title="Cancelar turno"
        message="¿Desea cancelar el turno?"
        onClose={() => { setAppointmentSelected(false) }}
        actions={[
          { label: 'Cancelar', onClick: () => { setAppointmentSelected(false) } },
          { label: 'Confirmar', onClick: onCancelAppointment, autoFocus: true },
        ]}
      />
    </div>
  );
};

export default Calendar;
