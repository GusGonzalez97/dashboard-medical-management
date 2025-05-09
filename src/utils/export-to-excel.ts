import { saveAs } from 'file-saver';
import {utils,write,type WorkBook,type WorkSheet} from 'xlsx';

export const exportToExcel = <T>(data: T[], fileName: string) : void => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const ws: WorkSheet = utils.json_to_sheet(data);

  const wb: WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' }) as Uint8Array;
  const dataParsed = new Blob([excelBuffer], { type: fileType });

  saveAs(dataParsed, fileName + fileExtension);
};
