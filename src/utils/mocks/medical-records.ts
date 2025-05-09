import { HealthInsuranceEnum, PatologySeverity } from "@/types/medical-record";
import { StatusValueEnum } from "@/components/core/Chip/status-chip";

  export const patologyList = [
    { value: "presbicia", label: "Presbicia", severity: PatologySeverity.LOW },
    { value: "dmae", label: "Degeneración Macular Relacionada con la Edad (DMAE)", severity: PatologySeverity.HIGH },
    { value: "retinopatia_diabetica", label: "Retinopatía Diabética", severity: PatologySeverity.HIGH },
    { value: "desprendimiento_retina", label: "Desprendimiento de Retina", severity: PatologySeverity.CRITICAL },
    { value: "retina", label: "Afecciones de Retina", severity: PatologySeverity.MEDIUMHIGH },
    { value: "queratocono", label: "Queratocono", severity: PatologySeverity.MEDIUM },
    { value: "ojo_seco", label: "Síndrome de Ojo Seco", severity: PatologySeverity.LOW },
    { value: "conjuntivitis", label: "Conjuntivitis", severity: PatologySeverity.LOW },
    { value: "blefaritis", label: "Blefaritis", severity: PatologySeverity.LOW },
    { value: "uveitis", label: "Uveítis", severity: PatologySeverity.MEDIUMHIGH },
    { value: "neuropatia_optica", label: "Neuropatía Óptica", severity: PatologySeverity.CRITICAL },
    { value: "estrabismo", label: "Estrabismo", severity: PatologySeverity.LOW },
    { value: "ambliopia", label: "Ambliopía (Ojo Vago)", severity: PatologySeverity.LOW },
    { value: "retinosis_pigmentaria", label: "Retinosis Pigmentaria", severity: PatologySeverity.CRITICAL },
    { value: "daltonismo", label: "Daltonismo", severity: PatologySeverity.LOW },
    { value: "hemorragia_vitrea", label: "Hemorragia Vítrea", severity: PatologySeverity.HIGH },
    { value: "edema_macular", label: "Edema Macular", severity: PatologySeverity.HIGH },
    { value: "celulitis_orbitaria", label: "Celulitis Orbitaria", severity: PatologySeverity.CRITICAL },
    { value: "cornea", label: "Afecciones de Córnea", severity: PatologySeverity.MEDIUM },
    { value: "parasitos", label: "Parásitos", severity: PatologySeverity.CRITICAL },
  ];

  export const patologySeverityMap: Record<string, PatologySeverity> = {
    presbicia: PatologySeverity.LOW,
    dmae: PatologySeverity.HIGH,
    retinopatia_diabetica: PatologySeverity.HIGH,
    desprendimiento_retina: PatologySeverity.CRITICAL,
    retina: PatologySeverity.MEDIUMHIGH,
    queratocono: PatologySeverity.MEDIUM,
    ojo_seco: PatologySeverity.LOW,
    conjuntivitis: PatologySeverity.LOW,
    blefaritis: PatologySeverity.LOW,
    uveitis: PatologySeverity.MEDIUMHIGH,
    neuropatia_optica: PatologySeverity.CRITICAL,
    estrabismo: PatologySeverity.LOW,
    ambliopia: PatologySeverity.LOW,
    retinosis_pigmentaria: PatologySeverity.CRITICAL,
    daltonismo: PatologySeverity.LOW,
    hemorragia_vitrea: PatologySeverity.HIGH,
    edema_macular: PatologySeverity.HIGH,
    celulitis_orbitaria: PatologySeverity.CRITICAL,
    cornea: PatologySeverity.MEDIUM,
    parasitos: PatologySeverity.CRITICAL,
  };

  export const patologyStatusColorMap: Record<string, StatusValueEnum> = {
    presbicia: StatusValueEnum.WARNING, // amarillo flujo
    dmae: StatusValueEnum.INFO, // celeste - retina
    retinopatia_diabetica: StatusValueEnum.INFO,
    desprendimiento_retina: StatusValueEnum.INFO,
    retina: StatusValueEnum.INFO,
  
    queratocono: StatusValueEnum.PRIMARY, // azul - córnea
    cornea: StatusValueEnum.PRIMARY,
  
    ojo_seco: StatusValueEnum.WARNING,
    conjuntivitis: StatusValueEnum.WARNING,
    blefaritis: StatusValueEnum.WARNING,
    estrabismo: StatusValueEnum.WARNING,
    ambliopia: StatusValueEnum.WARNING,
    daltonismo: StatusValueEnum.WARNING,
   
    uveitis: StatusValueEnum.INFO,
    neuropatia_optica: StatusValueEnum.ERROR, // rojo - grave
  
    retinosis_pigmentaria: StatusValueEnum.INFO,
    hemorragia_vitrea: StatusValueEnum.SECONDARY, // marrón (sangre)
    edema_macular: StatusValueEnum.INFO,
  
    celulitis_orbitaria: StatusValueEnum.ERROR,
    parasitos: StatusValueEnum.SECONDARY,

    diabetes: StatusValueEnum.WARNING, // condición sistémica, no directamente ocular
    hipertension: StatusValueEnum.WARNING, // similar a diabetes
    hipermetropia: StatusValueEnum.SECONDARY, // error refractivo leve
  };
  

  export const severityColorMap: Record<PatologySeverity, string> = {
    [PatologySeverity.LOW]: '#FFEB3B',       // Amarillo flujo (ej: cataratas, presbicia)
    [PatologySeverity.MEDIUM]: '#2196F3',    // Azul (problemas en córnea)
    [PatologySeverity.MEDIUMHIGH]: '#03A9F4',// Celeste (retina, uveítis)
    [PatologySeverity.HIGH]: '#8D6E63',      // Marrón (parásitos, hemorragias)
    [PatologySeverity.CRITICAL]: '#C62828',  // Rojo intenso (histeria, locura, cosas graves)
  };
  

