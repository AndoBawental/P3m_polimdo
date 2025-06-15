const express = require('express');
const router = express.Router();

const {
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewers,
  assignReviewer,
  getProposalsForReview,
  createReview
} = require('../controllers/review.controller');

const { verifyToken } = require('../middlewares/auth');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// All routes require authentication
router.use(verifyToken);

// GET all reviews
router.get('/', roleMiddleware(['ADMIN', 'REVIEWER', 'DOSEN', 'MAHASISWA']), getAllReviews);

// GET proposals for review
router.get('/proposals', roleMiddleware(['REVIEWER', 'ADMIN']), getProposalsForReview);

// GET reviewers list
router.get('/reviewers', roleMiddleware(['ADMIN']), getReviewers);

// POST create new review
router.post('/', roleMiddleware(['REVIEWER', 'ADMIN']), createReview);

// POST assign reviewer to proposal
router.post('/assign', roleMiddleware(['ADMIN']), assignReviewer);

// GET review by ID
router.get('/:id', roleMiddleware(['ADMIN', 'REVIEWER', 'DOSEN', 'MAHASISWA']), getReviewById);

// PUT update review
router.put('/:id', roleMiddleware(['ADMIN', 'REVIEWER']), updateReview);

// DELETE review
router.delete('/:id', roleMiddleware(['ADMIN']), deleteReview);

module.exports = router;