import React from 'react';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Tooltip,
  Typography,
  Paper,
  TextField,
  Stack,
  Autocomplete,
} from '@mui/material';
import { Trash, Upload, FileText, Image, Link } from '@phosphor-icons/react';
import { studies } from '@/types/medical-record';
import { fourth } from '@/styles/theme/colors';
import { FileArrowDown } from '@phosphor-icons/react/dist/ssr';

interface UploadedFile {
  name: string;
  fileUrl: string;
}

interface FileItem {
  id: string;
  name: string;
  file: File | null;
}

interface UploadFileCombinatedProps {
  uploadedFiles: UploadedFile[];
  inputItems: FileItem[];
  onInputItemsChange: (items: FileItem[]) => void;
  uploadDisabled?: boolean;
  isMobile?: boolean;
}

const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};

export default function FileUploaderWithList({
  uploadedFiles,
  inputItems,
  onInputItemsChange,
  uploadDisabled = false,
  isMobile = false,
}: UploadFileCombinatedProps): React.JSX.Element {

  const addItem = (): void => {
    const newItem: FileItem = {
      id: crypto.randomUUID(),
      name: '',
      file: null,
    };
    onInputItemsChange([...inputItems, newItem]);
  };

  const removeItem = (id: string): void => {
    onInputItemsChange(inputItems.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<FileItem>): void => {
    const updated = inputItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    onInputItemsChange(updated);
  };

  const handleFileChange = (id: string, file: File | null): void => {
    updateItem(id, { file });
  };

  const handleDownload = (e: React.MouseEvent, fileUrl: string, filename: string): void => {
    e.preventDefault();
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      window.open(fileUrl, '_blank');
    }
  };
  
  const handleView = (e: React.MouseEvent, fileUrl: string) :void=> {
    e.preventDefault();
    window.open(fileUrl, '_blank');
  };

  return (
    <Stack spacing={3} maxWidth={600} mt={2}>
      {/* Lista de archivos ya cargados */}
      {uploadedFiles.length > 0 ? (
        <Box className="bg-white rounded-lg shadow-sm border border-gray-200">
          <List>
            {uploadedFiles.map((file) => {
              const isImage = isImageFile(file.name);
              return (
                <ListItem
                  key={file.name}
                  className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  sx={{
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar sx={{ width: 40, height: 40, background: fourth[900] }}>
                      {isImage ? (
                        <Image className="h-4 w-4 text-gray-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-600" size={20} />
                      )}
                    </Avatar>
                  </ListItemAvatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 500, color: 'text.primary' }}
                    >
                      {file.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      noWrap={isMobile}
                      sx={{
                        color: 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: isMobile ? 'ellipsis' : 'unset',
                        whiteSpace: isMobile ? 'nowrap' : 'normal',
                        maxWidth: isMobile ? 150 : 'none',
                        display: 'inline-block'
                      }}
                    >
                      {decodeURIComponent(file.fileUrl.split('/').pop()?.split('?')[0] || '')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    {isImage ? (
                      <Tooltip title="Ver archivo">
                        <IconButton
                          onClick={(e) => { handleView(e, file.fileUrl) }}
                          size="small"
                          sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                          <Link className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    <Tooltip title="Descargar archivo">
                      <IconButton
                        onClick={(e) => {handleDownload(e, file.fileUrl, file.name)}}
                        size="small"
                        sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                      >
                        <FileArrowDown className="h-4 w-4"size={25} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ) : inputItems.length === 0 ? <Typography variant='body1' align='center' mt={2}>Aún no has cargado archivos</Typography> : null}

      {/* Archivos por cargar */}

      {inputItems.map((item) => (
        <Paper
          key={item.id}
          elevation={0}
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Autocomplete
              options={studies}
              size="small"
              value={item.name || null}
              sx={{ width: '65%' }}
              onChange={(_, value) => { updateItem(item.id, { name: value ?? '' }) }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Título"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            <Box width="40%">
              <input
                type="file"
                id={`file-${item.id}`}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileChange(item.id, file);
                }}
              />
              <label htmlFor={`file-${item.id}`}>
                <Button
                  variant="outlined"
                  component="span"
                  size="large"
                  sx={{
                    height: 40,
                    wordBreak: 'break-all',
                    padding: 1,
                    fontSize: 12,
                    width: '100%',
                  }}
                >
                  {item.file ? item.file.name.slice(0, 40) : 'Cargar archivo'}
                </Button>
              </label>
            </Box>
            <IconButton
              onClick={() => { removeItem(item.id) }}
              color="error"
              sx={{ mt: 0.5 }}
            >
              <Trash size={20} />
            </IconButton>
          </Box>
        </Paper>
      ))}
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="text"
          onClick={addItem}
          disabled={uploadDisabled}
          startIcon={<Upload size={20} />}
          sx={{ borderRadius: 2 }}
        >
          Agregar
        </Button>
      </Box>
    </Stack>
  );
}
