import { HealthInsuranceEnum } from "@/types/medical-record";
import { CityEnum, type PatientI } from "@/types/pacient";
import dayjs from "dayjs";

export const patients = [
    {
        name: "Juan Manuel",
        lastname: "Pérez",
        phone: "+54 9 11 4567-8901",
        documentNumber: "32123456",
        dateOfBirth: "1990-05-15",
        _id:'2312',
        createdAt:dayjs().toDate().toString(),
        doctorId:'',
        email:'gusegonzalez97@gmail.com',
        address: {
            street: "Av. Santa Fe 1234",
            city: CityEnum.CO,
            state: "CABA"
        },
        healthInsurance: {
            membershipNumber: 12345678,
            healthInsuranceName: HealthInsuranceEnum.OSDE
        },
        lastMedicalRecord: {
          diagnosis: "Cataratas",
          prescription: {
            rightEye:'',
            leftEye:''
          },
          date: dayjs().toDate()
      },
        medicalHistory: ["Diabetes", "Hipertensión"],
        ophthalmicHistory: ["Glaucoma", "Cirugía LASIK"],
        currentMedications: ["Lágrimas artificiales"]
    },
    {
      _id:'2312',
      createdAt:dayjs().toDate().toString(),
      doctorId:'',
      email:'gusegonzalez97@gmail.com',
        name: "María",
        lastname: "González",
        phone: "+54 9 11 1234-5678",
        documentNumber: "28765432",
        dateOfBirth: "1985-07-20",
        address: {
          street: "Av. Santa Fe 1234",
          city: CityEnum.CO,
          state: "CABA"
      },
        healthInsurance: {
            membershipNumber: 87654321,
            healthInsuranceName: HealthInsuranceEnum.OSDE
        },
        lastMedicalRecord: {
          diagnosis: "Cataratas",
          prescription: {
            rightEye:'',
            leftEye:''
          },
          date: dayjs().toDate()
      },
        medicalHistory: ["Hipotiroidismo"],
        ophthalmicHistory: ["Cirugía refractiva"],
        currentMedications: ["Levotiroxina"]
    },
    {
        name: "Carlos",
        _id:'2312',
        createdAt:dayjs().toDate().toString(),
        doctorId:'',
        lastname: "López",
        email:'gusegonzalez97@gmail.com',
        phone: "+54 9 351 456-7890",
        documentNumber: "25987654",
        dateOfBirth: "1978-12-03",
        address: {
          street: "Av. Santa Fe 1234",
          city: CityEnum.CO,
          state: "CABA"
      },
        healthInsurance: {
            membershipNumber: 13579246,
            healthInsuranceName: HealthInsuranceEnum.OSDE
        },
        lastMedicalRecord: {
            diagnosis: "Cataratas",
            prescription: {
              rightEye:'',
              leftEye:''
            },
            date: dayjs().toDate()
        },
        medicalHistory: ["Hipertensión"],
        ophthalmicHistory: ["Cataratas", "Desprendimiento de retina"],
        currentMedications: ["Amlodipina", "Aspirina"]
    }
  ] satisfies PatientI[];