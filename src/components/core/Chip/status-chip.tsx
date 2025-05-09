import { Chip } from "@mui/material";
import React from "react";

export enum StatusValueEnum{
    DEFAULT = 'default',
    WARNING = 'warning',
    SUCCESS = 'success',
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    ERROR = 'error',
    INFO = 'info'
}

interface StatusChipProps<T extends string | number | symbol> {
  readonly status: T;
  readonly statusDictionary: Record<T, string>;
  readonly statusColorMap?: Partial<Record<T, StatusValueEnum>>;
  readonly variant?: 'filled' | 'outlined';
  readonly width?:number;
  readonly size?: 'small'| 'medium'
}

export default function StatusChip<T extends string | number | symbol>({ status, statusDictionary, statusColorMap,variant,width,size }: StatusChipProps<T>): React.JSX.Element {
  return (
    <Chip
      label={statusDictionary[status]}
      sx={{width:width??'auto'}}
      variant={variant??'filled'}
      size={size??'medium'}
      color={statusColorMap?.[status] ?? "default"}
    />
  );
}
