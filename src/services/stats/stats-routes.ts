const BASE_URL = '/v1'

export const StatsRoutes = {
    getPatientByHealthInsuranceStats:() => `${BASE_URL}/patient/stats/health-insurance`,
    getPatientCreationStats:() => `${BASE_URL}/patient/stats/patient-creation`,
    getRecordCreationstats:()=> `${BASE_URL}/medical-record/stats/record-creation`,
    getAppointmentCreationStatsByBranch:()=> `${BASE_URL}/appointment/stats/appointments-by-branch`,
    getAppointmentCreationStatsByStatus:()=> `${BASE_URL}/appointment/stats/appointments-by-status`,
}