import type { AxiosRequestConfig } from "axios"
import api from "../api"
import buildUrl from "@/utils/helpers/build-route"
import { PatientRoutes } from "./patient-routes"
import type { PatientI } from "@/types/pacient"
import type { PaginationInterface } from "@/types/https"

export interface GetPatientsResponseI {
    data: {data:PatientI[],pagination: PaginationInterface}
}

export interface GetPatientResponse{
    data:PatientI
}

export const PatientServices = {
    getAllPatients: async(page?:number,limit?:number,filters?:Record<string, unknown>,sortBy?:string,sortOrder?:'asc'|'desc') : Promise<GetPatientsResponseI>=> {
        const route :string = buildUrl(PatientRoutes.getAll(),{page,limit,filters,sortBy,sortOrder})
        const config : AxiosRequestConfig  = {
            method: 'GET',
            url: route
        }
        return (await api(config))
    },
    createPatient: async(data:PatientI)=>{
        const route:string = PatientRoutes.createPatient()
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: route,
            data
        }
        return await api(config)
    },
    getPatient: async(id:string) : Promise<GetPatientResponse> => {
        const route:string = PatientRoutes.getPatient(id)
        const config : AxiosRequestConfig  = {
            method: 'GET',
            url: route
        }
        return await api(config)
    },
    updatePatient: async(data:PatientI,patientId:string)=>{
        const route:string = PatientRoutes.updatePatient(patientId)
        const config: AxiosRequestConfig = {
            method: 'PATCH',
            url: route,
            data
        }
        return await api(config)
    },
    deletePatient: async(patientId:string) => {
        const route: string = PatientRoutes.deletePatient(patientId)
        const config:AxiosRequestConfig = {
            method:'DELETE',
            url:route
        }
        return await api(config)
    }
}