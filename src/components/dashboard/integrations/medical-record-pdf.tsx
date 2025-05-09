
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import type { MedicalRecordI } from '@/types/medical-record';
import { IconButton } from '@mui/material';
import { DownloadSimple } from '@phosphor-icons/react';
import { secondary } from '@/styles/theme/colors';

interface MedicalRecordPDFProps {
  readonly data: MedicalRecordI;
}

interface PDFComponentProps {
  data: MedicalRecordI;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#f3f4f6',
  },
  header: {
    width: '100%',
    position: 'relative',
    paddingBottom: 10,
    marginBottom: 20,
    borderBottom: '1px solid #e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1f2937',
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#4b5563',
  },
  value: {
    fontSize: 12,
    marginBottom: 5,
    color: '#1f2937',
  },
  divider: {
    borderBottom: '1px solid #e5e7eb',
    marginVertical: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 10,
  },
});

function MedicalRecordPDF( {data} : MedicalRecordPDFProps): React.JSX.Element {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Historia Clínica</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Información del Paciente</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Nombre:</Text>
              <Text style={styles.value}>{data?.patient?.name ?? 'No especificado'}</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>DNI:</Text>
              <Text style={styles.value}>{data?.patient?.documentNumber ?? 'No especificado'}</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Obra Social:</Text>
              <Text style={styles.value}>{data?.patient?.healthInsurance?.healthInsuranceName ?? 'No especificado'}</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Número de Afiliado:</Text>
              <Text style={styles.value}>{data?.patient?.healthInsurance?.membershipNumber ?? 'No especificado'}</Text>
              <View style={styles.divider} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Información de la Consulta</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.value}>{data?.createdAt}</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Motivo:</Text>
              <Text style={styles.value}>{data?.appointment?.reason ?? 'No especificado'}</Text>
              <View style={styles.divider} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Examen Visual</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Presión OD:</Text>
              <Text style={styles.value}>{data?.intraocular?.rightEye ?? 'No especificado'}</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Presión OI:</Text>
              <Text style={styles.value}>{data?.intraocular?.leftEye ?? 'No especificado'}</Text>
              <View style={styles.divider} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Prescripción</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>OD:</Text>
              <Text style={styles.value}>{data?.prescription?.rightEye ?? 'No especificado'}</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>OI:</Text>
              <Text style={styles.value}>{data?.prescription?.leftEye ?? 'No especificado'}</Text>
              <View style={styles.divider} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Diagnóstico y Tratamiento</Text>
          <View style={styles.section}>
            <Text style={styles.label}>Diagnóstico:</Text>
            <Text style={styles.value}>{data?.diagnosis}</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Plan de Tratamiento:</Text>
            <Text style={styles.value}>{data?.treatmentPlan}</Text>
            <View style={styles.divider} />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default function PDFComponent({ data }: PDFComponentProps): React.JSX.Element {
  return (
    <PDFDownloadLink
      document={<MedicalRecordPDF data={data} />}
      fileName="historia_clinica.pdf"
      style={{ textDecoration: 'none' }}
    >
      <IconButton >
      <DownloadSimple size={28} color={secondary[300]} />
      </IconButton>
    </PDFDownloadLink>
  );
}
