import React, { useState,useCallback  } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { downloadTemplate, sendMasterFile } from '../../../services/apiService';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function MasterFileUpload() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setFileName('');
  };

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['xls', 'xlsx', 'csv'];

    if (!validExtensions.includes(fileExtension)) {
      setSelectedFile(null);
      setFileName('');
      alert(`Unsupported file type. Please upload Excel (.xls, .xlsx) or CSV (.csv) files.\n\nFile extension: .${fileExtension}`);
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    console.log('File accepted:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });
  }, []);

  const download = async () => {
    try {
      setIsDownloading(true);
      setDownloadComplete(false);

      await downloadTemplate();

      setDownloadComplete(true);
      setTimeout(() => {
        setDownloadComplete(false);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const postFileToApi = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await sendMasterFile(formData);
      alert('File uploaded successfully!');
      handleClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      alert(`Error uploading file: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        startIcon={<CloudUploadIcon />}
      >
        Upload Master File
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Upload Master File (CSV, XLS, XLSX)</DialogTitle>
        <DialogContent>
          <Button
            component="label"
            variant="contained"
            fullWidth
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            {fileName || 'Select File'}
            <VisuallyHiddenInput
              type="file"
              accept=".csv, text/csv, .xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
            />
          </Button>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button
            variant="outlined"
            onClick={download}
            startIcon={<DownloadIcon />}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download Template'}
          </Button>
          <div>
            <Button onClick={handleClose} sx={{ mr: 1 }} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={postFileToApi}
              disabled={!selectedFile || isUploading}
              startIcon={<SendIcon />}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}