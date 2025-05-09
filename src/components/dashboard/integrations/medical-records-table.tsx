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
import { MedicalRecordStatus, type MedicalRecordI } from '@/types/medical-record';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton'
import { Eye } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { medicalRecordStatusDictionary, reasonDictionary } from '@/utils/dictionary/general';
import StatusChip, { StatusValueEnum } from '@/components/core/Chip/status-chip';
import { useAuth } from '@/contexts/auth';
import { Clipboard } from '@phosphor-icons/react/dist/ssr';
import RecordServices from '@/services/record/record-services';
import { useToast } from '@/contexts/toast-provider';
import { exportToExcel } from '@/utils/export-to-excel';
import { parseMedicalRecordsToSpanish } from '@/utils/parser/records-parser';
import { GenericTablePanel } from '../../core/client-components/customers-filters';
import { Stack, Typography } from '@mui/material';
import { getDayRangeUTC } from '@/utils/helpers/get-date-range-utc';
import EmptyTableState from '@/components/core/empty-not-results/empty-not-results';
import dynamic from 'next/dynamic';

const FullScreenLoader = dynamic(()=> import('@/components/core/loader/loader'),{ssr:false})

interface MedicalRecordsTableProps {
  readonly count?: number;
  readonly page?: number;
  readonly rows?: MedicalRecordI[];
  readonly rowsPerPage?: number;
  readonly patientDocumentNumber?: string;
  readonly showPanel?: boolean;
  readonly isForClient?: boolean;
}

