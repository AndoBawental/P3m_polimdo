//server/controllers/dashboard.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendSuccess, sendError } = require('../utils/response');

const dashboardController = {
  // Get dashboard stats
  async getDashboardStats(req, res) {
    try {
      const { role } = req.user;
      let stats = {};

      switch (role) {
        case 'ADMIN':
          stats = await getAdminStats();
          break;
        case 'DOSEN':
          stats = await getDosenStats(req.user.id);
          break;
        case 'MAHASISWA':
          stats = await getMahasiswaStats(req.user.id);
          break;
        case 'REVIEWER':
          stats = await getReviewerStats(req.user.id);
          break;
        default:
          stats = await getDefaultStats();
      }

      return sendSuccess(res, 'Dashboard data berhasil dimuat', stats);
    } catch (error) {
      console.error('Dashboard Error:', error);
      return sendError(res, 'Gagal memuat data dashboard', 500);
    }
  },

  // Get recent proposals
  async getRecentProposals(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const { role, id: userId } = req.user;

      let whereClause = {};
      if (role !== 'ADMIN') {
        // Include proposals where user is either lead or member
        whereClause = {
          OR: [
            { ketuaId: userId },
            { members: { some: { userId: userId } } }
          ]
        };
      }

      const proposals = await prisma.proposal.findMany({
        where: whereClause,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ketua: {
            select: { nama: true, email: true }
          },
          skema: {
            select: { nama: true, kategori: true }
          },
          members: {
            select: {
              user: {
                select: { id: true, nama: true }
              }
            }
          }
        }
      });

      return sendSuccess(res, 'Recent proposals berhasil dimuat', proposals);
    } catch (error) {
      console.error('Recent Proposals Error:', error);
      return sendError(res, 'Gagal memuat recent proposals', 500);
    }
  },

  // Get recent users (Admin only)
  async getRecentUsers(req, res) {
    try {
      if (req.user.role !== 'ADMIN') {
        return sendError(res, 'Akses ditolak', 403);
      }

      const limit = parseInt(req.query.limit) || 5;

      const users = await prisma.user.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nama: true,
          email: true,
          role: true,
          status: true,
          createdAt: true
        }
      });

      return sendSuccess(res, 'Recent users berhasil dimuat', users);
    } catch (error) {
      console.error('Recent Users Error:', error);
      return sendError(res, 'Gagal memuat recent users', 500);
    }
  },

  // Get recent reviews
  async getRecentReviews(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const skip = parseInt(req.query.skip) || 0;

      const { role, id: userId } = req.user;

      let whereClause = {};
      if (role === 'REVIEWER') {
        whereClause = { reviewerId: userId };
      }

      const reviews = await prisma.review.findMany({
        skip: skip,
        take: limit,
        where: whereClause,
        include: {
          proposal: {
            select: {
              id: true,
              judul: true,
              status: true,
              ketua: { select: { nama: true, email: true } },
              skema: { select: { nama: true } }
            }
          },
          reviewer: {
            select: { nama: true, email: true }
          }
        },
        orderBy: { tanggal_review: 'desc' }
      });

      return sendSuccess(res, 'Recent reviews berhasil dimuat', reviews);
    } catch (error) {
      console.error('Recent Reviews Error:', error);
      return sendError(res, 'Gagal memuat recent reviews', 500);
    }
  },

  // Get announcements
  async getAnnouncements(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 3;

      const announcements = await prisma.pengumuman.findMany({
        where: { status: 'AKTIF' },
        take: limit,
        orderBy: { createdAt: 'desc' }
      });

      return sendSuccess(res, 'Announcements berhasil dimuat', announcements);
    } catch (error) {
      console.error('Announcements Error:', error);
      return sendError(res, 'Gagal memuat announcements', 500);
    }
  },

  // Get system health (Admin only)
  async getSystemHealth(req, res) {
    try {
      if (req.user.role !== 'ADMIN') {
        return sendError(res, 'Akses ditolak', 403);
      }

      const health = {
        database: 'connected',
        server: 'running',
        memory: process.memoryUsage(),
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      };

      return sendSuccess(res, 'System health berhasil dimuat', health);
    } catch (error) {
      console.error('System Health Error:', error);
      return sendError(res, 'Gagal memuat system health', 500);
    }
  },

  // Get activity logs (Admin only)
  async getActivityLogs(req, res) {
    try {
      if (req.user.role !== 'ADMIN') {
        return sendError(res, 'Akses ditolak', 403);
      }

      const limit = parseInt(req.query.limit) || 10;

      // Menggunakan proposal sebagai log aktivitas sederhana
      const activities = await prisma.proposal.findMany({
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          judul: true,
          status: true,
          updatedAt: true,
          ketua: {
            select: { nama: true }
          }
        }
      });

      return sendSuccess(res, 'Activity logs berhasil dimuat', activities);
    } catch (error) {
      console.error('Activity Logs Error:', error);
      return sendError(res, 'Gagal memuat activity logs', 500);
    }
  }
};

// Helper functions
async function getAdminStats() {
  try {
    const [
      totalProposals,
      totalUsers,
      totalReviews,
      totalSkema,
      pendingProposals,
      approvedProposals,
      rejectedProposals,
      activeUsers
    ] = await Promise.all([
      prisma.proposal.count(),
      prisma.user.count(),
      prisma.review.count(),
      prisma.skema.count(),
      prisma.proposal.count({ where: { status: 'SUBMITTED' } }),
      prisma.proposal.count({ where: { status: 'APPROVED' } }),
      prisma.proposal.count({ where: { status: 'REJECTED' } }),
      prisma.user.count({ where: { status: 'AKTIF' } })
    ]);

    return {
      totalProposals,
      totalUsers,
      totalReviews,
      totalSkema,
      pendingProposals,
      approvedProposals,
      rejectedProposals,
      activeUsers
    };
  } catch (error) {
    console.error('Admin Stats Error:', error);
    return getDefaultStats();
  }
}

