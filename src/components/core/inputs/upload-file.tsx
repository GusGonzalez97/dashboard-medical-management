import React, { useState, type ChangeEvent } from 'react';
import { Button, Box, Typography, LinearProgress, TextField, IconButton, Grid2 } from '@mui/material';
import { X } from '@phosphor-icons/react';

interface FileWithPreview {
  file: File;
  preview: string;
  progress: number;
}

function UploadFile() : React.JSX.Element{
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const simulateUpload = () => {
    setUploading(true);
    
    selectedFiles.forEach((_, index) => {
      const interval = setInterval(() => {
        setSelectedFiles(prev => {
          const newFiles = [...prev];
          if (newFiles[index].progress >= 100) {
            clearInterval(interval);
            if (index === selectedFiles.length - 1) {
              setUploading(false);
            }
            return newFiles;
          }
          newFiles[index] = {
            ...newFiles[index],
            progress: newFiles[index].progress + 10
          };
          return newFiles;
        });
      }, 500);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Box sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
        
        <TextField
          type="file"
          fullWidth
          onChange={handleFileChange}
          disabled={uploading}
          InputProps={{
            inputProps: {
              multiple: true,
              accept: 'image/*,application/pdf'
            }
          }}
        />

        {selectedFiles.length > 0 && (
          <Grid2 container spacing={2} sx={{ mt: 2 }}>
            {selectedFiles.map((file, index) => (
              <Grid2 size={{xs:12}} key={index}>
                <Box sx={{ 
                  p: 2, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  position: 'relative'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {file.file.type.startsWith('image/') ? (
                      <img 
                        src={file.preview} 
                        alt={file.file.name}
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginRight: '12px'
                        }}
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          mr: 1.5
                        }}
                      >
                        <Typography variant="body2">PDF</Typography>
                      </Box>
                    )}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" noWrap>
                        {file.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => {removeFile(index)}}
                      disabled={uploading}
                      sx={{ ml: 1 }}
                    >
                      <X size={18} />
                    </IconButton>
                  </Box>
                  {uploading ? (
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={file.progress}
                        sx={{ height: 4, borderRadius: 2 }}
                      />
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
                      >
                        {file.progress}%
                      </Typography>
                    </Box>
                  ): null}
                </Box>
              </Grid2>
            ))}
          </Grid2>
        )}

        {selectedFiles.length > 0 && (
          <Button
            variant="contained"
            fullWidth
            onClick={simulateUpload}
            disabled={uploading}
            sx={{ mt: 2 }}
          >
            {uploading ? 'Subiendo archivos...' : `Subir ${selectedFiles.length} archivo${selectedFiles.length === 1 ? '' : 's'}`}
          </Button>
        )}
      </Box>
    </div>
  );
}

export default UploadFile;