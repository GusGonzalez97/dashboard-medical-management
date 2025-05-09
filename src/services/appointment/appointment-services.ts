import type { AxiosRequestConfig } from "axios"
import api from "../api"
import AppointmentRoutes from "./appointment-routes"
import buildUrl from "@/utils/helpers/build-route"
import { type AppointmentStatusEnum, type AppointmentRequest, type MedicalAppointmentI, type CheckAvailabilityInterface } from "@/types/medical-appointment";
import { type PaginationInterface } from "@/types/https";

export interface GetAppointmentsResponseI {
    data:{ data:MedicalAppointmentI[], pagination: PaginationInterface;};
}

interface GetAvailableBranchData{
    available:boolean,
    conflicts:'branch'|'doctor'
}

export interface GetAppointmentResponseI{
    data:MedicalAppointmentI
}

export interface GetAvailableBranchDataResponse{
    data: GetAvailableBranchData
}

export const AppointmentServices = {
    getAllEvents: async(page?:number,limit?:number,filters?:Record<string, unknown>,sortBy?:string,sortOrder?:'asc'|'desc') : Promise<GetAppointmentsResponseI>=> {
        const route :string = buildUrl(AppointmentRoutes.getAllEvents(),{page,limit,filters,sortBy,sortOrder})
        const config : AxiosRequestConfig  = {
            method: 'GET',
            url: route
        }
        return await api(config)
    },
    createEvent: async(data: AppointmentRequest)=>{
            const route:string = AppointmentRoutes.createEvent()
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: route,
            data
        }
        return await api(config)
    },
    checkAvailavility:async(data: CheckAvailabilityInterface): Promise<GetAvailableBranchDataResponse>=>{
        const route:string = AppointmentRoutes.checkAvailability()
    const config: AxiosRequestConfig = {
        method: 'POST',
        url: route,
        data
    }
    return await api(config)
},
    getEvent: async(id:string): Promise<GetAppointmentResponseI>=> {
        const route :string = AppointmentRoutes.getEvent(id)
        const config : AxiosRequestConfig  = {
            method: 'GET',
            url: route
        }
        return await api(config)
    },
    getEventByPatient: async(patientId:string)=>{
        const route :string = AppointmentRoutes.getEventByPatient(patientId)
        const config : AxiosRequestConfig  = {
            method: 'GET',
            url: route
        }
        return await api(config)
    },
    cancelEvent: async(eventId:string) => {
        const route:string = AppointmentRoutes.cancelEvent(eventId)
        const config : AxiosRequestConfig  = {
            method: 'DELETE',
            url: route,
            data:{reason:'El paciente no pudo asistir'}
        }
        return await api(config)
    },
    updateEvent:async(eventId:string,data:{status:AppointmentStatusEnum})=>{
        const route: string = AppointmentRoutes.updateEvent(eventId)
        const config: AxiosRequestConfig = {
            method: 'PATCH',
            url: route,
            data
        }
        return await api(config)
    }
}