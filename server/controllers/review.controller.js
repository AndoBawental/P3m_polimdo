const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Ambil semua review dengan pagination dan filter
const getAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'all',
      search = '',
      reviewer = 'all'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const user = req.user;

    const allowedRekomendasi = ['LAYAK', 'TIDAK_LAYAK', 'REVISI'];
    let whereClause = {};

    // Role-based access control
    if (user.role === 'MAHASISWA') {
  whereClause.proposal = { ketuaId: user.id }; // Hanya proposal dimana dia ketua
} else if (user.role === 'DOSEN') {
  whereClause.proposal = { 
    OR: [
      { ketuaId: user.id }, // Proposal dia sebagai ketua
      { members: { some: { userId: user.id } } }
        ]
      };
    } else if (user.role === 'REVIEWER') {
      whereClause.reviewerId = user.id;
    }
    // ADMIN dapat melihat semua review (tidak ada pembatasan)

    // Filter by recommendation status
    if (status !== 'all' && allowedRekomendasi.includes(status.toUpperCase())) {
      whereClause.rekomendasi = status.toUpperCase();
    }

    // Filter by reviewer (admin only)
    if (reviewer !== 'all' && user.role === 'ADMIN') {
      whereClause.reviewerId = parseInt(reviewer);
    }

    // Search functionality
    if (search) {
      whereClause.OR = [
        {
          proposal: {
            judul: { contains: search, mode: 'insensitive' }
          }
        },
        {
          reviewer: {
            nama: { contains: search, mode: 'insensitive' }
          }
        }
      ];
    }

    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        include: {
          proposal: {
            select: {
              id: true,
              judul: true,
              status: true,
              tahun: true,
              ketua: {
                select: { id: true, nama: true, email: true }
              }
            }
          },
          reviewer: {
            select: {
              id: true,
              nama: true,
              email: true,
              bidang_keahlian: true
            }
          }
        },
        skip,
        take,
        orderBy: { tanggal_review: 'desc' }
      }),
      prisma.review.count({ where: whereClause })
    ]);

    // Get statistics
    const stats = await prisma.review.groupBy({
      by: ['rekomendasi'],
      _count: { id: true },
      where: whereClause
    });

    const reviewStats = {
      total: totalReviews,
      layak: stats.find(s => s.rekomendasi === 'LAYAK')?._count.id || 0,
      tidak_layak: stats.find(s => s.rekomendasi === 'TIDAK_LAYAK')?._count.id || 0,
      revisi: stats.find(s => s.rekomendasi === 'REVISI')?._count.id || 0
    };

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReviews / take),
          totalItems: totalReviews,
          itemsPerPage: take
        },
        stats: reviewStats
      }
    });

  } catch (error) {
    console.error('Error getting reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data review',
      error: error.message
    });
  }
};

// Ambil review berdasarkan ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: {
        proposal: {
          include: {
            ketua: {
              select: {
                id: true,
                nama: true,
                email: true,
                nim: true,
                jurusan: true
              }
            },
            skema: {
              select: { nama: true, kategori: true }
            },
            members: {
              include: {
                user: { select: { id: true, nama: true, email: true } }
              }
            }
          }
        },
        reviewer: {
          select: {
            id: true,
            nama: true,
            email: true,
            bidang_keahlian: true
          }
        }
      }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review tidak ditemukan'
      });
    }

    // Access control - sesuai dengan roleMiddleware di routes
    const hasAccess = 
  user.role === 'ADMIN' ||
  review.reviewerId === user.id ||
  (user.role === 'MAHASISWA' && review.proposal.ketuaId === user.id) ||
  (user.role === 'DOSEN' && (
    review.proposal.ketuaId === user.id ||
    review.proposal.members.some(m => m.userId === user.id)
  ));

if (!hasAccess) {
  return res.status(403).json({
    success: false,
    message: 'Anda tidak diizinkan mengakses review ini'
  });
}

    res.status(200).json({ success: true, data: review });

  } catch (error) {
    console.error('Error getting review:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data review',
      error: error.message
    });
  }
};

