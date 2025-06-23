const express = require('express');
const router = express.Router();
const { uploadSingle, handleUploadError } = require('../middlewares/upload');
const { verifyToken } = require('../middlewares/auth');
const {
  uploadProposalDocument,
  getProposalDocuments,
  downloadFile,
  deleteFile,
  uploadGeneralFile
} = require ('../controllers/file.controller');

// Middleware auth untuk semua routes
router.use(verifyToken);

// Upload dokumen untuk proposal
router.post('/proposals/:proposalId/upload', 
  uploadSingle('document'), 
  handleUploadError, 
  uploadProposalDocument
);

// Get dokumen by proposal ID
router.get('/proposals/:proposalId/documents', getProposalDocuments);

// Download file
router.get('/download/:documentId', downloadFile);

// Delete file
router.delete('/documents/:documentId', deleteFile);

// Upload general file
router.post('/upload', 
  uploadSingle('file'), 
  handleUploadError, 
  uploadGeneralFile
);

module.exports = router;