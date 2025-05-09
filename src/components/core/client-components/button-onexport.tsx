'use client'
import { exportToExcel } from "@/utils/export-to-excel";
import { Button } from "@mui/material";
import React from "react";
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';

interface ButtonExportToExcelProps<T> {
    readonly data: T[];
    readonly title: string;
}

export function ButtonExportToExcel<T>({ data, title }: ButtonExportToExcelProps<T>): React.JSX.Element {
    const onExport = React.useCallback(() :void=> {
        exportToExcel(data, title); // Se infiere el tipo correctamente
    },[data,title]);

    return (
        <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)"/>} onClick={onExport}>
            Exportar
        </Button>
    );
}