export default function MedicalRecordsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 10,
  patientDocumentNumber = '',
  showPanel = true,
  isForClient = false,
}: MedicalRecordsTableProps): React.JSX.Element {

  const { isDoctor } = useAuth()
  const router = useRouter()
  const { _toast } = useToast()
  const [search, setSearch] = React.useState('')
  const [pageOptions, setPageOptions] = React.useState({ page, rowsPerPage, total: 0 })
  const [_records, _setRecords] = React.useState(rows)
  const [loading, setLoading] = React.useState(false)

  const onGoToDetail = React.useCallback((medicalRecordId: string) => {
    router.push(`/dashboard/integrations/${medicalRecordId}`)
  }, [router])

  React.useEffect(() => {
    setSearch(patientDocumentNumber)
    _setRecords(rows)
    setPageOptions({ page, rowsPerPage, total: count })
  }, [rows, rowsPerPage, count, page, patientDocumentNumber]);

  const fetchRecords = React.useCallback(
    async (_page: number, perPage: number, filters?: Record<string, Record<string, string | number | boolean>>) => {
      try {
        setLoading(true)
        let newFilters = filters
        if(isDoctor && showPanel && !isForClient) {
          const baseConditions = [
            { 'status': { 'in': ['pending', 'inProgress'] } },
            { 'createdAt': { 'between': getDayRangeUTC(new Date()) } },
          ];
//@ts-expect-error: TypeScript cannot infer the structure of the filters object dynamically
          newFilters = isDoctor && showPanel
            ? {
                and: [
                  ...baseConditions,
                  ...(typeof filters?.patient?.documentNumber === 'string' && filters?.patient?.documentNumber.length > 0 ? [filters] : []),
                ],
              }
            : filters;
        }
        const sortOrder = isDoctor ? 'asc' : 'desc'
        const { data } = await RecordServices.getAllRecords(
          _page,
          perPage,
          newFilters,
          'createdAt',
          sortOrder
        );
        _setRecords((prev) =>
          JSON.stringify(prev) === JSON.stringify(data.data) ? prev : data.data
        );
        setPageOptions({
          page: data.pagination.page - 1,
          rowsPerPage: perPage,
          total: data.pagination.total ?? 0,
        });
      } catch (error) {
        _toast('Error al traer datos', 'error');
      }
      finally {
        setLoading(false);
      }
    },
    [_toast, isDoctor,showPanel,isForClient]
  );

  React.useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.length > 3 || search.length === 0) {
        const filters = { "patient.documentNumber": { "contains": search } };
        await fetchRecords(0, pageOptions.rowsPerPage, filters);
      }
    }, 300);

    return () => { clearTimeout(delayDebounce) };
  }, [search, fetchRecords, pageOptions.rowsPerPage]);

  const handleChangePage = React.useCallback(async (_: unknown, newPage: number): Promise<void> => {
    await fetchRecords(newPage, pageOptions.rowsPerPage, { "patient.documentNumber": { "contains": search } }); // 👈 pasás page + 1 a la API
  },[fetchRecords,search,pageOptions.rowsPerPage])

  const statusColorsConfig = React.useMemo(() => (
    {
      [MedicalRecordStatus.PENDING]: StatusValueEnum.WARNING,
      [MedicalRecordStatus.INPROGRESS]: StatusValueEnum.SECONDARY,
      [MedicalRecordStatus.DONE]: StatusValueEnum.SUCCESS,
      [MedicalRecordStatus.ERROR]: StatusValueEnum.ERROR
    }
  ), [])

  const actionByDoctor = React.useCallback(async (medicalRecordId: string): Promise<void> => {
    try {
      await RecordServices.updateRecord(medicalRecordId, { status: MedicalRecordStatus.INPROGRESS })
    } catch (error) {
      _toast('Error al actualizar historia clínica', 'error')
    }
  }, [_toast])

  const actions = React.useCallback(async (medicalRecordId: string, currentStatus?: MedicalRecordStatus): Promise<void> => {
    if (isDoctor && currentStatus === MedicalRecordStatus.PENDING) {
      await actionByDoctor(medicalRecordId)
    }
    onGoToDetail(medicalRecordId)
  },[isDoctor,actionByDoctor,onGoToDetail])

  const downloadRecords = React.useCallback(() => {
    setLoading(true)
    try {
      const dataforDownload = parseMedicalRecordsToSpanish(_records)
      exportToExcel(dataforDownload, 'Historias Clínicas')
    } catch (error) {
      _toast('Error al descargar pacientes', 'error')
    } finally {
      setLoading(false)
    }
  }, [_records, _toast, setLoading])

  const onRefresh = React.useCallback(async () => {
    setLoading(true)
    try {
      await fetchRecords(0, pageOptions.rowsPerPage)
    } catch (error) {
      _toast('Error al refrescar pacientes', 'error')
    } finally {
      setLoading(false)
    }
  }, [_toast, fetchRecords, pageOptions.rowsPerPage])

  if(loading) {
    return <FullScreenLoader open={loading}/>
  }

  return (
    <Stack spacing={2} sx={{ marginBottom: 3, width: '100%' }}>
      <Typography variant={showPanel ? 'h4': 'h5'} sx={{ marginBottom: 2, marginTop:1 }}>{`Historias Clínicas ${!showPanel? 'recientes':''}`}</Typography>
      {patientDocumentNumber.length === 0 && showPanel ? <GenericTablePanel onExport={downloadRecords} onRefresh={onRefresh} search={search} setSearch={setSearch} />
        : null}      <Card>
        <Box sx={{ overflowX: 'auto', marginBottom: 3 }}>
          <Table sx={{ minWidth: '800px' }}>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>DNI</TableCell>
                <TableCell>Motivo de consulta</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_records && _records.length > 0 ? _records.map((row) => (
                <TableRow hover key={row._id}>
                  <TableCell>{dayjs(row.createdAt).format('D [de] MMMM, YYYY')}</TableCell>
                  <TableCell>{`${row.patient?.name.split(' ')[0]} ${row.patient?.lastname}`}</TableCell>
                  <TableCell>{Number(row.patient?.documentNumber).toLocaleString('es-AR')}</TableCell>
                  <TableCell>{reasonDictionary[row?.appointment?.reason ?? '']}</TableCell>
                  <TableCell>
                    <StatusChip status={row.status ?? MedicalRecordStatus.PENDING} width={100} statusDictionary={medicalRecordStatusDictionary} statusColorMap={statusColorsConfig} />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={isDoctor && row.status === MedicalRecordStatus.PENDING ? 'Atender paciente' : "Ver detalle"}>
                      <IconButton onClick={async () => { row._id && await actions(row._id, row.status) }}>
                        {isDoctor && row.status === MedicalRecordStatus.PENDING ? <Clipboard size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )) : null}
            </TableBody>
          </Table>
          {_records.length === 0 && !loading ? <EmptyTableState /> : null}
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
    </Stack>
  );
}
