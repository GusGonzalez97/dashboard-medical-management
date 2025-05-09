import type { AxiosRequestConfig, AxiosResponse } from "axios"
import { FileRoutes } from "./file-routes"
import api from "../api"

export interface FileItem {
    id: string;
    name: string;
    file: File | null;
  }

export const FileServices = {
    getFile: async(key:string,expires=1800)=>{
        const route = FileRoutes.getFile()
        const data = {key,expires}
        const config : AxiosRequestConfig= {
            url:route,
            method:'POST',
            data
        }
        return await api(config)
    },
    uploadFile: async(path:string,file: FileItem): Promise<AxiosResponse<{key:string}>> =>{
        const route = FileRoutes.upload(path)
        const formData = new FormData();
        if (file.file) {
            formData.append('file', file.file);
        }
        const config: AxiosRequestConfig={
            headers:{
                "Accept": "application/json",
                "Content-Type": "multipart/form-data"
            },
            url:route,
            method:'POST',
            data: formData
        }
        return await api(config)
    },
    deleteFile: async(key:string) => {
        const route = FileRoutes.delete(key)
        const config : AxiosRequestConfig = {
            url:route,
            method:'DELETE'
        }
        return await api(config)
    }
}