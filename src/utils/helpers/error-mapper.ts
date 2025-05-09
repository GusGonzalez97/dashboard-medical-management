export function handleError(errorCode: string):{message:string}{
  const errorResponses: Record<string, { message: string }> = {
    ERR_BAD_REQUEST: { message: "Solicitud incorrecta. Verifique los datos enviados." },
    FILE_REQUIRED: { message: "Debe adjuntar al menos un archivo." },
    BRANCH_NOT_FOUND: { message: "Sucursal no encontrada. Verifique los datos ingresados." },
    PATIENT_NOT_FOUND: { message: "Paciente no encontrado en el sistema." },
    PATIENT_EXISTS:{message:'Ya existe un paciente con ese número de documento'},
    UNAUTHORIZED: { message: "No tiene permisos para realizar esta acción." },
    SERVER_ERROR: { message: "Ocurrió un error en el servidor. Intente nuevamente más tarde." },
    BRANCH_NOT_AVAILABLE: { message: "La sucursal no esta disponible en ese dia u horario" },
    FORBIDDEN:{message:'No tiene los permisos suficientes'}
  };
  return errorResponses[errorCode] || { message: "Ocurrió un error desconocido." };
}
