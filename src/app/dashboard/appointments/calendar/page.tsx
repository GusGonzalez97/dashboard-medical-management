'use server'
import Calendar from "@/components/dashboard/appointments/ReactBigCalendar/ReactBigCalendar";
import { AppointmentServices, type GetAppointmentsResponseI } from "@/services/appointment/appointment-services";
import { AppointmentStatusEnum } from "@/types/medical-appointment";
import withSession from "@/utils/whitsession";
import { Stack, Typography } from "@mui/material";
import { cookies } from "next/headers";
import React from "react"

async function MedicalApointment(): Promise<React.JSX.Element> {
  const { data } = await getData()
  return <Stack><Typography variant="h4" align='center' mb={4}>Calendario</Typography> <Calendar appointments={data} /> </Stack>
}

async function getData(): Promise<GetAppointmentsResponseI['data']> {
  const _cookies = cookies()
  const filters = { "status": { "ne": AppointmentStatusEnum.CANCELLED } }
  const result = await withSession(_cookies, async () => {
    const res = await AppointmentServices.getAllEvents(0, 50, filters, 'date', 'desc')
    return res.data
  });

  if (result && 'data' in result && 'pagination' in result) {
    return result as GetAppointmentsResponseI['data'];
  }
  return { 
    data: [], 
    pagination: { 
      total: 0, 
      page: 1, 
      perPage: 50, 
      totalPages: 1, 
      nextPage: null, 
      prevPage: null 
    } 
  };
}

export default MedicalApointment

