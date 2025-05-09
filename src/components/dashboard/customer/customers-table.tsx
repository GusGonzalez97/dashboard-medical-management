'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // 👈 Importar el locale español

import type { PatientI } from '@/types/pacient';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import {Eye} from '@phosphor-icons/react/dist/ssr/Eye';
import {Trash} from '@phosphor-icons/react/dist/ssr/Trash';

import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/toast-provider';
import { PatientServices } from '@/services/patient/patient-services';
import { GenericTablePanel } from '../../core/client-components/customers-filters';
import dynamic from 'next/dynamic';
import { exportToExcel } from '@/utils/export-to-excel';
import { parsePatientsToSpanishKeys, type PatientExportI } from '@/utils/parser/patients-parser';
import { useAuth } from '@/contexts/auth';
import { Typography } from '@mui/material';
import { CopySimple } from '@phosphor-icons/react';
import { tertiary } from '@/styles/theme/colors';

const ConfirmActionDialog = dynamic(()=> import('@/components/core/dialog/confirm-action.dialog'),{ssr:false} )
const FullScreenLoader = dynamic(() => import('@/components/core/loader/loader'), { ssr: false });

dayjs.locale('es')

interface PacientsTableProps {
  count?: number;
  page?: number;
  rows?: PatientI[];
  rowsPerPage?: number;
}

export default function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 10,
}: PacientsTableProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [patientSelected,setPatientSelected] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [pageOptions, setPageOptions] = React.useState({ page, rowsPerPage: 10, total: 0 })
  const [_patients,_setPatients] = React.useState(rows)
  const [loading, setLoading] = React.useState(false) 
  const router = useRouter()
  const {_toast} = useToast()
  const {isDoctor} = useAuth()

  React.useEffect(() => {
    _setPatients(rows)
    setPageOptions({ page, rowsPerPage, total: count })
  }, [rows, rowsPerPage, count, page]);

  const fetchPatients = React.useCallback(
    async (_page:number, perPage:number, term = search) => {
      if (term.length > 2 || term.length === 0) {
        try {
          const filters = term.length > 2 ? { documentNumber: { contains: term } } : undefined;
          const { data } = await PatientServices.getAllPatients(
            _page,
            perPage,
            filters,
            'createdAt',
            'desc'
          );
          _setPatients((prev) =>
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
      await fetchPatients(0,10,search);
    }, 300);
  
    return () => {clearTimeout(delayDebounce)};
  }, [search, fetchPatients, pageOptions.rowsPerPage]);
  
  const handleChangePage = React.useCallback(async (_: unknown, newPage: number): Promise<void> => {
    await fetchPatients(newPage, pageOptions.rowsPerPage, search); // 👈 pasás page + 1 a la API
  },[fetchPatients,search,pageOptions.rowsPerPage])

  const onGoToDetail = React.useCallback((patientId?:string)=>{
    patientId && router.push(`/dashboard/customers/${patientId}`)
  },[router])

  const onDeletePatient = React.useCallback(async()=>{
    try {
      await PatientServices.deletePatient(patientSelected)
      _toast('Paciente eliminado!','success')
      const newPatients = _patients.filter(patient => patient._id !== patientSelected)
      _setPatients(newPatients)
    } catch (error) {
      _toast('Error al eliminar paciente','error')
    }
    finally{
      setOpen(false)
      setPatientSelected('')
    }
  },[_toast,setPatientSelected,patientSelected,_patients])

  const onDowloadAllPatients = React.useCallback(()=>{
    setLoading(true)
    try {
      const dataforDownload = parsePatientsToSpanishKeys(_patients)
      exportToExcel<PatientExportI>(dataforDownload,'pacientes')
    } catch (error) {
      _toast('Error al descargar pacientes','error')
    }finally{
      setLoading(false)
    }
  },[_patients,_toast,setLoading])

  const onRefresh = React.useCallback(async()=>{  
    setLoading(true)
    try {
      await fetchPatients(0,10)
    } catch (error) {
      _toast('Error al refrescar pacientes','error')
    }finally{
      setLoading(false)
    }
  }
  ,[_toast,fetchPatients])

  const copyToClipboard = React.useCallback(async (text: string):Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      _toast('Texto copiado al portapapeles', 'success');
    } catch (err) {
      _toast('Error al copiar documento','error')
    }
  },[_toast])
  
  if (loading) return <FullScreenLoader open={loading} />

  return (
    <>
      <GenericTablePanel search={search} onRefresh={onRefresh} setSearch={setSearch} onExport={onDowloadAllPatients}/>
      <Card>
      <Box sx={{ overflowX: 'auto', marginBottom:3 }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
            <TableCell>Creado</TableCell>
              <TableCell>Nombre y apellido</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Fecha de nacimiento</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_patients.map((row) => {
              return (
                <TableRow hover key={row._id} >
                  <TableCell width={150}>{dayjs(row.createdAt).format('D [de] MMMM, YYYY')}</TableCell>
                  <TableCell>{`${row.name} ${row.lastname}`}</TableCell>
                  <TableCell width={80}><Box display='flex' alignItems='center'><Typography variant='body2'>{Number(row.documentNumber).toLocaleString('es-AR')}</Typography> <IconButton onClick={()=> copyToClipboard(row.documentNumber)}><CopySimple size={18} color={tertiary[300]}/></IconButton> </Box></TableCell>
                  <TableCell>{dayjs(row.dateOfBirth).format('D MMMM, YYYY')}</TableCell>
                  <TableCell width={150}>{row.phone}</TableCell>
                  <TableCell>{row.email??'-'}</TableCell>
                  <TableCell width={150}>
                    <Box>
                    <Tooltip title="Ver detalle">
                      <IconButton onClick={()=>{onGoToDetail(row._id)}}>
                        <Eye size={20} />
                      </IconButton>
                      </Tooltip>
                      {!isDoctor && <Tooltip title="Eliminar">
                      <IconButton onClick={() => {setOpen(true);setPatientSelected(row._id??'')}}>
                        <Trash size={20} />
                      </IconButton>
                      </Tooltip>}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={pageOptions.total}
        onPageChange={handleChangePage}
        page={pageOptions.page}
        rowsPerPage={pageOptions.rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
    <ConfirmActionDialog
        open={open}
        title="Eliminar paciente"
        message="¿Estas seguro que deseas eliminar a este paciente?"
        onClose={() => {setOpen(false)}}
        actions={[
          { label: 'Cancelar', onClick: () => {setOpen(false)} },
          { label: 'Confirmar', onClick: onDeletePatient, autoFocus: true },
        ]}
      />
    </>
  );
}
