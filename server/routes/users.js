// server/routes/users.js
const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth');
const roleAccess = require('../middlewares/roleMiddleware');

const router = express.Router();

// Middleware untuk memastikan user sudah login
router.use(verifyToken);

// Profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Routes untuk mendapatkan data khusus
router.get('/team-members', roleAccess.roleMiddleware(['ADMIN', 'DOSEN', 'MAHASISWA']), userController.getTeamMembers);
router.get('/reviewers', roleAccess.roleMiddleware(['ADMIN']), userController.getReviewers);

// Routes untuk user management (ADMIN only)
router.get('/', roleAccess.roleMiddleware(['ADMIN']), userController.getAll);
router.post('/', roleAccess.roleMiddleware(['ADMIN']), userController.create);

// Routes dengan parameter :id
router.get('/:id', roleAccess.roleMiddleware(['ADMIN']), userController.getById);
router.put('/:id', roleAccess.roleMiddleware(['ADMIN']), userController.update);
router.put('/:id/status', roleAccess.roleMiddleware(['ADMIN']), userController.updateStatus);
router.delete('/:id', roleAccess.roleMiddleware(['ADMIN']), userController.delete);

// PERBAIKAN: Tambahkan endpoint untuk statistik pengguna
router.get('/stats', roleAccess.roleMiddleware(['ADMIN']), userController.getUserStats);

module.exports = router;