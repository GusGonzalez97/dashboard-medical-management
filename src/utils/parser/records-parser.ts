import type { MedicalRecordI } from "@/types/medical-record";

export function parseMedicalRecordsToSpanish(records: MedicalRecordI[]): Record<string, string>[] {
  const traduccionesStatus: Record<string, string> = {
    pending: 'Pendiente',
    inProgress: 'En progreso',
    done: 'Finalizada',
    error: 'Error',
  };

  return records.map((record) => ({
    'Fecha de creación': record.createdAt ?? '-',
    'Fecha de última actualización': record.updatedAt ?? '-',
    'Estado': traduccionesStatus[record.status ?? ''] ?? 'Desconocido',

    'Nombre del paciente': `${record.patient?.name ?? ''} ${record.patient?.lastname ?? ''}`.trim() || '-',
    'DNI del paciente': record.patient?.documentNumber ?? '-',
    'Fecha de nacimiento': record.patient?.dateOfBirth ?? '-',
    'Correo del paciente': record.patient?.email ?? '-',
    'Teléfono del paciente': record.patient?.phone ?? '-',
    'Obra social': `${record.patient?.healthInsurance?.healthInsuranceName ?? '-'} (${record.patient?.healthInsurance?.membershipNumber ?? '-'})`,

    'Presión intraocular OD (ojo derecho)': record.intraocular?.rightEye ?? '-',
    'Presión intraocular OI (ojo izquierdo)': record.intraocular?.leftEye ?? '-',

    'Graduación OD (ojo derecho)': record.prescription?.rightEye ?? '-',
    'Graduación OI (ojo izquierdo)': record.prescription?.leftEye ?? '-',

    'Examen segmento anterior': record.eyeExam?.anteriorSegment ?? '-',
    'Examen segmento posterior': record.eyeExam?.posteriorSegment ?? '-',

    'Diagnóstico': record.diagnosis ?? '-',
    'Diagnóstico refinado por IA': record.diagnosisRefinedByIA ?? '-',

    'Plan de tratamiento': record.treatmentPlan ?? '-',
    'Observaciones': record.observations ?? '-',

    'Estudios clínicos realizados': record.clinicalStudies?.map(e => e.name).join(', ') || '-',

    'Fecha de turno': record.appointment?.date ?? '-',
    'Motivo de consulta': record.appointment?.reason ?? '-',
  }));
}
