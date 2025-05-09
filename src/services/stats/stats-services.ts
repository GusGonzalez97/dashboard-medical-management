import type { AxiosRequestConfig, AxiosResponse } from "axios";
import api from "../api";
import { StatsRoutes } from "./stats-routes";
import type{ AppointmentStatusData, BranchAppointmentsData } from "@/types/medical-appointment";
import type { HealthInsuranceData } from "@/types/medical-record";

export interface GetAppointmentStatusStats{
    data:AppointmentStatusData[];
}

export interface GetHealthInsuranceDataStats{
    data: HealthInsuranceData[];
}

export interface GetBranchAppointmentDataStats{
    data: BranchAppointmentsData[];
}

const StatsServices = {
    getPatientByHealthInsuranceStats: async (): Promise <AxiosResponse<GetHealthInsuranceDataStats>> => {
        const route: string = StatsRoutes.getPatientByHealthInsuranceStats();
        const config: AxiosRequestConfig = {
            method: "GET",
            url: route,
        };
        return await api(config);
    },
    getPatientCreationStats: async () : Promise <AxiosResponse<{total:number}>>=> {
        const route: string = StatsRoutes.getPatientCreationStats();
        const config: AxiosRequestConfig = {
            method: "GET",
            url: route,
        };
        return await api(config);
    },
    getRecordCreationStats: async (): Promise <AxiosResponse<{total:number}>> => {
        const route: string = StatsRoutes.getRecordCreationstats();
        const config: AxiosRequestConfig = {
            method: "GET",
            url: route,
        };
        return await api(config);
    },
    getAppointmentCreationStatsByBranch: async (): Promise<AxiosResponse<GetBranchAppointmentDataStats>> => {
        const route: string = StatsRoutes.getAppointmentCreationStatsByBranch();
        const config: AxiosRequestConfig = {
            method: "GET",
            url: route,
        };
        return await api(config);
    },
    getAppointmentCreationStatsByStatus: async () : Promise<AxiosResponse<GetAppointmentStatusStats>> => {
        const route: string = StatsRoutes.getAppointmentCreationStatsByStatus();
        const config: AxiosRequestConfig = {
            method: "GET",
            url: route,
        };
        return await api(config);
    },
};

export default StatsServices;