// Update review (hanya ADMIN dan REVIEWER)
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { skor_total, catatan, rekomendasi } = req.body;
    const user = req.user;

    // Validation
    if (!rekomendasi || !['LAYAK', 'TIDAK_LAYAK', 'REVISI'].includes(rekomendasi)) {
      return res.status(400).json({
        success: false,
        message: 'Rekomendasi wajib diisi dengan nilai yang valid'
      });
    }

    if (skor_total && (isNaN(skor_total) || skor_total < 0 || skor_total > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Skor harus berupa angka antara 0-100'
      });
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: { 
        reviewer: true, 
        proposal: {
          include: {
            ketua: { select: { nama: true } }
          }
        }
      }
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review tidak ditemukan'
      });
    }

    // Permission check - sesuai dengan roleMiddleware
    if (user.role === 'REVIEWER') {
      if (existingReview.reviewerId !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'Anda hanya bisa mengedit review sendiri'
        });
      }

      // Check if review can still be edited
      const editableStatuses = ['REVIEW', 'SUBMITTED'];
      if (!editableStatuses.includes(existingReview.proposal.status)) {
        return res.status(403).json({
          success: false,
          message: 'Review tidak dapat diedit karena proposal sudah final'
        });
      }
    }
    // ADMIN dapat mengedit semua review (tidak ada pembatasan tambahan)

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        skor_total: skor_total ? parseFloat(skor_total) : null,
        catatan,
        rekomendasi,
        tanggal_review: new Date()
      },
      include: {
        proposal: {
          select: {
            id: true,
            judul: true,
            ketua: { select: { nama: true } }
          }
        },
        reviewer: { select: { nama: true } }
      }
    });

    // Update proposal status based on recommendation
    let proposalStatus = 'REVIEW';
    if (rekomendasi === 'LAYAK') proposalStatus = 'APPROVED';
    else if (rekomendasi === 'TIDAK_LAYAK') proposalStatus = 'REJECTED';
    else if (rekomendasi === 'REVISI') proposalStatus = 'REVISION';

    await prisma.proposal.update({
      where: { id: existingReview.proposalId },
      data: { 
        status: proposalStatus,
        tanggal_review: new Date(),
        skor_akhir: skor_total ? parseFloat(skor_total) : null,
        catatan_reviewer: catatan
      }
    });

    res.status(200).json({
      success: true,
      message: 'Review berhasil diperbarui',
      data: updatedReview
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui review',
      error: error.message
    });
  }
};

// Hapus review (hanya ADMIN)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Hanya ADMIN yang bisa hapus - sudah dicek di roleMiddleware
    const existingReview = await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: { proposal: true }
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review tidak ditemukan'
      });
    }

    // Delete review and reset proposal status
    await Promise.all([
      prisma.review.delete({ where: { id: parseInt(id) } }),
      prisma.proposal.update({
        where: { id: existingReview.proposalId },
        data: { 
          status: 'SUBMITTED', 
          reviewerId: null,
          tanggal_review: null,
          skor_akhir: null,
          catatan_reviewer: null
        }
      })
    ]);

    res.status(200).json({
      success: true,
      message: 'Review berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus review',
      error: error.message
    });
  }
};

// Ambil reviewer (hanya ADMIN)
const getReviewers = async (req, res) => {
  try {
    const user = req.user;

    // Sudah dicek di roleMiddleware, tapi tetap ada double check
    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak'
      });
    }

    const reviewers = await prisma.user.findMany({
      where: {
        role: 'REVIEWER',
        status: 'AKTIF'
      },
      select: {
        id: true,
        nama: true,
        email: true,
        bidang_keahlian: true,
        _count: { 
          select: { 
            reviews: true,
            reviewedProposals: true
          } 
        }
      },
      orderBy: { nama: 'asc' }
    });

    res.status(200).json({
      success: true,
      data: reviewers
    });

  } catch (error) {
    console.error('Error getting reviewers:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data reviewer',
      error: error.message
    });
  }
};


