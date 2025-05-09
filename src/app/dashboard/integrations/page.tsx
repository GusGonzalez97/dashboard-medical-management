'use client'
import * as React from 'react';
import RecordServices, { type GetRecordsResponseI } from '@/services/record/record-services';
import MedicalRecordsTable from '@/components/dashboard/integrations/medical-records-table';
import { useAuth } from '@/contexts/auth';
import { getDayRangeUTC } from '@/utils/helpers/get-date-range-utc';

const limit = 10
const page = 0

export default function Page(): React.JSX.Element {
  const [data, setData] = React.useState<GetRecordsResponseI["data"]>({
    data: [],
    pagination: {
      total: 0,
      page: 0,
      perPage: 10,
      totalPages: 0,
      nextPage: 1,
      prevPage: 1,
    }
  });
  const {isDoctor} = useAuth()
  
  const getData= React.useCallback(async (_page: number, _perPage: number): Promise<GetRecordsResponseI | undefined> => {
    const filters = isDoctor?  {"and": [{'status':{'in':['pending','inProgress']}},  {"createdAt":{"between": getDayRangeUTC(new Date())}}]}  :undefined
    const sortOrder = isDoctor? 'asc' : 'desc'
    return await RecordServices.getAllRecords(_page,_perPage,filters,'createdAt',sortOrder)
},[isDoctor])

  React.useEffect(() => { 
    getData(page, limit).then((res: GetRecordsResponseI | undefined) => {
     if(res) setData(res?.data)
    }
    ).catch((_error:unknown) => {
      //
    }
    )
    return () => {
      setData({
        data: [],
        pagination: {
          total: 0,
          page: 0,
          perPage: 10,
          totalPages: 0,
          nextPage: 1,
          prevPage: 1,
        }
      })
    }
  }
  ,[getData]);

  return (
      <MedicalRecordsTable
        count={data.pagination.total}
        page={page}
        rows={data.data}
        rowsPerPage={data.pagination.perPage}
      />
  );
}
