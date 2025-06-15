// server/controllers/proposalController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendResponse, sendError } = require('../utils/response');

const proposalController = {
  // GET ALL
  getAll: async (req, res) => {
    try {
      const { status, skema, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const where = {};

      if (status) where.status = status;
      if (skema) where.skemaId = parseInt(skema);

      switch (req.user.role) {
        case 'ADMIN':
          break;
        case 'REVIEWER':
          where.reviewerId = req.user.id;
          break;
        case 'DOSEN':
        case 'MAHASISWA':
          where.OR = [
            { ketuaId: req.user.id },
            { members: { some: { userId: req.user.id } } }
          ];
          break;
        default:
          return sendError(res, 'Role tidak valid', 403);
      }

      const [proposals, total] = await Promise.all([
        prisma.proposal.findMany({
          where,
          include: {
            skema: { select: { id: true, nama: true } },
            ketua: { select: { id: true, nama: true, email: true } },
            reviewer: { select: { id: true, nama: true } },
            _count: { select: { members: true, documents: true } }
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: parseInt(limit)
        }),
        prisma.proposal.count({ where })
      ]);

      sendResponse(res, 'Berhasil mendapatkan data proposal', {
        proposals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get proposals error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // GET BY ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(id) },
        include: {
          skema: true,
          ketua: { select: { id: true, nama: true, email: true } },
          reviewer: { select: { id: true, nama: true, email: true } },
          members: {
            include: {
              user: { select: { id: true, nama: true, email: true } }
            }
          },
          documents: true,
          reviews: {
            include: {
              reviewer: { select: { id: true, nama: true } }
            }
          }
        }
      });

      if (!proposal) return sendError(res, 'Proposal tidak ditemukan', 404);

      const hasAccess =
        req.user.role === 'ADMIN' ||
        proposal.ketuaId === req.user.id ||
        proposal.members.some(m => m.userId === req.user.id) ||
        (req.user.role === 'REVIEWER' && proposal.reviewerId === req.user.id);

      if (!hasAccess) return sendError(res, 'Akses ditolak', 403);

      sendResponse(res, 'Proposal berhasil ditemukan', { proposal });
    } catch (error) {
      console.error('Get proposal by ID error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // CREATE
  create: async (req, res) => {
    try {
      const { judul, abstrak, kata_kunci, skemaId, dana_diusulkan, anggota = [] } = req.body;

      if (!['DOSEN', 'MAHASISWA', 'ADMIN'].includes(req.user.role)) {
        return sendError(res, `Akses ditolak untuk role ${req.user.role}`, 403);
      }

      if (!judul || !abstrak || !kata_kunci || !skemaId) {
        return sendError(res, 'Data tidak lengkap', 400);
      }

      const skema = await prisma.skema.findUnique({ where: { id: parseInt(skemaId) } });
      if (!skema) return sendError(res, 'Skema tidak ditemukan', 400);

      const proposal = await prisma.proposal.create({
        data: {
          judul,
          abstrak,
          kata_kunci,
          skemaId: parseInt(skemaId),
          ketuaId: req.user.id,
          tahun: new Date().getFullYear(),
          dana_diusulkan: dana_diusulkan ? parseFloat(dana_diusulkan) : null,
          status: 'DRAFT',
          members: {
            create: [
              { userId: req.user.id, peran: 'KETUA' },
              ...anggota.map(id => ({ userId: parseInt(id), peran: 'ANGGOTA' }))
            ]
          }
        },
        include: {
          skema: true,
          ketua: { select: { id: true, nama: true } },
          members: {
            include: {
              user: { select: { id: true, nama: true } }
            }
          }
        }
      });

      sendResponse(res, 'Proposal berhasil dibuat', { proposal }, 201);
    } catch (error) {
      console.error('Create proposal error:', error);
      sendError(res, 'Terjadi kesalahan server: ' + error.message, 500);
    }
  },

  // UPDATE
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { judul, abstrak, kata_kunci, dana_diusulkan } = req.body;

      const existing = await prisma.proposal.findUnique({
        where: { id: parseInt(id) },
        include: { members: true }
      });

      if (!existing) return sendError(res, 'Proposal tidak ditemukan', 404);

      const canEdit =
        req.user.role === 'ADMIN' ||
        existing.ketuaId === req.user.id ||
        existing.members.some(m => m.userId === req.user.id);

      if (!canEdit) return sendError(res, 'Akses ditolak', 403);

      if (existing.status !== 'DRAFT' && req.user.role !== 'ADMIN') {
        return sendError(res, 'Proposal sudah diajukan, tidak dapat diedit', 400);
      }

      const updated = await prisma.proposal.update({
        where: { id: parseInt(id) },
        data: {
          judul,
          abstrak,
          kata_kunci,
          dana_diusulkan
        },
        include: {
          skema: true,
          ketua: { select: { id: true, nama: true } }
        }
      });

      sendResponse(res, 'Proposal berhasil diperbarui', { proposal: updated });
    } catch (error) {
      console.error('Update proposal error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // UPDATE STATUS
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, komentar, skor_akhir } = req.body;

      if (!['ADMIN', 'REVIEWER'].includes(req.user.role)) {
        return sendError(res, 'Akses ditolak', 403);
      }

      const validStatuses = ['DRAFT', 'SUBMITTED', 'REVIEW', 'APPROVED', 'REJECTED', 'REVISION', 'COMPLETED'];
      if (!validStatuses.includes(status)) {
        return sendError(res, `Status tidak valid. Gunakan: ${validStatuses.join(', ')}`, 400);
      }

      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(id) }
      });

      if (!proposal) return sendError(res, 'Proposal tidak ditemukan', 404);

      if (req.user.role === 'REVIEWER' && proposal.reviewerId !== req.user.id) {
        return sendError(res, 'Anda bukan reviewer untuk proposal ini', 403);
      }

      const updated = await prisma.proposal.update({
        where: { id: parseInt(id) },
        data: {
          status,
          catatan_reviewer: komentar || null,
          tanggal_review: new Date(),
          skor_akhir: skor_akhir ? parseFloat(skor_akhir) : null
        }
      });

      sendResponse(res, 'Status proposal berhasil diperbarui', { proposal: updated });
    } catch (error) {
      console.error('Update status error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // SUBMIT
submit: async (req, res) => {
  try {
    const { id } = req.params;

    const proposal = await prisma.proposal.findUnique({
      where: { id: parseInt(id) },
      include: { documents: true, members: true }
    });

    if (!proposal) return sendError(res, 'Proposal tidak ditemukan', 404);

    const allowedRoles = ['ADMIN', 'DOSEN', 'MAHASISWA'];
    const isAllowedRole = allowedRoles.includes(req.user.role);
    const isInvolved = 
      proposal.ketuaId === req.user.id || 
      proposal.members.some(m => m.userId === req.user.id);

    if (!(isAllowedRole && isInvolved)) {
      return sendError(res, 'Akses ditolak', 403);
    }

    if (proposal.status !== 'DRAFT') {
      return sendError(res, 'Proposal sudah diajukan sebelumnya', 400);
    }

    const updated = await prisma.proposal.update({
      where: { id: parseInt(id) },
      data: {
        status: 'SUBMITTED',
        tanggal_submit: new Date()
      }
    });

    sendResponse(res, 'Proposal berhasil diajukan', { proposal: updated });
  } catch (error) {
    console.error('Submit proposal error:', error);
    sendError(res, 'Terjadi kesalahan server', 500);
  }
},

  // DELETE
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(id) },
        include: { members: true }
      });

      if (!proposal) return sendError(res, 'Proposal tidak ditemukan', 404);

      const canDelete =
        req.user.role === 'ADMIN' ||
        proposal.ketuaId === req.user.id;

      if (!canDelete) return sendError(res, 'Akses ditolak', 403);

      if (['APPROVED', 'REJECTED'].includes(proposal.status) && req.user.role !== 'ADMIN') {
        return sendError(res, 'Proposal sudah direview, tidak dapat dihapus', 400);
      }

      await prisma.proposal.delete({
        where: { id: parseInt(id) }
      });

      sendResponse(res, 'Proposal berhasil dihapus');
    } catch (error) {
      console.error('Delete proposal error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  }
};

module.exports = proposalController;
