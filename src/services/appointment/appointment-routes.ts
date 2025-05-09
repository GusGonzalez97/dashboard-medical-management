const BASE_URL= '/v1/appointment'

 const AppointmentRoutes={
    getAllEvents: ()=> BASE_URL,
    createEvent:()=>  BASE_URL,
    getEvent: (id:string) => `${BASE_URL}/${id}`,
    updateEvent:(id:string) => `${BASE_URL}/${id}`,
    getEventByPatient:(patientId:string) => `${BASE_URL}/patient/${patientId}`,
    checkAvailability:()=> `${BASE_URL}/availability/check`,
    cancelEvent:(id:string)=> `${BASE_URL}/${id}`
}

export default AppointmentRoutes