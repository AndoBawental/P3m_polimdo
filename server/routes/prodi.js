// server/routes/prodi.js
const express = require('express');
const router = express.Router();
const prodiController = require('../controllers/prodiController');

// GET /api/prodi - Get all prodi (PUBLIC untuk registrasi)
router.get('/', prodiController.getAllProdi);

// GET /api/prodi/:id - Get prodi by ID (PUBLIC)
router.get('/:id', prodiController.getProdiById);
 
// POST /api/prodi - Create new prodi (PUBLIC)
router.post('/', prodiController.createProdi);

// PUT /api/prodi/:id - Update prodi (PUBLIC)
router.put('/:id', prodiController.updateProdi);

// DELETE /api/prodi/:id - Delete prodi (PUBLIC)
router.delete('/:id', prodiController.deleteProdi);

// CATATAN: Route untuk getProdiByJurusan sudah dipindah ke jurusan routes
// GET /api/jurusan/:id/prodi - Get prodi by jurusan (sudah ada di jurusan routes)

module.exports = router;
