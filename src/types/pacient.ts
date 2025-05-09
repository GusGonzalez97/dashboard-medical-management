import type { HealthInsuranceEnum } from "./medical-record";

export interface Address{
    street:string;
    city:CityEnum;
    state?:string;
}

export enum CityEnum{
    CR='cr',
    CO='co'
}

export interface FormValues {
    name: string;
    lastname: string;
    phone: string;
    documentNumber: string;
    documentProcedureNumber: string;
    dateOfBirth: string;
    street: string;
    city: CityEnum;
    hasHealthInsurance: boolean;
    healthInsuranceName: HealthInsuranceEnum| '';
    membershipNumber: string;
    email?: string;
    medicalHistory?: string[]; // e.g., ["Diabetes", "Hypertension"]
    ophthalmicHistory?: string; // e.g., ["Glaucoma", "LASIK surgery"]
    currentMedications?: string; // e.g., ["Artificial tears"]
  }

export interface Secure{
    membershipNumber:number;
    healthInsuranceName:HealthInsuranceEnum | '';
    documentProcedureNumber?:string;
}

interface LastMedialCheck{
    prescription: {
        rightEye: string; // e.g., "-2.00"
        leftEye: string; // e.g., "-1.50"
      };
    date:Date;
    diagnosis:string;
}

export interface PatientI{
    _id?:string;
    name:string;
    lastname:string;
    phone:string;
    documentNumber:string;
    dateOfBirth:string;
    address:Address;
    healthInsurance?:Secure
    lastMedicalRecord?:LastMedialCheck; //Aca guardamos el ultimo registro hecho, para facilitar el acceso a la graduacion y diagnostico ultimo
    medicalHistory?: string[]; // e.g., ["Diabetes", "Hypertension"]
    ophthalmicHistory?: string[]; // e.g., ["Glaucoma", "LASIK surgery"]
    currentMedications?: string[]; // e.g., ["Artificial tears"]
    email?:string;
    createdAt?:string;
    updatedAt?:string;
    doctorId:string;
}

export const _patient : FormValues={
    name: "",
    lastname: "",
    phone: "",
    documentNumber: "",
    documentProcedureNumber: "",
    dateOfBirth: "",
    street: "",
    city: CityEnum.CO,
    hasHealthInsurance: false,
    healthInsuranceName: '',
    membershipNumber: "",
    currentMedications:'',
    ophthalmicHistory:'',
    medicalHistory:[]
  }