const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const { successResponse, errorResponse } = require('../utils/response');

const prisma = new PrismaClient();

// Upload dokumen untuk proposal
const uploadProposalDocument = async (req, res) => {
  try {
    const { proposalId } = req.params;
    
    if (!req.file) {
      return errorResponse(res, 'File tidak ditemukan', 400);
    }

    // Cek apakah proposal exists
    const proposal = await prisma.proposal.findUnique({
      where: { id: parseInt(proposalId) }
    });

    if (!proposal) {
      // Hapus file yang sudah terupload jika proposal tidak ditemukan
      fs.unlinkSync(req.file.path);
      return errorResponse(res, 'Proposal tidak ditemukan', 404);
    }

    // Simpan info dokumen ke database
    const document = await prisma.document.create({
      data: {
        name: req.file.originalname,
        url: req.file.path,
        proposalId: parseInt(proposalId)
      }
    });

    return successResponse(res, 'File berhasil diupload', {
      document: {
        id: document.id,
        name: document.name,
        url: document.url,
        uploadedAt: document.uploadedAt
      }
    });

  } catch (error) {
    // Hapus file jika terjadi error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error uploading file:', error);
    return errorResponse(res, 'Gagal upload file', 500);
  }
};

// Get dokumen by proposal ID
const getProposalDocuments = async (req, res) => {
  try {
    const { proposalId } = req.params;

    const documents = await prisma.document.findMany({
      where: { proposalId: parseInt(proposalId) },
      orderBy: { uploadedAt: 'desc' }
    });

    return successResponse(res, 'Dokumen berhasil diambil', { documents });

  } catch (error) {
    console.error('Error getting documents:', error);
    return errorResponse(res, 'Gagal mengambil dokumen', 500);
  }
};

// Download file
const downloadFile = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await prisma.document.findUnique({
      where: { id: parseInt(documentId) }
    });

    if (!document) {
      return errorResponse(res, 'Dokumen tidak ditemukan', 404);
    }

    const filePath = path.resolve(document.url);
    
    if (!fs.existsSync(filePath)) {
      return errorResponse(res, 'File tidak ditemukan di server', 404);
    }

    // Set header untuk download
    res.setHeader('Content-Disposition', `attachment; filename="${document.name}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream file ke response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Error downloading file:', error);
    return errorResponse(res, 'Gagal download file', 500);
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await prisma.document.findUnique({
      where: { id: parseInt(documentId) }
    });

    if (!document) {
      return errorResponse(res, 'Dokumen tidak ditemukan', 404);
    }

    // Hapus file dari filesystem
    if (fs.existsSync(document.url)) {
      fs.unlinkSync(document.url);
    }

    // Hapus record dari database
    await prisma.document.delete({
      where: { id: parseInt(documentId) }
    });

    return successResponse(res, 'File berhasil dihapus');

  } catch (error) {
    console.error('Error deleting file:', error);
    return errorResponse(res, 'Gagal menghapus file', 500);
  }
};

// Upload general file (untuk keperluan lain)
const uploadGeneralFile = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'File tidak ditemukan', 400);
    }

    return successResponse(res, 'File berhasil diupload', {
      file: {
        name: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });

  } catch (error) {
    // Hapus file jika terjadi error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error uploading general file:', error);
    return errorResponse(res, 'Gagal upload file', 500);
  }
};

module.exports = {
  uploadProposalDocument,
  getProposalDocuments,
  downloadFile,
  deleteFile,
  uploadGeneralFile
};