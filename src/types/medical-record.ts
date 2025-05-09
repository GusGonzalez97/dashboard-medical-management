import type { MedicalAppointmentI } from "./medical-appointment";
import type { PatientI } from "./pacient";

//pending, inprogress, done

export enum MedicalRecordStatus{
  PENDING = 'pending',
  INPROGRESS  = 'inProgress',
  DONE = 'done',
  ERROR='error'
}

export interface ClinicalStudy{
  name:string,
  fileUrl:string,
  id?:string,
  createdAt?:string,
  updatedAt?:string
}

export interface MedicalRecordI{
    _id?:string;
    createdAt?:string;
    updatedAt?:string;
    patientId?:string;
    doctorId?:string;
    appointmentId?:string,
    status?:MedicalRecordStatus;
    studies?:{type:string;file:string}[];
      intraocular?: {
        rightEye: string; // e.g., 15 (mmHg)
        leftEye: string; // e.g., 14 (mmHg)
      };
      prescription?: {
        rightEye: string; // e.g., "-2.00"
        leftEye: string; // e.g., "-1.50"
      };
    
      eyeExam?: {
        anteriorSegment?: string; // Findings in cornea, lens, etc.
        posteriorSegment?: string; // Retina, optic nerve, etc.
      };
    
      diagnosis?: string; // Aca el doc describe el diagnostico
      diagnosisRefinedByIA?:string;
      treatmentPlan?: string; // Es un string campo libre. gotitas de descanso cada 8 hs, 
      treatmentPlanRefinedByIA?:string;
      clinicalStudies?: ClinicalStudy[]
      observations?:string;
      appointment?: MedicalAppointmentI;
      patient?:PatientI
    };

// treatmentPlan, Ejemplo:
// "Uso de lágrimas artificiales 3 veces al día"
// "Indicación de anteojos con fórmula actualizada"
// "Derivación a cirugía de cataratas en ojo derecho"

export const studies = [
  "Tonometría",
  "Refracción",
  "Fondo de ojo",
  "Campimetría",
  "Topografía corneal",
  "Paquimetría",
  "OCT (Tomografía de Coherencia Óptica)",
  "Biomicroscopía",
  "Ecografía ocular",
  "Prueba de Schirmer"
];

export interface HealthInsuranceData {
  healthInsuranceName: HealthInsuranceEnum;
  count: number;
  percentage: number;
};

export enum HealthInsuranceEnum {
  OSDE = "osde",
  SWISSMEDICAL = "swiss_medical",
  MEDIFE = "medife",
  GALENO = "galeno",
  HOSPITALITALIANO = "hospital_italiano",
  OMINT = "omint",
  SURA = "sura",
  SANCORSALUD = "sancor_salud",
  ACCORDSALUD = "accord_salud",
  PREVENCIONSALUD = "prevencion_salud",
  OSPE = "ospe",
  OSPESCHA = "ospescha",
  OSFE = "osfe",
  OSSACRA = "ossacra",
  OSJERA = "osjera",
  FEDECAMARAS = "fedecamaras",
  PAMI = "pami",
  OSPRERA = "osprera",
  AVALIAN = "avalian",
  APM = "apm",
  DASU = "dasu",
  TVSALUD = "tv_salud",
  JERARQUICOSALUD = "jerarquico_salud",
  SCIS = "scis",
  IOSFA = "iosfa",
  VISITAR = "visitar",
  INTERMEDICINA = "inter_medicina",
  OSDOP = "osdop",
  CSS = "css",
  UNOSALUD = "uno_salud",
  VALLESALUD = "valle_salud",
  OSECAC = "osecac",
  OSPATRONES = "ospatrones",
  OSDIPP = "osdipp"
}


export enum PatologySeverity {
  LOW = "low",
  MEDIUM = "medium",
  MEDIUMHIGH = "medium_high",
  HIGH = "high",
  CRITICAL = "critical", // para casos extraordinarios
}

