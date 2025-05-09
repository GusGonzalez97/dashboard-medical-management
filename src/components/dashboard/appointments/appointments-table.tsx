'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import dayjs, {extend} from 'dayjs';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { AppointmentStatusEnum, type MedicalAppointmentI } from '@/types/medical-appointment';
import { medicalAppointmentStatusDictionary, reasonDictionary } from '@/utils/dictionary/general';
import { AppointmentActionEnum } from '@/components/core/dialog/appointment-actions';
import { useToast } from '@/contexts/toast-provider';
import StatusChip, { StatusValueEnum } from '@/components/core/Chip/status-chip';
import { AppointmentServices } from '@/services/appointment/appointment-services';
import { AppointmentsFilters } from './appointment-filters';
import utc from "dayjs/plugin/utc";
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/auth';

const ActionModal = dynamic(()=> import('@/components/core/dialog/appointment-actions'),{ssr:false})

extend(utc);

interface MedicalAppointmentsTableProps {
  readonly count?: number;
  readonly page?: number;
  readonly rows?: MedicalAppointmentI[];
  readonly rowsPerPage?: number;
}

export function MedicalAppointmentsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 10,
}: MedicalAppointmentsTableProps): React.JSX.Element {
  const router = useRouter();
  const [search, setSearch] = React.useState('')
  const [loading,setLoading] = React.useState<boolean>(false)
  const [_appointments, _setAppointments] = React.useState<MedicalAppointmentI[]>(rows)
  const [pageOptions, setPageOptions] = React.useState({ page: 0, rowsPerPage: 10, total: 0 })
  const [showAppointmentActions, setShowAppointmentActions] = React.useState<boolean>(false)
  const [appointmentSelected, setAppointmentSelected] = React.useState<MedicalAppointmentI>()
  const { _toast } = useToast()
  const {isDoctor} = useAuth()

  React.useEffect(() => {
    _setAppointments(rows)
    setPageOptions({ page, rowsPerPage, total: count })
  }, [rows, rowsPerPage, count, page]);

    const fetchAppointments = React.useCallback(
      async (_page:number, perPage:number, term = search) => {
        if (term.length > 2 || term.length === 0) {
          try {
            const filters = term.length > 2 ? { 'patient.documentNumber': { contains: term } } : undefined;
            const { data } = await AppointmentServices.getAllEvents(
              _page,
              perPage,
              filters,
              'date',
              'desc'
            );
            _setAppointments((prev) =>
              JSON.stringify(prev) === JSON.stringify(data.data) ? prev : data.data
            );
            setPageOptions({
              page: data.pagination.page - 1, // 👈 para MUI
              rowsPerPage: perPage,
              total: data.pagination.total ?? 0,
            });
          } catch (error) {
            _toast('Error al traer datos', 'error');
          }
        }
      },
      [search, _toast]
    );

    React.useEffect(() => {
        const delayDebounce = setTimeout(async () => {
          await fetchAppointments(0,10,search);
        }, 300);
      
        return () => {clearTimeout(delayDebounce)};
      }, [search, fetchAppointments, pageOptions.rowsPerPage]);
      
      const handleChangePage = async (_: unknown, newPage: number): Promise<void> => {
        await fetchAppointments(newPage, pageOptions.rowsPerPage, search); // 👈 pasás page + 1 a la API
      };
    
  const onCancelAppointment = React.useCallback(async (appointmentId:string)=> {
    setLoading(true)
    try {
      await AppointmentServices.cancelEvent(appointmentId)
      _toast('Turno cancelado con éxito', 'success')
    } catch (error) {
      _toast('Error al cancelar el turno', 'error')
    }
    finally {
      setLoading(false)
      router.refresh()
      setShowAppointmentActions(false)
    }
  },[_toast,router])

  const handlerActions = React.useCallback(async(action: AppointmentActionEnum)=>{
    if (!appointmentSelected) return null

    if (action === AppointmentActionEnum.CREATERECORD) {
      router.push(`/dashboard/integrations/create?patientId=${appointmentSelected.patient._id}&appointmentId=${appointmentSelected._id}`)
    }
    if (action === AppointmentActionEnum.CANCEL) {
      await onCancelAppointment(appointmentSelected._id??'')
    }
  },[appointmentSelected,onCancelAppointment,router])

  const onClickInAppointmentItem = React.useCallback((_appointmentSelected: MedicalAppointmentI): void=>{
    setAppointmentSelected(_appointmentSelected)
    setShowAppointmentActions(true)
  },[])

  const statusColorsConfig = React.useMemo(() => (
    {
      [AppointmentStatusEnum.CONFIRMED]: StatusValueEnum.SUCCESS,
      [AppointmentStatusEnum.CANCELLED]: StatusValueEnum.SECONDARY,
      [AppointmentStatusEnum.PENDING]: StatusValueEnum.WARNING,
    }
  ), [])

  return (
    <>
      <AppointmentsFilters search={search} setSearch={setSearch} />
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: '1000px' }}>
            <TableHead>
              <TableRow>
                <TableCell>Fecha de turno</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Sucursal</TableCell>
                <TableCell>Motivo</TableCell>
                <TableCell>Practica</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_appointments?.map((row) => (
                <TableRow hover key={row._id}>
                  <TableCell>{dayjs(row.date).utc().format("MMM D, YYYY HH:mm")}</TableCell>
                  <TableCell>{row.patient ? `${row.patient.name} ${row.patient.lastname}` : 'N/A'}</TableCell>
                  <TableCell>{row.patient ? Number(row.patient.documentNumber).toLocaleString('es-AR') : 'N/A'}</TableCell>
                  <TableCell>{row.branch ? row.branch.address?.city : 'No asignado'}</TableCell>
                  <TableCell>{reasonDictionary[row.reason] || 'N/A'}</TableCell>
                  <TableCell>{row.practice || 'N/A'}</TableCell>
                  <TableCell>
                    <StatusChip variant='outlined' status={row.status} width={100} statusDictionary={medicalAppointmentStatusDictionary} statusColorMap={statusColorsConfig} />
                  </TableCell>
                  <TableCell>
                    <Button disabled={row.status === AppointmentStatusEnum.CANCELLED || isDoctor} size='small' onClick={() => { onClickInAppointmentItem(row) }} variant='outlined'>Atender</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={pageOptions.total}
          onPageChange={handleChangePage}
          page={pageOptions.page}
          rowsPerPage={pageOptions.rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <ActionModal actionLoading={loading} open={showAppointmentActions} onClose={() => { setShowAppointmentActions(false) }} onAction={handlerActions} />
    </>
  );
}
