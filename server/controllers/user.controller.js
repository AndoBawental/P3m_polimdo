const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { sendResponse, sendError } = require('../utils/response');
const { USER_STATUS, USER_ROLES } = require('../utils/constants');

const userController = {
  // Get all users with pagination and filtering
  getAll: async (req, res) => {
    try {
      const { role, status, search, page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (role && Object.values(USER_ROLES).includes(role)) {
        where.role = role;
      }
      if (status && Object.values(USER_STATUS).includes(status)) {
        where.status = status;
      }
      if (search) {
        where.OR = [
          { nama: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { nip: { contains: search, mode: 'insensitive' } },
          { nim: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            nip: true,
            nim: true,
            nama: true,
            email: true,
            role: true,
            no_telp: true,
            bidang_keahlian: true,
            status: true,
            createdAt: true,
            jurusan: {
              select: {
                id: true,
                nama: true
              }
            },
            prodi: {
              select: {
                id: true,
                nama: true
              }
            },
            _count: {
              select: {
                proposals: true,
                reviewedProposals: true,
                reviews: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: parseInt(limit)
        }),
        prisma.user.count({ where })
      ]);

      sendResponse(res, 'Berhasil mendapatkan data users', {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Get users error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Fungsi getTeamMembers yang diperbaiki
  getTeamMembers: async (req, res) => {
    try {
      const currentUserId = req.user.id;

      const users = await prisma.user.findMany({
        where: {
          status: USER_STATUS.AKTIF,
          role: {
            in: [USER_ROLES.DOSEN, USER_ROLES.MAHASISWA]
          },
          id: {
            not: currentUserId
          }
        },
        select: {
          id: true,
          nama: true,
          email: true,
          role: true,
          nip: true,
          nim: true,
          bidang_keahlian: true,
          no_telp: true,
          jurusan: {
            select: {
              id: true,
              nama: true
            }
          },
          prodi: {
            select: {
              id: true,
              nama: true
            }
          }
        },
        orderBy: [
          { role: 'asc' },
          { nama: 'asc' }
        ]
      });

      sendResponse(res, 'Berhasil mendapatkan anggota tim', { users });

    } catch (error) {
      console.error('Get team members error:', error);
      sendError(res, 'Gagal mengambil anggota tim', 500);
    }
  },

  // Get user by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'ID user tidak boleh kosong', 400);
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        return sendError(res, 'ID user tidak valid', 400);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nip: true,
          nim: true,
          nama: true,
          email: true,
          role: true,
          no_telp: true,
          bidang_keahlian: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          jurusan: {
            select: {
              id: true,
              nama: true
            }
          },
          prodi: {
            select: {
              id: true,
              nama: true
            }
          }
        }
      });

      if (!user) {
        return sendError(res, 'User tidak ditemukan', 404);
      }

      sendResponse(res, 'Berhasil mendapatkan data user', { user });

    } catch (error) {
      console.error('Get user by ID error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Create new user
  create: async (req, res) => {
    try {
      const {
        nip,
        nim,
        nama,
        email,
        password,
        role,
        no_telp,
        bidang_keahlian,
        jurusanId,
        prodiId
      } = req.body;

      if (!Object.values(USER_ROLES).includes(role)) {
        return sendError(res, 'Role tidak valid', 400);
      }

      if (role === USER_ROLES.MAHASISWA && !nim) {
        return sendError(res, 'NIM wajib diisi untuk mahasiswa', 400);
      }

      if ((role === USER_ROLES.DOSEN || role === USER_ROLES.REVIEWER) && !nip) {
        return sendError(res, 'NIP wajib diisi untuk dosen/reviewer', 400);
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            nip ? { nip } : {},
            nim ? { nim } : {}
          ].filter(condition => Object.keys(condition).length > 0)
        }
      });

      if (existingUser) {
        return sendError(res, 'Email, NIP, atau NIM sudah terdaftar', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          nip: role === USER_ROLES.MAHASISWA ? null : nip,
          nim: role === USER_ROLES.MAHASISWA ? nim : null,
          nama,
          email,
          password: hashedPassword,
          role,
          no_telp,
          bidang_keahlian,
          jurusanId: jurusanId || null,
          prodiId: prodiId || null
        },
        select: {
          id: true,
          nip: true,
          nim: true,
          nama: true,
          email: true,
          role: true,
          no_telp: true,
          bidang_keahlian: true,
          status: true,
          createdAt: true,
          jurusan: {
            select: {
              id: true,
              nama: true
            }
          },
          prodi: {
            select: {
              id: true,
              nama: true
            }
          }
        }
      });

      sendResponse(res, 'User berhasil dibuat', { user }, 201);

    } catch (error) {
      console.error('Create user error:', error);
      if (error.code === 'P2002') {
        return sendError(res, 'Email, NIP, atau NIM sudah digunakan', 409);
      }
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Update user
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        nip,
        nim,
        nama,
        email,
        role,
        no_telp,
        bidang_keahlian,
        jurusanId,
        prodiId,
        password
      } = req.body;

      if (!id) {
        return sendError(res, 'ID user tidak boleh kosong', 400);
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        return sendError(res, 'ID user tidak valid', 400);
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        return sendError(res, 'User tidak ditemukan', 404);
      }

      const updateData = {
        nama,
        email,
        no_telp,
        bidang_keahlian,
        jurusanId: jurusanId || null,
        prodiId: prodiId || null
      };

      if (role && Object.values(USER_ROLES).includes(role)) {
        updateData.role = role;
        updateData.nip = role === USER_ROLES.MAHASISWA ? null : nip;
        updateData.nim = role === USER_ROLES.MAHASISWA ? nim : null;
      }

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          nip: true,
          nim: true,
          nama: true,
          email: true,
          role: true,
          no_telp: true,
          bidang_keahlian: true,
          status: true,
          updatedAt: true,
          jurusan: {
            select: {
              id: true,
              nama: true
            }
          },
          prodi: {
            select: {
              id: true,
              nama: true
            }
          }
        }
      });

      sendResponse(res, 'User berhasil diperbarui', { user });

    } catch (error) {
      console.error('Update user error:', error);
      if (error.code === 'P2002') {
        return sendError(res, 'Email, NIP, atau NIM sudah digunakan', 409);
      }
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Update user status
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        return sendError(res, 'ID user tidak boleh kosong', 400);
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        return sendError(res, 'ID user tidak valid', 400);
      }

      if (!Object.values(USER_STATUS).includes(status)) {
        return sendError(res, 'Status tidak valid', 400);
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: { status },
        select: {
          id: true,
          nama: true,
          email: true,
          status: true
        }
      });

      sendResponse(res, 'Status user berhasil diperbarui', { user });

    } catch (error) {
      console.error('Update user status error:', error);
      if (error.code === 'P2025') {
        return sendError(res, 'User tidak ditemukan', 404);
      }
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Delete user
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return sendError(res, 'ID user tidak boleh kosong', 400);
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        return sendError(res, 'ID user tidak valid', 400);
      }

      const userWithRelations = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          proposals: true,
          reviewedProposals: true,
          reviews: true
        }
      });

      if (!userWithRelations) {
        return sendError(res, 'User tidak ditemukan', 404);
      }

      if (userWithRelations.proposals.length > 0 || 
          userWithRelations.reviewedProposals.length > 0 || 
          userWithRelations.reviews.length > 0) {
        return sendError(res, 'User tidak dapat dihapus karena masih memiliki data terkait', 400);
      }

      await prisma.user.delete({
        where: { id: userId }
      });

      sendResponse(res, 'User berhasil dihapus');

    } catch (error) {
      console.error('Delete user error:', error);
      if (error.code === 'P2025') {
        return sendError(res, 'User tidak ditemukan', 404);
      }
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Get user statistics
  getUserStats: async (req, res) => {
    try {
      const total = await prisma.user.count();
      const active = await prisma.user.count({
        where: { status: USER_STATUS.AKTIF }
      });
      const inactive = await prisma.user.count({
        where: { status: USER_STATUS.NONAKTIF }
      });

      sendResponse(res, 'Berhasil mendapatkan statistik pengguna', {
        totalUsers: total,
        activeUsers: active,
        inactiveUsers: inactive
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Get reviewers
  getReviewers: async (req, res) => {
    try {
      const reviewers = await prisma.user.findMany({
        where: {
          role: USER_ROLES.REVIEWER,
          status: USER_STATUS.AKTIF
        },
        select: {
          id: true,
          nama: true,
          email: true,
          bidang_keahlian: true,
          _count: {
            select: { reviewedProposals: true }
          }
        },
        orderBy: { nama: 'asc' }
      });

      sendResponse(res, 'Berhasil mendapatkan data reviewer', { reviewers });

    } catch (error) {
      console.error('Get reviewers error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Get profile
  getProfile: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          nip: true,
          nim: true,
          nama: true,
          email: true,
          role: true,
          no_telp: true,
          bidang_keahlian: true,
          status: true,
          jurusan: {
            select: {
              id: true,
              nama: true
            }
          },
          prodi: {
            select: {
              id: true,
              nama: true
            }
          }
        }
      });

      sendResponse(res, 'Berhasil mendapatkan profil', { user });

    } catch (error) {
      console.error('Get profile error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  },

  // Update profile
  updateProfile: async (req, res) => {
    try {
      const {
        nama,
        no_telp,
        bidang_keahlian,
        jurusanId,
        prodiId,
        password
      } = req.body;

      const updateData = {
        nama,
        no_telp,
        bidang_keahlian,
        jurusanId: jurusanId || null,
        prodiId: prodiId || null
      };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: updateData,
        select: {
          id: true,
          nip: true,
          nim: true,
          nama: true,
          email: true,
          role: true,
          no_telp: true,
          bidang_keahlian: true,
          jurusan: {
            select: {
              id: true,
              nama: true
            }
          },
          prodi: {
            select: {
              id: true,
              nama: true
            }
          }
        }
      });

      sendResponse(res, 'Profil berhasil diperbarui', { user });

    } catch (error) {
      console.error('Update profile error:', error);
      sendError(res, 'Terjadi kesalahan server', 500);
    }
  }
};

module.exports = userController;