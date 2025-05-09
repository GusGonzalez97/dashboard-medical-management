import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const createDateTime = (dateString: string): string => {
    const date = new Date(dateString); // Convertir string a objeto Date
  
    // Ajustar a la zona horaria local
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  
    // Obtener fecha en formato YYYY-MM-DD
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Mes en 2 dígitos
    const day = String(localDate.getDate()).padStart(2, "0");
  
    // Obtener hora y minutos en formato HH:MM
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
  
    return `${year}-${month}-${day}T${hours}:${minutes}`; // Formato final
  };
  

  export const formatDateTime = (dateString: string): string => {
    return dayjs.utc(dateString) // Interpretar como UTC
      .format("YYYY-MM-DDTHH:mm"); // Formato final
  };
  