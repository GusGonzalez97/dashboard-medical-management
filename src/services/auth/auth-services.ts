import type { AxiosRequestConfig, AxiosResponse } from "axios"
import api from "../api"
import { AuthRoutes } from "./auth-routes"
import type { AuthCredentials } from "@/types/auth"

export const AuthService = {
    login: async (username: string, password: string): Promise<AxiosResponse<AuthCredentials>> => {
        const route = AuthRoutes.login()
        const config = {
          headers: {Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`},
          url:route,
          method:'POST'
        };
        return await api(config)
      },
    logout: async()=>{
        const route:string = AuthRoutes.logout()
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: route,
        }
        return await api(config)
    },
    refreshToken: async (refreshToken: string) : Promise<AxiosResponse<AuthCredentials>>=> {
        const route:string = AuthRoutes.refreshToken()
        const config: AxiosRequestConfig = {
            method:'PATCH',
            url:route,
            data:{refresh:refreshToken}
          };
          return await api(config)
      },
    changePassword: async(oldPassword:string,newPassword:string) => {
        const route:string = AuthRoutes.changePassword()
        const config : AxiosRequestConfig  = {
            method: 'POST',
            url: route,
            data:{oldPassword,newPassword}
        }
        return await api(config)
    },
    forgotPassword: async(email:string)=>{
        const route:string = AuthRoutes.forgotPassword()
        const config: AxiosRequestConfig = {
            method: 'POST',
            url: route,
            data:{email}
        }
        return await api(config)
    }
}