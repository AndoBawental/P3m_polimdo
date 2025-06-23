const express = require('express');
const proposalController = require('../controllers/proposal.controller');
const { verifyToken, checkRole } = require('../middlewares/auth');

const router = express.Router();

// Semua route memerlukan autentikasi
router.use(verifyToken);

// GET /proposals - Berdasarkan role
router.get('/', proposalController.getAll);

// GET /proposals/:id - Detail proposal
router.get('/:id', proposalController.getById);

// POST /proposals - Create (DOSEN, MAHASISWA, ADMIN)
router.post(
  '/',
  checkRole('DOSEN', 'MAHASISWA', 'ADMIN'),
  proposalController.create
);

// PUT /proposals/:id - Update proposal
router.put('/:id', proposalController.update);

// ✅ POST /proposals/:id/submit - Submit proposal (MAHASISWA, DOSEN, ADMIN)
router.post(
  '/:id/submit',
  checkRole('MAHASISWA', 'DOSEN', 'ADMIN'),
  proposalController.submit
);

// PATCH /proposals/:id/status - Update status (ADMIN, REVIEWER)
router.patch(
  '/:id/status',
  checkRole('ADMIN', 'REVIEWER'),
  proposalController.updateStatus
);

// DELETE /proposals/:id - Delete proposal
router.delete('/:id', proposalController.delete);

// ✅ ENDPOINT BARU UNTUK PERSETUJUAN ANGGOTA
// Persetujuan anggota (hanya anggota yang bersangkutan yang boleh akses)
router.put(
  '/:proposalId/members/:memberId/approve',
  checkRole('DOSEN', 'MAHASISWA'),
  proposalController.approveMember
);

router.put(
  '/:proposalId/members/:memberId/reject',
  checkRole('DOSEN', 'MAHASISWA'),
  proposalController.rejectMember
);

module.exports = router;