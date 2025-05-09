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
  SEGUROSCARACAS = "seguros_caracas",
  MAPFRE = "mapfre",
  MULTINACIONALDESEGUROS = "multinacional_de_seguros",
  SEGUROSALTAMIRA = "seguros_altamira",
  SEGUROSMERCANTIL = "seguros_mercantil",
  PIRAMIDE = "piramide",
  UNIVERSAL = "universal",
  ASEGURADORACATATUMBO = "aseguradora_catatumbo",
  ZURICH = "zurich",
  LAPREVISORA = "la_previsora",
  VENEZUELA = "venezuela",
  HORIZONTE = "horizonte",
  PROVINCIAL = "provincial",
  ORINOCO = "orinoco",
  FEDERACIONMEDICA = "federacion_medica",
  QUALITAS = "qualitas",
  OCEANICA = "oceanica",
  BOLIVAR = "bolivar"
}


export enum PatologySeverity {
  LOW = "low",
  MEDIUM = "medium",
  MEDIUMHIGH = "medium_high",
  HIGH = "high",
  CRITICAL = "critical", // para casos extraordinarios
}

