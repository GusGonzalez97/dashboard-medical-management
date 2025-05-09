'use client'
import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Button } from '@mui/material';
import { ArrowCounterClockwise, ArrowDown } from '@phosphor-icons/react';

interface FiltersProps{
  search:string;
  setSearch:(search:string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
}

export function GenericTablePanel({search,setSearch,onExport,onRefresh}:FiltersProps): React.JSX.Element {

  return (
    <Card sx={{ p: 2, display: 'flex',justifyContent:'space-between', alignItems:'center', gap:2, flexWrap:'wrap' }}>  
      <OutlinedInput
        value={search}
        fullWidth
        onChange={e => { setSearch(e.target.value) }}
        placeholder="Buscar por cédula"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '320px', minWidth: '200px' }}
      />
      <div style={{display:'flex',gap:5}}>
            <Button variant="outlined" onClick={onRefresh} startIcon={<ArrowCounterClockwise fontSize="var(--icon-fontSize-md)" />}>
              Actualizar
            </Button>
            <Button variant="outlined" onClick={onExport} startIcon={<ArrowDown fontSize="var(--icon-fontSize-md)" /> }>
              Descargar
            </Button>
            </div>
    </Card>
  );  
}
