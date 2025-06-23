//server/routes/skema.js
const express = require('express');
const router = express.Router();
const skemaController = require('../controllers/skema.controller');
const { auth } = require('../middlewares/auth');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { param, query } = require('express-validator');

const validateId = [
  param('id').isInt().withMessage('ID harus berupa bilangan bulat').toInt()
];

const validateQuery = [
  query('tahun_aktif').optional().isLength({ min:4, max:4 }).withMessage('Tahun aktif harus 4 digit'),
  query('page').optional().isInt().toInt(),
  query('limit').optional().isInt().toInt()
];

// Public routes
router.get('/stats', skemaController.getSkemaStats);
router.get('/active', skemaController.getActiveSkema);
router.get('/', validateQuery, skemaController.getAllSkema);
router.get('/:id', validateId, skemaController.getSkemaById);

// 🔒 Protected routes - require authentication
router.use(auth);

// Admin only routes
router.post('/', roleMiddleware(['ADMIN']), skemaController.createSkema);
router.put('/:id', [...validateId, roleMiddleware(['ADMIN'])], skemaController.updateSkema);
router.delete('/:id', [...validateId, roleMiddleware(['ADMIN'])], skemaController.deleteSkema);

module.exports = router;