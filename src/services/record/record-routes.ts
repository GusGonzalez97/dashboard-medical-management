const BASE_URL= '/v1/medical-record'

 const RecordRoutes={
    getAllRecords: ()=> BASE_URL,
    createRecord:()=>  BASE_URL,
    getRecord: (id:string) => `${BASE_URL}/${id}`,
    updateRecord:(id:string) => `${BASE_URL}/${id}`,
    getRecordsByPatient:(patientId:string)=> `${BASE_URL}/patient/${patientId}`,
}

export default RecordRoutes