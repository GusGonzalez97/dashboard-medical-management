'use client'
import React, { useState } from "react";
import { Container, Button, Box } from "@mui/material";
import { Pencil, Trash } from "@phosphor-icons/react";
import ConfirmActionDialog from "@/components/core/dialog/confirm-action.dialog";
import RouterHandlerButton from "@/components/core/handler-router";
import { PatientServices } from "@/services/patient/patient-services";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/toast-provider";

interface PatientDetailProps {
  readonly patientId?: string;
}

export default function PatientProfileFooter({ patientId }: PatientDetailProps): React.JSX.Element {
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false)
  const router = useRouter()
  const {_toast}=useToast()

  const onDeletePatient = async(): Promise<void> => {
    try {
      if(patientId){
        await PatientServices.deletePatient(patientId)
        _toast('Paciente eliminado!','success')
        router.push('/dashboard/customers')
      }
    } catch (error) {
      _toast('Error al eliminar paciente','error')
    }
  }

  return (
    <Container >
      <Box display='flex' gap={3} width='100%' justifyContent='flex-end'>
      <RouterHandlerButton title="Editar" path={`/dashboard/customers/form?patient=${patientId}`} icon={<Pencil fontSize="var(--icon-fontSize-md)" />} variant="contained" />
        <Button size='large' onClick={() => { setOpenConfirmDelete(true) }}
          color="error" startIcon={<Trash fontSize="var(--icon-fontSize-md)" />} variant='outlined'>
          Eliminar
        </Button> 
      </Box>
      <ConfirmActionDialog
        open={openConfirmDelete}
        title="Eliminar paciente"
        message="¿Desea eliminar a este paciente?"
        onClose={() => { setOpenConfirmDelete(false) }}
        actions={[
          { label: 'Cancelar', onClick: () => {setOpenConfirmDelete(false)}},
          { label: 'Confirmar', onClick:()=> onDeletePatient(), autoFocus: true },
        ]}
      />
    </Container>
  );
}
