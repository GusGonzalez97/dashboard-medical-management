import type { PatientI } from "./pacient";
import type { PlatformUserI } from "./user";

export interface Schedule {
  monday: { from: string; to: string };
  tuesday: { from: string; to: string };
  wednesday: { from: string; to: string };
  thursday: { from: string; to: string };
  friday: { from: string; to: string };
  saturday: { from: string; to: string };
  sunday: { from: string; to: string };
}

export interface BranchI {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
  };
  schedule: Schedule;
}

export interface AppointmentStatusData {
  status: AppointmentStatusEnum // podés ajustar los valores según los posibles estados
  count: number;
  percentage: number;
};

export interface BranchAppointmentsData {
  _id: string;
  branchName: string;
  count: number;
};

export enum AppointmentReasonEnum {
  CONSULTATION = "Consultation",
  SURGICAL = "Surgical",
  PRESURGICAL = "Pre-surgical",
  OFFICE = "Office",
  URGENCY='Urgency',
  OTHER='Other',
  DEFAULT = "",
}

export enum AppointmentStatusEnum {
  PENDING = "pending",
  CONFIRMED = "completed",
  CANCELLED = "cancel",
}

export interface MedicalAppointmentI {
  _id?: string;
  date: string;
  duration?: number;
  endDate: string;
  status: AppointmentStatusEnum;
  reason: AppointmentReasonEnum;
  practice: string;
  branch: BranchI;
  doctor?: PlatformUserI;
  patient: PatientI;
  createdAt?: string;
  updatedAt?: string;
  isCancelled?: boolean;
  reasonForCancellation?: string;
}

export interface AppointmentRequest {
  date: string;
  duration: number;
  reason: string;
  practice: string;
  branch: string;
  doctor: string;
  patient: string;
}

export interface CheckAvailabilityInterface{
    startDate: string,
    duration: number,
    doctorId: string,
    branchId: string
}

export interface MedicalAppointmentProps {
  patient: PatientI;
  appointment?: MedicalAppointmentI;
}

export interface AppointmentPageProps {
  readonly params: { patientId?: string; appointmentId?: string };
  readonly searchParams: string;
}

export class AppointmentClass {
  patient: PatientI | undefined;
  appointment: MedicalAppointmentI | undefined;

  constructor(patient?: PatientI, appointment?: MedicalAppointmentI) {
    this.patient = patient;
    this.appointment = appointment ?? undefined;
  }
}

export type ViewMode = "day" | "week" | "month";

export const PracticesOptions = [
  "CONSULTA 1 VEZ",
  "CONSULTA DE SEGUIMIENTO",
  "CONSULTA DE URGENCIA",
  "FONDO DE OJOS",
  "TOPOGRAFÍA",
  "PAQUIMETRÍA",
  "CAMPO VISUAL",
  "TEST DE LOS COLORES",
  "TEST OJO SECO",
  "OCT POSTERIOR",
  "OCT ANTERIOR",
  "RETINOGRAFÍA",
  "HRT3",
  "LENSTAR",
  "ECOGRAFÍA",
  "CURVA DE PRESIÓN",
  "YAG LASER",
  "LASER ARGÓN",
  "DACRIOCISTORRINOSTOMIA",
  "EXT. CUERPO EXTRAÑO"
];
