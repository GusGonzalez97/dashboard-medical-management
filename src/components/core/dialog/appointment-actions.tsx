import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import {  XCircle, FilePlus, X } from "@phosphor-icons/react";

export enum AppointmentActionEnum{
    EDIT='edit',
    CREATERECORD='create_record',
    DELETE='delete',
    CANCEL='cancel'
}

interface AppointmentActionProps{
    readonly open:boolean;
    readonly onClose:()=>void;
    readonly onAction: (actionType:AppointmentActionEnum) => void;
    readonly actionLoading:boolean;
}

function ActionModal({open,onClose,onAction,actionLoading}:AppointmentActionProps): React.JSX.Element {

  return (
      <Modal open={open} onClose={onClose} >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 500,
            minWidth: 350,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Box display='flex' justifyContent='space-between' width='100%' alignItems='center' mb={3}>
          <Typography variant="h6" textAlign="left">
            Acciones
          </Typography>

          <IconButton onClick={onClose}>
            <X />
          </IconButton>
          </Box>

          <Button
            fullWidth
            startIcon={<FilePlus size={30} />}
            onClick={() => {onAction(AppointmentActionEnum.CREATERECORD)}}
            sx={{ justifyContent: "flex-start", mb: 1 }}
          >
            Crear historia clínica
          </Button>

          <Button
            fullWidth
            startIcon={<XCircle size={30} />}
            onClick={() => {onAction(AppointmentActionEnum.CANCEL)}}
            sx={{ justifyContent: "flex-start", mb: 1 }}
            loading={actionLoading}
          >
            Cancelar turno
          </Button>
        </Box>
      </Modal>
  );
}

export default ActionModal;