// Menugaskan reviewer ke proposal (hanya ADMIN)
const assignReviewer = async (req, res) => {
  try {
    const { proposalId, reviewerId } = req.body;
    const user = req.user;

    // Validasi input
    if (!proposalId || !reviewerId) {
      return res.status(400).json({
        success: false,
        message: 'Proposal ID dan Reviewer ID wajib diisi'
      });
    }

    // Pastikan proposal ada
    const proposal = await prisma.proposal.findUnique({
      where: { id: parseInt(proposalId) }
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal tidak ditemukan'
      });
    }

    // Pastikan status proposal sesuai
    if (!['SUBMITTED', 'REVIEW'].includes(proposal.status)) {
      return res.status(400).json({
        success: false,
        message: 'Hanya proposal dengan status SUBMITTED atau REVIEW yang bisa ditugaskan reviewer'
      });
    }

    // Pastikan reviewer ada dan aktif
    const reviewer = await prisma.user.findUnique({
      where: { id: parseInt(reviewerId) }
    });

    if (!reviewer || reviewer.role !== 'REVIEWER' || reviewer.status !== 'AKTIF') {
      return res.status(404).json({
        success: false,
        message: 'Reviewer tidak ditemukan atau tidak aktif'
      });
    }

    // Update proposal
    const updatedProposal = await prisma.proposal.update({
      where: { id: parseInt(proposalId) },
      data: {
        reviewerId: parseInt(reviewerId),
        status: 'REVIEW' // Pastikan status diupdate
      },
      include: {
        reviewer: true // Sertakan data reviewer lengkap
      }
    });

    res.status(200).json({
      success: true,
      message: 'Reviewer berhasil ditugaskan',
      data: updatedProposal // Kirim data proposal yang sudah diupdate
    });

  } catch (error) {
    console.error('Error assigning reviewer:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menugaskan reviewer',
      error: error.message
    });
  }
};
/*******  9b335894-02b0-4ae4-b060-609cb3060765  *******/

// Proposal yang bisa direview (untuk REVIEWER dan ADMIN)
const getProposalsForReview = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const user = req.user;

    let whereClause = {};

    // Status filter
    if (status !== 'all') {
      if (['SUBMITTED', 'REVIEW', 'APPROVED', 'REJECTED', 'REVISION'].includes(status)) {
        whereClause.status = status;
      }
    } else {
      // Default: show proposals that need review
      whereClause.status = { in: ['SUBMITTED', 'REVIEW'] };
    }

    // Role-based access control - sesuai roleMiddleware
    if (user.role === 'REVIEWER') {
      whereClause.OR = [
        { reviewerId: user.id }, // Proposals assigned to this reviewer
        { reviewerId: null, status: 'SUBMITTED' } // Unassigned submitted proposals
      ];
    }
    // ADMIN dapat melihat semua proposal

    // Search functionality
    if (search) {
      const searchConditions = [
        {
          judul: { contains: search, mode: 'insensitive' }
        },
        {
          ketua: {
            nama: { contains: search, mode: 'insensitive' }
          }
        }
      ];

      if (whereClause.OR) {
        // If OR condition already exists, wrap it with search conditions
        whereClause = {
          AND: [
            { OR: whereClause.OR },
            { OR: searchConditions }
          ],
          status: whereClause.status
        };
      } else {
        whereClause.OR = searchConditions;
      }
    }

    const [proposals, totalProposals] = await Promise.all([
      prisma.proposal.findMany({
        where: whereClause,
        include: {
          ketua: {
            select: { 
              id: true,
              nama: true, 
              email: true, 
              nim: true 
            }
          },
          skema: {
            select: { 
              id: true,
              nama: true, 
              kategori: true 
            }
          },
          reviewer: {
            select: {
              id: true,
              nama: true,
              email: true
            }
          },
          reviews: {
            include: {
              reviewer: { select: { nama: true } }
            }
          },
          _count: {
            select: {
              members: true,
              documents: true,
              reviews: true
            }
          }
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.proposal.count({ where: whereClause })
    ]);

    // Get statistics
    const statusStats = await prisma.proposal.groupBy({
      by: ['status'],
      _count: { id: true },
      where: user.role === 'REVIEWER' ? {
        OR: [
          { reviewerId: user.id },
          { reviewerId: null, status: 'SUBMITTED' }
        ]
      } : {}
    });

    const stats = {
      total: totalProposals,
      submitted: statusStats.find(s => s.status === 'SUBMITTED')?._count.id || 0,
      review: statusStats.find(s => s.status === 'REVIEW')?._count.id || 0,
      approved: statusStats.find(s => s.status === 'APPROVED')?._count.id || 0,
      rejected: statusStats.find(s => s.status === 'REJECTED')?._count.id || 0,
      revision: statusStats.find(s => s.status === 'REVISION')?._count.id || 0
    };

    res.status(200).json({
      success: true,
      data: {
        proposals,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalProposals / take),
          totalItems: totalProposals,
          itemsPerPage: take
        },
        stats
      }
    });

  } catch (error) {
    console.error('Error getting proposals for review:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data proposal',
      error: error.message
    });
  }
};

