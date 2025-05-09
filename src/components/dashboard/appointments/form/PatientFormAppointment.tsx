import type { HealthInsuranceEnum } from "@/types/medical-record";
import { healthInsuranceList } from "@/utils/mocks/medical-records";
import { Grid2, MenuItem, TextField } from "@mui/material"
import React from "react"

export interface PatientFormValue {
    name: string;
    lastname: string;
    phone: string;
    documentNumber: string;
    healthInsuranceName?: HealthInsuranceEnum;
    membershipNumber?: string;
}

interface PatientFormProps {
    patient: PatientFormValue;
    setPatient: (patient: PatientFormValue) => void;
}

function PatientForm({ patient, setPatient }: PatientFormProps): React.JSX.Element {
    return <Grid2 container width='100%' spacing={1}>
        <Grid2 size={{ xs: 12, md: 4, lg: 4 , sm:6}}>
        <TextField
                fullWidth
                required
                label="Cédula"
                variant="outlined"
                placeholder="Cédula del paciente"
                value={patient.documentNumber}
                onChange={(e) => { setPatient({ ...patient, documentNumber: e.target.value }) }}
                margin="dense"
            />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4, lg: 4 , sm:6}}>
            <TextField
                fullWidth
                required
                label="Nombre"
                variant="outlined"
                placeholder="Nombre del paciente"
                value={patient.name}
                onChange={(e) => { setPatient({ ...patient, name: e.target.value }) }}
                margin="dense"
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4, lg: 4 , sm:6}}>
            <TextField
                fullWidth
                required
                label="Apellido"
                variant="outlined"
                placeholder="Apellido del paciente"
                value={patient.lastname}
                onChange={(e) => { setPatient({ ...patient, lastname: e.target.value }) }}
                margin="dense"
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4, lg: 4 , sm:6}}>
            <TextField
                fullWidth
                label="Telefono"
                variant="outlined"
                placeholder="Telefono del paciente"
                value={patient.phone}
                required
                onChange={(e) => {
                    const defaultPrefix = "+54"; // Define the default prefix
                    const input = e.target.value; // Input is already a string

                    if (!input.startsWith(defaultPrefix)) {
                        const cleaned = input.replace(/^\+?\d*/, '');
                        setPatient({ ...patient, phone: defaultPrefix + cleaned });
                    } else {
                        setPatient({ ...patient, phone: input });
                    }
                }}
                margin="dense"
                inputProps={{
                    inputMode: 'tel', // Esto es correcto
                }}
            />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4, lg: 4 , sm:6}}>
            <TextField
                fullWidth
                select
                margin="dense"
                label="Seguro Médico"
                value={patient.healthInsuranceName || ""}
                onChange={(e) => {
                    setPatient({
                        ...patient,
                        healthInsuranceName: e.target.value as HealthInsuranceEnum,
                    })
                }
                }
            >
                {healthInsuranceList.map((option) => (
                    <MenuItem
                        key={`${option.value}-${option.label}`}
                        value={option.value}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </Grid2>
    </Grid2>
}

export default PatientForm