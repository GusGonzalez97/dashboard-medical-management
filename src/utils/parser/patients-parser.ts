import {type PatientI } from '@/types/pacient';
import { branchDictionary } from '../dictionary/general';

export interface PatientExportI {
    Nombre: string;
    Apellido: string;
    'Celular': string;
    'Numero de cédula': string;
    FechaNacimiento: string;
    Direccion: string;
    Correo: string;
    'Seguro Médico': string;
    'Historial médico': string;
    'Medicamentos actuales': string[];
}

export function parsePatientsToSpanishKeys(patients: PatientI[]): PatientExportI[] {
    // Map keys from English to Spanish
    const parsedPatients: PatientExportI[] = patients.map((patient) => ({
        Nombre: patient.name,
        Apellido: patient.lastname,
        'Celular': patient.phone,
        'Numero de cédula': patient.documentNumber,
        FechaNacimiento: patient.dateOfBirth,
        Ciudad: branchDictionary[patient.address.city]??'-', // Assuming address has a 'city' property
        Direccion: patient.address.street, // Assuming address has a 'street' property
        Correo: patient.email??'-',
        'Seguro Médico': patient.healthInsurance?.healthInsuranceName??'', // Assuming healthInsurance has a 'name' property
        'Historial médico': patient.medicalHistory?.join(',')??'', // Assuming medicalHistory is an array of strings
        'Medicamentos actuales': patient.currentMedications??[''], // Assuming currentMedications is an array of strings
    }));

   return parsedPatients
}