// Buat review baru (REVIEWER dan ADMIN)
const createReview = async (req, res) => {
  try {
    const { proposalId, skor_total, catatan, rekomendasi } = req.body;
    const user = req.user;

    // Validation
    if (!proposalId || !rekomendasi) {
      return res.status(400).json({
        success: false,
        message: 'Proposal ID dan rekomendasi wajib diisi'
      });
    }

    if (!['LAYAK', 'TIDAK_LAYAK', 'REVISI'].includes(rekomendasi)) {
      return res.status(400).json({
        success: false,
        message: 'Rekomendasi harus salah satu dari: LAYAK, TIDAK_LAYAK, REVISI'
      });
    }

    if (skor_total && (isNaN(skor_total) || skor_total < 0 || skor_total > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Skor harus berupa angka antara 0-100'
      });
    }

    // Check if proposal exists
    const proposal = await prisma.proposal.findUnique({
      where: { id: parseInt(proposalId) },
      include: {
        ketua: { select: { nama: true } },
        reviews: { where: { reviewerId: user.id } }
      }
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal tidak ditemukan'
      });
    }

    // Check if proposal can be reviewed
    if (!['SUBMITTED', 'REVIEW'].includes(proposal.status)) {
      return res.status(400).json({
        success: false,
        message: 'Proposal tidak dapat direview pada status ini'
      });
    }

    // Check if user can review this proposal - sesuai roleMiddleware
    if (user.role === 'REVIEWER') {
      if (proposal.reviewerId && proposal.reviewerId !== user.id) {
        return res.status(403).json({
          success: false,
          message: 'Proposal ini sudah ditugaskan ke reviewer lain'
        });
      }
    }
    // ADMIN dapat review semua proposal

    // Check if user already reviewed this proposal
    if (proposal.reviews && proposal.reviews.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah memberikan review untuk proposal ini'
      });
    }

    // Create review
    const newReview = await prisma.review.create({
      data: {
        proposalId: parseInt(proposalId),
        reviewerId: user.id,
        skor_total: skor_total ? parseFloat(skor_total) : null,
        catatan,
        rekomendasi,
        tanggal_review: new Date()
      },
      include: {
        proposal: {
          select: {
            id: true,
            judul: true,
            ketua: { select: { nama: true } }
          }
        },
        reviewer: { select: { nama: true } }
      }
    });

    // Update proposal status and assign reviewer
    let proposalStatus = 'REVIEW';
    if (rekomendasi === 'LAYAK') proposalStatus = 'APPROVED';
    else if (rekomendasi === 'TIDAK_LAYAK') proposalStatus = 'REJECTED';
    else if (rekomendasi === 'REVISI') proposalStatus = 'REVISION';

    await prisma.proposal.update({
      where: { id: parseInt(proposalId) },
      data: {
        status: proposalStatus,
        reviewerId: user.id,
        tanggal_review: new Date(),
        skor_akhir: skor_total ? parseFloat(skor_total) : null,
        catatan_reviewer: catatan
      }
    });

    res.status(201).json({
      success: true,
      message: 'Review berhasil dibuat',
      data: newReview
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat review',
      error: error.message
    });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewers,
  assignReviewer,
  getProposalsForReview,
  createReview
};