export const medicineList = [
  { "value": "miopia", "label": "Miopía" },
  { "value": "hipermetropia", "label": "Hipermetropía" },
  { "value": "astigmatismo", "label": "Astigmatismo" },
  { "value": "presbicia", "label": "Presbicia" },
  { "value": "glaucoma", "label": "Glaucoma" },
  { "value": "cataratas", "label": "Cataratas" },
  { "value": "retinopatia_diabetica", "label": "Retinopatía diabética" },
  { "value": "degeneracion_macular", "label": "Degeneración macular asociada a la edad (DMAE)" },
  { "value": "queratocono", "label": "Queratocono" },
  { "value": "uveitis", "label": "Uveítis" },
  { "value": "conjuntivitis", "label": "Conjuntivitis" },
  { "value": "blefaritis", "label": "Blefaritis" },
  { "value": "queratitis", "label": "Queratitis" },
  { "value": "sindrome_ojo_seco", "label": "Síndrome del ojo seco" }
]

export const healthInsuranceList: { value: HealthInsuranceEnum, label: string }[] = [
  { "value": HealthInsuranceEnum.OSDE, "label": "OSDE" },
  { "value": HealthInsuranceEnum.SWISSMEDICAL, "label": "Swiss Medical" },
  { "value": HealthInsuranceEnum.MEDIFE, "label": "Medifé" },
  { "value": HealthInsuranceEnum.GALENO, "label": "Galeno" },
  { "value": HealthInsuranceEnum.HOSPITALITALIANO, "label": "Hospital Italiano Plan de Salud" },
  { "value": HealthInsuranceEnum.OMINT, "label": "OMINT" },
  { "value": HealthInsuranceEnum.SURA, "label": "SURA" },
  { "value": HealthInsuranceEnum.SANCORSALUD, "label": "Sancor Salud" },
  { "value": HealthInsuranceEnum.ACCORDSALUD, "label": "Grupo Accord Salud" },
  { "value": HealthInsuranceEnum.PREVENCIONSALUD, "label": "Prevención Salud" },
  { "value": HealthInsuranceEnum.OSPE, "label": "OSPE - Obra Social de Petroleros" },
  { "value": HealthInsuranceEnum.OSPESCHA, "label": "OSPescha - Personal de Estaciones de Servicio" },
  { "value": HealthInsuranceEnum.OSFE, "label": "OSFE - Obra Social Ferroviaria" },
  { "value": HealthInsuranceEnum.OSSACRA, "label": "OSSACRA - Amas de Casa de Argentina" },
  { "value": HealthInsuranceEnum.OSJERA, "label": "OSJERA - Personal Jerárquico" },
  { "value": HealthInsuranceEnum.FEDECAMARAS, "label": "Fedecámaras" },
  { "value": HealthInsuranceEnum.PAMI, "label": "PAMI" },
  { "value": HealthInsuranceEnum.OSPRERA, "label": "OSPRERA" },
  { "value": HealthInsuranceEnum.AVALIAN, "label": "Avalian" },
  { "value": HealthInsuranceEnum.APM, "label": "APM" },
  { "value": HealthInsuranceEnum.DASU, "label": "DASU" },
  { "value": HealthInsuranceEnum.TVSALUD, "label": "TV Salud" },
  { "value": HealthInsuranceEnum.JERARQUICOSALUD, "label": "Jerárquico Salud" },
  { "value": HealthInsuranceEnum.SCIS, "label": "SCIS" },
  { "value": HealthInsuranceEnum.IOSFA, "label": "IOSFA" },
  { "value": HealthInsuranceEnum.VISITAR, "label": "Visitar" },
  { "value": HealthInsuranceEnum.INTERMEDICINA, "label": "Inter Medicina" },
  { "value": HealthInsuranceEnum.OSDOP, "label": "OSDOP" },
  { "value": HealthInsuranceEnum.CSS, "label": "CSS" },
  { "value": HealthInsuranceEnum.UNOSALUD, "label": "UNO Salud" },
  { "value": HealthInsuranceEnum.VALLESALUD, "label": "Valle Salud" },
  { "value": HealthInsuranceEnum.OSECAC, "label": "OSECAC" },
  { "value": HealthInsuranceEnum.OSPATRONES, "label": "OSPATRONES" },
  { "value": HealthInsuranceEnum.OSDIPP, "label": "OSDIPP" }
];


