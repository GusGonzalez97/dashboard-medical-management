import { CityEnum } from "@/types/pacient";
import type { Mapper } from "../text-mapper";
import { AppointmentReasonEnum, AppointmentStatusEnum } from "@/types/medical-appointment";
import { HealthInsuranceEnum, MedicalRecordStatus, type PatologySeverity } from "@/types/medical-record";


export const branchDictionary:Mapper={
    [CityEnum.CR]:'VALENCIA',
    [CityEnum.CO]:'CARACAS',
    default:'Comodoro Rivadavia'
}

export const reasonDictionary:Mapper={
    [AppointmentReasonEnum.OFFICE]:'Consultorio',
    [AppointmentReasonEnum.SURGICAL]:'Quirurgico',
    [AppointmentReasonEnum.PRESURGICAL]:'Pre-quirurgico',
    default:'Desconocido'
}

export const medicalAppointmentStatusDictionary= {
    [AppointmentStatusEnum.CANCELLED]:'Cancelado',
    [AppointmentStatusEnum.CONFIRMED]:'Atendido',
    [AppointmentStatusEnum.PENDING]:'Pendiente',
  }

  export const medicalRecordStatusDictionary={
    [MedicalRecordStatus.DONE] : 'Completada',
    [MedicalRecordStatus.INPROGRESS]: 'En progreso',
    [MedicalRecordStatus.ERROR]: 'Error',
    [MedicalRecordStatus.PENDING]: 'Iniciada'
  }

  export const severityLabels: Record<PatologySeverity, string> = {
    low: "Baja criticidad",
    medium: "Criticidad moderada",
    medium_high: "Criticidad media-alta",
    high: "Alta criticidad",
    critical: "Casos extraordinarios",
  };

export const patologiesDictionary:Mapper= {
  presbicia: "Presbicia",
  dmae: "Degeneración Macular Relacionada con la Edad (DMAE)",
  retinopatia_diabetica: "Retinopatía Diabética",
  desprendimiento_retina: "Desprendimiento de Retina",
  retina: "Afecciones de Retina",
  queratocono: "Queratocono",
  ojo_seco: "Síndrome de Ojo Seco",
  conjuntivitis: "Conjuntivitis",
  blefaritis: "Blefaritis",
  uveitis: "Uveítis",
  neuropatia_optica: "Neuropatía Óptica",
  estrabismo: "Estrabismo",
  ambliopia: "Ambliopía (Ojo Vago)",
  retinosis_pigmentaria: "Retinosis Pigmentaria",
  daltonismo: "Daltonismo",
  hemorragia_vitrea: "Hemorragia Vítrea",
  edema_macular: "Edema Macular",
  celulitis_orbitaria: "Celulitis Orbitaria",
  cornea: "Afecciones de Córnea",
  parasitos: "Parásitos",
  glaucoma: "Glaucoma",
  diabetes: "Diabetes",
  hipertension: "Hipertensión",
  anticoagulado: "Anticoagulado",
  miopia: "Miopía",
  atigmatismo: "Astigmatismo", // Corregido de "atigmatismo"
  hipermetropia: "Hipermetropía",
  cataratas: "Cataratas",
  default:'-'
};

export const HealthInsuranceLabels: Record<HealthInsuranceEnum, string> = {
  [HealthInsuranceEnum.SEGUROSCARACAS]: "Seguros Caracas",
  [HealthInsuranceEnum.MAPFRE]: "Mapfre Venezuela",
  [HealthInsuranceEnum.MULTINACIONALDESEGUROS]: "Multinacional de Seguros",
  [HealthInsuranceEnum.SEGUROSALTAMIRA]: "Seguros Altamira",
  [HealthInsuranceEnum.SEGUROSMERCANTIL]: "Seguros Mercantil",
  [HealthInsuranceEnum.PIRAMIDE]: "Seguros Pirámide",
  [HealthInsuranceEnum.UNIVERSAL]: "Seguros Universales",
  [HealthInsuranceEnum.ASEGURADORACATATUMBO]: "Aseguradora Catatumbo",
  [HealthInsuranceEnum.ZURICH]: "Zurich Seguros",
  [HealthInsuranceEnum.LAPREVISORA]: "La Previsora",
  [HealthInsuranceEnum.VENEZUELA]: "Seguros Venezuela",
  [HealthInsuranceEnum.HORIZONTE]: "Seguros Horizonte",
  [HealthInsuranceEnum.PROVINCIAL]: "Seguros Provincial",
  [HealthInsuranceEnum.ORINOCO]: "Seguros Orinoco",
  [HealthInsuranceEnum.FEDERACIONMEDICA]: "Seguros Federación Médica Venezolana",
  [HealthInsuranceEnum.QUALITAS]: "Qualitas Compañía de Seguros",
  [HealthInsuranceEnum.OCEANICA]: "Seguros Oceánica",
  [HealthInsuranceEnum.BOLIVAR]: "Seguros Bolívar"
};
