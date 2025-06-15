const express = require('express');
const router = express.Router();
const skemaController = require('../controllers/skema.controller');
const { auth } = require('../middlewares/auth');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// Public routes
router.get('/stats', skemaController.getSkemaStats);
router.get('/active', skemaController.getActiveSkema);
router.get('/', skemaController.getAllSkema);
router.get('/:id', skemaController.getSkemaById);  // Tetap publik

// 🔒 Protected routes - require authentication
router.use(auth);

// Admin only routes
router.post('/', roleMiddleware(['ADMIN']), skemaController.createSkema);
router.put('/:id', roleMiddleware(['ADMIN']), skemaController.updateSkema);
router.delete('/:id', roleMiddleware(['ADMIN']), skemaController.deleteSkema);

module.exports = router;