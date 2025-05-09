import type { AxiosRequestConfig } from "axios"
import api from "../api"
import { UserRoutes } from "./user-routes";
import type { PlatformUserI } from "@/types/user";
import buildUrl from "@/utils/helpers/build-route";

export interface GetProfileResponse{
    data:PlatformUserI
}

export const UserServices = {
   inviteUser:async(data:PlatformUserI)=>{
    const route:string = UserRoutes.invite()
    const config: AxiosRequestConfig = {
        method: 'POST',
        url: route,
        data:{data}
    }
    return await api(config)
   },
   getProfile: async() : Promise <GetProfileResponse>=>{
    const route:string = UserRoutes.getUserProfile()
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: route,
    }
    return (await api(config))
   },
   getAllUsers: async(page:number,limit:number,filters:Record<string, string | number | boolean>,sortBy:string,sortOrder:'asc'|'desc') : Promise<{ users: PlatformUserI[], total: number }>=> {
    const route :string = buildUrl(UserRoutes.getAllUsers(),{page,limit,filters,sortBy,sortOrder})
    const config : AxiosRequestConfig  = {
        method: 'GET',
        url: route
    }
    return await api(config)
},
}