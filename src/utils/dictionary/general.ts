import { CityEnum } from "@/types/pacient";
import type { Mapper } from "../text-mapper";
import { AppointmentReasonEnum, AppointmentStatusEnum } from "@/types/medical-appointment";
import { HealthInsuranceEnum, MedicalRecordStatus, type PatologySeverity } from "@/types/medical-record";


export const branchDictionary:Mapper={
    [CityEnum.CR]:'Comodoro Rivadavia',
    [CityEnum.CO]:'Caleta Olivia',
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
  [HealthInsuranceEnum.OSDE]: "OSDE",
  [HealthInsuranceEnum.SWISSMEDICAL]: "Swiss Medical",
  [HealthInsuranceEnum.MEDIFE]: "Medifé",
  [HealthInsuranceEnum.GALENO]: "Galeno",
  [HealthInsuranceEnum.HOSPITALITALIANO]: "Hospital Italiano Plan de Salud",
  [HealthInsuranceEnum.OMINT]: "OMINT",
  [HealthInsuranceEnum.SURA]: "SURA",
  [HealthInsuranceEnum.SANCORSALUD]: "Sancor Salud",
  [HealthInsuranceEnum.ACCORDSALUD]: "Grupo Accord Salud",
  [HealthInsuranceEnum.PREVENCIONSALUD]: "Prevención Salud",
  [HealthInsuranceEnum.OSPE]: "OSPE - Obra Social de Petroleros",
  [HealthInsuranceEnum.OSPESCHA]: "OSPescha - Personal de Estaciones de Servicio",
  [HealthInsuranceEnum.OSFE]: "OSFE - Obra Social Ferroviaria",
  [HealthInsuranceEnum.OSSACRA]: "OSSACRA - Amas de Casa de Argentina",
  [HealthInsuranceEnum.OSJERA]: "OSJERA - Personal Jerárquico",
  [HealthInsuranceEnum.FEDECAMARAS]: "Fedecámaras",
  [HealthInsuranceEnum.PAMI]: "PAMI",
  [HealthInsuranceEnum.OSPRERA]: "OSPRERA",
  [HealthInsuranceEnum.AVALIAN]: "Avalian",
  [HealthInsuranceEnum.APM]: "APM",
  [HealthInsuranceEnum.DASU]: "DASU",
  [HealthInsuranceEnum.TVSALUD]: "TV Salud",
  [HealthInsuranceEnum.JERARQUICOSALUD]: "Jerárquico Salud",
  [HealthInsuranceEnum.SCIS]: "SCIS",
  [HealthInsuranceEnum.IOSFA]: "IOSFA",
  [HealthInsuranceEnum.VISITAR]: "Visitar",
  [HealthInsuranceEnum.INTERMEDICINA]: "Inter Medicina",
  [HealthInsuranceEnum.OSDOP]: "OSDOP",
  [HealthInsuranceEnum.CSS]: "CSS",
  [HealthInsuranceEnum.UNOSALUD]: "UNO Salud",
  [HealthInsuranceEnum.VALLESALUD]: "Valle Salud",
  [HealthInsuranceEnum.OSECAC]: "OSECAC",
  [HealthInsuranceEnum.OSPATRONES]: "OSPATRONES",
  [HealthInsuranceEnum.OSDIPP]: "OSDIPP"
};