async function getDosenStats(userId) {
  try {
    // Hitung proposal sebagai ketua
    const asKetua = await prisma.proposal.count({ 
      where: { ketuaId: userId } 
    });

    // Hitung proposal sebagai anggota (bukan ketua)
    const asAnggota = await prisma.proposal.count({
      where: {
        members: {
          some: {
            userId: userId,
            peran: 'ANGGOTA'
          }
        },
        NOT: { ketuaId: userId } // Exclude proposals where user is lead
      }
    });

    // Total semua proposal (ketua + anggota)
    const totalProposals = asKetua + asAnggota;

    // Statistik berdasarkan status untuk semua proposal yang melibatkan dosen
    const [pendingProposals, reviewProposals, approvedProposals, rejectedProposals] = await Promise.all([
      // Proposal dengan status 'SUBMITTED'
      prisma.proposal.count({
        where: {
          OR: [
            { ketuaId: userId },
            { members: { some: { userId: userId } } }
          ],
          status: 'SUBMITTED'
        }
      }),
      // Proposal dengan status 'REVIEW'
      prisma.proposal.count({
        where: {
          OR: [
            { ketuaId: userId },
            { members: { some: { userId: userId } } }
          ],
          status: 'REVIEW'
        }
      }),
      // Proposal dengan status 'APPROVED'
      prisma.proposal.count({
        where: {
          OR: [
            { ketuaId: userId },
            { members: { some: { userId: userId } } }
          ],
          status: 'APPROVED'
        }
      }),
      // Proposal dengan status 'REJECTED'
      prisma.proposal.count({
        where: {
          OR: [
            { ketuaId: userId },
            { members: { some: { userId: userId } } }
          ],
          status: 'REJECTED'
        }
      })
    ]);

    // Total skema yang tersedia
    const totalSkema = await prisma.skema.count({ 
      where: { 
        status: 'AKTIF',
        OR: [
          { tanggal_tutup: null },
          { tanggal_tutup: { gte: new Date() } }
        ]
      }
    });

    // Proposal yang perlu direview oleh dosen ini
    const reviewRequired = await prisma.proposal.count({
      where: {
        reviewerId: userId,
        status: 'REVIEW'
      }
    });

    return {
      totalProposals,
      asKetua,
      asAnggota,
      pendingProposals,
      reviewProposals,
      approvedProposals,
      rejectedProposals,
      totalSkema,
      reviewRequired
    };
  } catch (error) {
    console.error('Dosen Stats Error:', error);
    return {
      totalProposals: 0,
      asKetua: 0,
      asAnggota: 0,
      pendingProposals: 0,
      reviewProposals: 0,
      approvedProposals: 0,
      rejectedProposals: 0,
      totalSkema: 0,
      reviewRequired: 0
    };
  }
}

async function getMahasiswaStats(userId) {
  try {
    // Hitung proposal sebagai ketua
    const asKetua = await prisma.proposal.count({ 
      where: { ketuaId: userId } 
    });

    // Hitung proposal sebagai anggota (bukan ketua)
    const asAnggota = await prisma.proposal.count({
      where: {
        members: {
          some: {
            userId: userId,
            peran: 'ANGGOTA'
          }
        }
      }
    });

    // Statistik status untuk semua proposal yang melibatkan mahasiswa
    const [pendingProposals, approvedProposals] = await Promise.all([
      prisma.proposal.count({ 
        where: { 
          OR: [
            { ketuaId: userId },
            { members: { some: { userId: userId } } }
          ],
          status: 'SUBMITTED' 
        } 
      }),
      prisma.proposal.count({ 
        where: { 
          OR: [
            { ketuaId: userId },
            { members: { some: { userId: userId } } }
          ],
          status: 'APPROVED' 
        } 
      })
    ]);

    const totalSkema = await prisma.skema.count({ 
      where: { 
        status: 'AKTIF',
        OR: [
          { tanggal_tutup: null },
          { tanggal_tutup: { gte: new Date() } }
        ]
      }
    });

    return {
      totalProposals: asKetua + asAnggota,
      asKetua,
      asAnggota,
      pendingProposals,
      approvedProposals,
      totalSkema
    };
  } catch (error) {
    console.error('Mahasiswa Stats Error:', error);
    return {
      totalProposals: 0,
      asKetua: 0,
      asAnggota: 0,
      pendingProposals: 0,
      approvedProposals: 0,
      totalSkema: 0
    };
  }
}

async function getReviewerStats(userId) {
  try {
    const [
      myReviews,
      pendingReviews,
      completedReviews
    ] = await Promise.all([
      prisma.review.count({ where: { reviewerId: userId } }),
      prisma.proposal.count({ where: { reviewerId: userId, status: 'REVIEW' } }),
      prisma.review.count({ where: { reviewerId: userId } })
    ]);

    return {
      myReviews,
      pendingReviews,
      completedReviews
    };
  } catch (error) {
    console.error('Reviewer Stats Error:', error);
    return getDefaultStats();
  }
}

function getDefaultStats() {
  return {
    totalProposals: 0,
    totalUsers: 0,
    totalReviews: 0,
    totalSkema: 0,
    pendingProposals: 0,
    approvedProposals: 0,
    rejectedProposals: 0,
    activeUsers: 0
  };
}

module.exports = dashboardController;