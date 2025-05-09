import type { AxiosRequestConfig } from "axios"
import api from "../api"
import buildUrl from "@/utils/helpers/build-route"
import RecordRoutes from "./record-routes"
import type { MedicalRecordI } from "@/types/medical-record"
import type { PaginationInterface } from "@/types/https"

export interface GetRecordsResponseI {
    data: {data:MedicalRecordI[],pagination: PaginationInterface;};
}

export interface GetRecordResponseI{
    data:MedicalRecordI
}

const RecordServices = {
    getAllRecords: async(page?:number,limit?:number,filters?:Record<string, unknown>,sortBy?:string,sortOrder?:'desc'|'asc') : Promise<GetRecordsResponseI>=> {
        const route :string = buildUrl(RecordRoutes.getAllRecords(),{page,limit,filters,sortBy,sortOrder})
        const config : AxiosRequestConfig  = {
            method: 'GET',
            url: route
        }
        return await api(config)
    },
    createRecord: async(data: MedicalRecordI)=>{
        const route:string = RecordRoutes.createRecord()
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: route,
            data
        }
        return await api(config)
    },
    getRecord: async(id:string): Promise <GetRecordResponseI> => {
        const route:string = RecordRoutes.getRecord(id)
        const config : AxiosRequestConfig  = {
            method: 'GET',
            url: route
        }
        return await api(config)
    },
    updateRecord: async(id:string,data:MedicalRecordI)=>{
        const route:string = RecordRoutes.updateRecord(id)
        const config : AxiosRequestConfig  = {
            method: 'PATCH',
            url: route,
            data
        }
        return await api(config)
    },
    getRecordsByPatient: async(patientId:string):Promise<GetRecordsResponseI> =>{
        const route :string = RecordRoutes.getRecordsByPatient(patientId)
        const config : AxiosRequestConfig  = {
            method: 'GET',
            url: route
        }
        return await api(config)
    }
}

export default RecordServices