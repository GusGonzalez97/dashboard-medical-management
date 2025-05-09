import React from 'react';
import { Box, Typography } from '@mui/material';
import { FileX } from '@phosphor-icons/react/dist/ssr';

export default function EmptyTableState () : React.JSX.Element {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="500px"
      color="text.secondary"
      textAlign="center"
      sx={{ opacity: 0.7, width: '100%' }}
    >
      <FileX size={40} />
      <Typography variant="h6" mt={2}>
        No se encontraron resultados
      </Typography>
      <Typography variant="body2">
        Probá ajustar los filtros o agregá nuevos datos.
      </Typography>
    </Box>
  );
};

