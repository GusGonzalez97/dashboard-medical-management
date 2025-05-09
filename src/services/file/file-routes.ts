const BASE_URL = '/v1/cloud-storage'

export const FileRoutes = {
    upload:(path:string)=> `${BASE_URL}/upload?path=${path}`,
    delete: (key:string)=> `${BASE_URL}/${key}`,
    getFile:() => `${BASE_URL}/signed-url`
}