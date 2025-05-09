const BASE_URL = '/v1/patient'

export const PatientRoutes = {
    getAll:()=> BASE_URL,
    createPatient: ()=> BASE_URL,
    getPatient:(id:string) => `${BASE_URL}/${id}`,
    updatePatient:(id:string) => `${BASE_URL}/${id}`,
    deletePatient:(id:string)=> `${BASE_URL}/${id}`
}