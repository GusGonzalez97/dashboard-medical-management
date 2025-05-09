import { pathsForUniqueScreen } from "@/paths";

export function applyPagination<T>(rows: T[], page: number, rowsPerPage: number): T[] {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }

  export function hideSideNav(path:string):boolean{
   return pathsForUniqueScreen.some((route)=> path.includes(route))
}

export function getAliasHelper(name?:string,lastname?:string):string{
  if(!name || !lastname) return '-'
  return `${name[0].toUpperCase()}${lastname[0].toUpperCase()}`
}