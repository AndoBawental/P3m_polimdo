//server/controllers/skema.controller.js
const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/response');

const prisma = new PrismaClient();

// Get all skema with pagination and filtering
const getAllSkema = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation error', 400, errors.array());
    }

    const { page = 1, limit = 10, tahun_aktif, kategori, status = 'AKTIF' } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      status: status
    };

    if (tahun_aktif) {
      where.tahun_aktif = tahun_aktif;
    }

    if (kategori) {
      where.kategori = kategori;
    }

    const [skemas, total] = await Promise.all([
      prisma.skema.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { proposals: true }
          }
        }
      }),
      prisma.skema.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(res, 'Skema retrieved successfully', {
      skemas,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all skema error:', error);
    return errorResponse(res, 'Failed to retrieve skema', 500);
  }
};

// Get skema by ID
const getSkemaById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation error', 400, errors.array());
    }

    const { id } = req.params;

    const skema = await prisma.skema.findUnique({
      where: { id: parseInt(id) },
      include: {
        proposals: {
          select: {
            id: true,
            judul: true,
            status: true,
            ketua: {
              select: { nama: true, email: true }
            }
          }
        },
        _count: {
          select: { proposals: true }
        }
      }
    });

    if (!skema) {
      return errorResponse(res, 'Skema not found', 404);
    }

    return successResponse(res, 'Skema retrieved successfully', skema);
  } catch (error) {
    console.error('Get skema by ID error:', error);
    return errorResponse(res, 'Failed to retrieve skema', 500);
  }
};

// Get active skema (for public access)
const getActiveSkema = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const skemas = await prisma.skema.findMany({
      where: {
        status: 'AKTIF',
        tanggal_buka: { lte: currentDate },
        tanggal_tutup: { gte: currentDate }
      },
      select: {
        id: true,
        kode: true,
        nama: true,
        kategori: true,
        luaran_wajib: true, // TAMBAHKAN INI
        dana_min: true,
        dana_max: true,
        batas_anggota: true,
        tahun_aktif: true,
        tanggal_buka: true,
        tanggal_tutup: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return successResponse(res, 'Active skema retrieved successfully', skemas);
  } catch (error) {
    console.error('Get active skema error:', error);
    return errorResponse(res, 'Failed to retrieve active skema', 500);
  }
};

// Get skema statistics
const getSkemaStats = async (req, res) => {
  try {
    const [total, active, byCategory, byYear] = await Promise.all([
      prisma.skema.count(),
      prisma.skema.count({ where: { status: 'AKTIF' } }),
      prisma.skema.groupBy({
        by: ['kategori'],
        _count: { kategori: true }
      }),
      prisma.skema.groupBy({
        by: ['tahun_aktif'],
        _count: { tahun_aktif: true },
        orderBy: { tahun_aktif: 'desc' }
      })
    ]);

    return successResponse(res, 'Skema statistics retrieved successfully', {
      total,
      active,
      byCategory,
      byYear
    });
  } catch (error) {
    console.error('Get skema stats error:', error);
    return errorResponse(res, 'Failed to retrieve skema statistics', 500);
  }
};

// Create new skema (Admin only)
const createSkema = async (req, res) => {
  try {
    const {
      kode,
      nama,
      kategori,
      luaran_wajib,
      dana_min,
      dana_max,
      batas_anggota = 5,
      tahun_aktif,
      tanggal_buka,
      tanggal_tutup
    } = req.body;

    // Check if kode already exists
    const existingSkema = await prisma.skema.findUnique({
      where: { kode }
    });

    if (existingSkema) {
      return errorResponse(res, 'Kode skema already exists', 400);
    }

    const skema = await prisma.skema.create({
      data: {
        kode,
        nama,
        kategori,
        luaran_wajib,
        dana_min: dana_min ? parseFloat(dana_min) : null,
        dana_max: dana_max ? parseFloat(dana_max) : null,
           batas_anggota: batas_anggota ? parseInt(batas_anggota) : 5,
        tahun_aktif,
        tanggal_buka: tanggal_buka ? new Date(tanggal_buka) : null,
        tanggal_tutup: tanggal_tutup ? new Date(tanggal_tutup) : null
      }
    });

    return successResponse(res, 'Skema created successfully', skema, 201);
  } catch (error) {
    console.error('Create skema error:', error);
    return errorResponse(res, 'Failed to create skema', 500);
  }
};

// Update skema (Admin only)
const updateSkema = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation error', 400, errors.array());
    }

    const { id } = req.params;
    const {
      kode,
      nama,
      kategori,
      luaran_wajib,
      dana_min,
      dana_max,
      batas_anggota,
      tahun_aktif,
      tanggal_buka,
      tanggal_tutup,
      status
    } = req.body;

    // Check if skema exists
    const existingSkema = await prisma.skema.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingSkema) {
      return errorResponse(res, 'Skema not found', 404);
    }

    // Check if kode already exists (exclude current skema)
    if (kode && kode !== existingSkema.kode) {
      const duplicateKode = await prisma.skema.findUnique({
        where: { kode }
      });

      if (duplicateKode) {
        return errorResponse(res, 'Kode skema already exists', 400);
      }
    }

    const updateData = {};
    if (kode) updateData.kode = kode;
    if (nama) updateData.nama = nama;
    if (kategori) updateData.kategori = kategori;
    if (luaran_wajib !== undefined) updateData.luaran_wajib = luaran_wajib;
    if (dana_min !== undefined) updateData.dana_min = dana_min ? parseFloat(dana_min) : null;
    if (dana_max !== undefined) updateData.dana_max = dana_max ? parseFloat(dana_max) : null;
    if (batas_anggota !== undefined) {
      updateData.batas_anggota = batas_anggota ? parseInt(batas_anggota) : 5;
    }
    if (tahun_aktif) updateData.tahun_aktif = tahun_aktif;
    if (tanggal_buka !== undefined) updateData.tanggal_buka = tanggal_buka ? new Date(tanggal_buka) : null;
    if (tanggal_tutup !== undefined) updateData.tanggal_tutup = tanggal_tutup ? new Date(tanggal_tutup) : null;
    if (status) updateData.status = status;

    const skema = await prisma.skema.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return successResponse(res, 'Skema updated successfully', skema);
  } catch (error) {
    console.error('Update skema error:', error);
    return errorResponse(res, 'Failed to update skema', 500);
  }
};

// Delete skema (Admin only)
const deleteSkema = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation error', 400, errors.array());
    }

    const { id } = req.params;

    // Check if skema exists
    const existingSkema = await prisma.skema.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { proposals: true }
        }
      }
    });

    if (!existingSkema) {
      return errorResponse(res, 'Skema not found', 404);
    }

    // Check if skema has proposals
    if (existingSkema._count.proposals > 0) {
      return errorResponse(res, 'Cannot delete skema that has proposals', 400);
    }

    await prisma.skema.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(res, 'Skema deleted successfully');
  } catch (error) {
    console.error('Delete skema error:', error);
    return errorResponse(res, 'Failed to delete skema', 500);
  }
};

module.exports = {
  getAllSkema,
  getSkemaById,
  getActiveSkema,
  getSkemaStats,
  createSkema,
  updateSkema,
  deleteSkema
};