import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
  Avatar,
  Box,
  Tooltip,
  Typography,
} from '@mui/material';
import { ArrowDown, FileText, Image, Link } from '@phosphor-icons/react';

interface FileItem {
  name: string;
  fileUrl: string;
}

interface FileListProps {
  readonly files: FileItem[];
}

const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
};

function FileList({ files }: FileListProps): React.JSX.Element {
  const handleDownload = async (e: React.MouseEvent, fileUrl: string, filename: string) => {
    e.preventDefault();
    try {
      if (fileUrl.startsWith('http')) {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      window.open(fileUrl, '_blank');
    }
  };

  const handleView = (e: React.MouseEvent, fileUrl: string) => {
    e.preventDefault();
    window.open(fileUrl, '_blank');
  };

  return (
    <Box className="bg-white rounded-lg shadow-sm border border-gray-200 mb-2">
      <List>
        {files.map((file) => {
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
                <Avatar 
                  className="bg-gray-50"
                  sx={{ width: 32, height: 32 }}
                >
                  {isImage ? (
                    <Image className="h-4 w-4 text-gray-600" />
                  ) : (
                    <FileText className="h-4 w-4 text-gray-600" />
                  )}
                </Avatar>
              </ListItemAvatar>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  component="div"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                  }}
                >
                  {file.name}
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {file.fileUrl}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                {isImage ? (
                  <Tooltip title="Ver archivo">
                    <IconButton
                      onClick={(e) => {handleView(e, file.fileUrl)}}
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <Link className="h-4 w-4" />
                    </IconButton>
                  </Tooltip>
                ):null}
                <Tooltip title="Descargar archivo">
                  <IconButton
                    onClick={(e) => handleDownload(e, file.fileUrl, file.name)}
                    size="small"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default FileList;