// server/controllers/skemaController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

// Fungsi bantu normalize input kategori ke enum Prisma
function normalizeKategori(input) {
  if (!input) return undefined;
  const mapKategori = {
    'penelitian': 'PENELITIAN',
    'pengabdian': 'PENGABDIAN',
    'semua kategori': undefined,
  };
  return mapKategori[input.toLowerCase()] || undefined;
}

// Fungsi bantu normalize input status ke enum Prisma
function normalizeStatus(input) {
  if (!input) return undefined;
  const mapStatus = {
    'aktif': 'AKTIF',
    'nonaktif': 'NONAKTIF',
    'semua status': undefined,
  };
  return mapStatus[input.toLowerCase()] || undefined;
}

class SkemaController {
  // Get all skema with filters
  async getAllSkema(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        kategori, 
        status, 
        search,
        tahun_aktif 
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      // Build where clause dinamis
      const where = {};

      // Normalisasi kategori dan status sesuai enum Prisma
      const kategoriEnum = normalizeKategori(kategori);
      if (kategoriEnum) {
        where.kategori = kategoriEnum;
      }

      const statusEnum = normalizeStatus(status);
      if (statusEnum) {
        where.status = statusEnum;
      }

      if (tahun_aktif) {
        where.tahun_aktif = tahun_aktif;
      }

      if (search) {
        where.OR = [
          { nama: { contains: search, mode: 'insensitive' } },
          { kode: { contains: search, mode: 'insensitive' } }
        ];
      }

      // Query data dengan pagination dan count total
      const [skemas, total] = await Promise.all([
        prisma.skema.findMany({
          where,
          skip,
          take,
          include: {
            proposals: {
              select: {
                id: true,
                status: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.skema.count({ where })
      ]);

      // Hitung statistik proposal per skema
      const skemasWithStats = skemas.map(skema => ({
        ...skema,
        totalProposal: skema.proposals.length,
        approvedProposal: skema.proposals.filter(p => p.status === 'APPROVED').length,
        activeProposal: skema.proposals.filter(p => ['SUBMITTED', 'REVIEW'].includes(p.status)).length
      }));

      const totalPages = Math.ceil(total / take);

      return sendPaginated(res, 'Skema retrieved successfully', skemasWithStats, {
        page: parseInt(page),
        limit: take,
        total,
        totalPages
      });

    } catch (error) {
      console.error('Error getting skema:', error);
      return sendError(res, 'Failed to retrieve skema', 500);
    }
  }

  // Get skema by ID
  async getSkemaById(req, res) {
    try {
      const { id } = req.params;
      
      // Validasi ID harus numerik
      if (isNaN(parseInt(id))) {
        return sendError(res, 'ID skema harus berupa angka', 400);
      }

      const skema = await prisma.skema.findUnique({
        where: { id: parseInt(id) },
        include: {
          proposals: {
            include: {
              ketua: {
                select: { id: true, nama: true, email: true }
              }
            }
          }
        }
      });

      if (!skema) {
        return sendError(res, 'Skema tidak ditemukan', 404);
      }

      return sendSuccess(res, skema, 'Detail skema berhasil diambil');

    } catch (error) {
      console.error('Error getting skema by ID:', error);
      return sendError(res, 'Terjadi kesalahan saat mengambil data skema', 500);
    }
  }

  // Create new skema
  async createSkema(req, res) {
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
        tanggal_tutup,
        status = 'AKTIF'
      } = req.body;

      // Validasi field wajib
      if (!kode || !nama || !kategori || !tahun_aktif) {
        return sendError(res, 'Kode, nama, kategori, dan tahun aktif wajib diisi', 400);
      }

      // Normalisasi kategori - hanya PENELITIAN dan PENGABDIAN
      let kategoriEnum;
      const kategoriUpper = kategori.toUpperCase();
      
      if (kategoriUpper === 'PENELITIAN' || kategoriUpper === 'PENGABDIAN') {
        kategoriEnum = kategoriUpper;
      } else {
        return sendError(res, `Kategori tidak valid. Harus PENELITIAN atau PENGABDIAN`, 400);
      }

      // Normalisasi status
      let statusEnum = 'AKTIF';
      if (status) {
        const statusUpper = status.toUpperCase();
        if (statusUpper === 'AKTIF' || statusUpper === 'NONAKTIF') {
          statusEnum = statusUpper;
        }
      }

      // Cek kode unik
      const existingSkema = await prisma.skema.findUnique({
        where: { kode }
      });

      if (existingSkema) {
        return sendError(res, 'Kode skema sudah digunakan', 400);
      }

      // Validasi range dana
      if (dana_min && dana_max && parseFloat(dana_min) > parseFloat(dana_max)) {
        return sendError(res, 'Dana minimum tidak boleh lebih besar dari dana maksimum', 400);
      }

      // Validasi tanggal
      if (tanggal_buka && tanggal_tutup && new Date(tanggal_buka) > new Date(tanggal_tutup)) {
        return sendError(res, 'Tanggal buka tidak boleh lebih besar dari tanggal tutup', 400);
      }

      // Konversi tahun_aktif ke string
      const tahunAktifString = tahun_aktif.toString();

      const skema = await prisma.skema.create({
        data: {
          kode,
          nama,
          kategori: kategoriEnum,
          luaran_wajib: luaran_wajib || null,
          dana_min: dana_min ? parseFloat(dana_min) : null,
          dana_max: dana_max ? parseFloat(dana_max) : null,
          batas_anggota: parseInt(batas_anggota),
          tahun_aktif: tahunAktifString,
          tanggal_buka: tanggal_buka ? new Date(tanggal_buka) : null,
          tanggal_tutup: tanggal_tutup ? new Date(tanggal_tutup) : null,
          status: statusEnum
        }
      });

      return sendSuccess(res, skema, 'Skema berhasil dibuat', 201);

    } catch (error) {
      console.error('Error creating skema:', error);
      
      // Handle error spesifik Prisma
      if (error.code === 'P2002') {
        return sendError(res, 'Kode skema sudah digunakan', 400);
      }
      
      return sendError(res, `Gagal membuat skema: ${error.message}`, 500);
    }
  }

  // Update skema
  async updateSkema(req, res) {
    try {
      const { id } = req.params;
      
      // Validasi ID harus numerik
      if (isNaN(parseInt(id))) {
        return sendError(res, 'ID skema harus berupa angka', 400);
      }

      const updateData = req.body;

      // Cek skema exist
      const existingSkema = await prisma.skema.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingSkema) {
        return sendError(res, 'Skema tidak ditemukan', 404);
      }

      // Normalisasi kategori - hanya PENELITIAN dan PENGABDIAN
      if (updateData.kategori) {
        const kategoriUpper = updateData.kategori.toUpperCase();
        if (kategoriUpper === 'PENELITIAN' || kategoriUpper === 'PENGABDIAN') {
          updateData.kategori = kategoriUpper;
        } else {
          return sendError(res, 'Kategori tidak valid. Harus PENELITIAN atau PENGABDIAN', 400);
        }
      }

      // Normalisasi status
      if (updateData.status) {
        const statusUpper = updateData.status.toUpperCase();
        if (statusUpper === 'AKTIF' || statusUpper === 'NONAKTIF') {
          updateData.status = statusUpper;
        } else {
          return sendError(res, 'Status tidak valid', 400);
        }
      }

      // Cek kode unik jika diupdate
      if (updateData.kode && updateData.kode !== existingSkema.kode) {
        const skemaWithSameKode = await prisma.skema.findUnique({
          where: { kode: updateData.kode }
        });

        if (skemaWithSameKode) {
          return sendError(res, 'Kode skema sudah digunakan', 400);
        }
      }

      // Validasi range dana
      const dana_min = updateData.dana_min ?? existingSkema.dana_min;
      const dana_max = updateData.dana_max ?? existingSkema.dana_max;
      
      if (dana_min && dana_max && parseFloat(dana_min) > parseFloat(dana_max)) {
        return sendError(res, 'Dana minimum tidak boleh lebih besar dari dana maksimum', 400);
      }

      // Validasi tanggal
      const tanggal_buka = updateData.tanggal_buka ?? existingSkema.tanggal_buka;
      const tanggal_tutup = updateData.tanggal_tutup ?? existingSkema.tanggal_tutup;
      
      if (tanggal_buka && tanggal_tutup && new Date(tanggal_buka) > new Date(tanggal_tutup)) {
        return sendError(res, 'Tanggal buka tidak boleh lebih besar dari tanggal tutup', 400);
      }

      // Parse tipe data
      if (updateData.dana_min) updateData.dana_min = parseFloat(updateData.dana_min);
      if (updateData.dana_max) updateData.dana_max = parseFloat(updateData.dana_max);
      if (updateData.batas_anggota != null) updateData.batas_anggota = parseInt(updateData.batas_anggota);
      if (updateData.tanggal_buka) updateData.tanggal_buka = new Date(updateData.tanggal_buka);
      if (updateData.tanggal_tutup) updateData.tanggal_tutup = new Date(updateData.tanggal_tutup);

      const skema = await prisma.skema.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      return sendSuccess(res, skema, 'Skema berhasil diperbarui');

    } catch (error) {
      console.error('Error updating skema:', error);
      return sendError(res, 'Gagal memperbarui skema', 500);
    }
  }

  // Delete skema
  async deleteSkema(req, res) {
    try {
      const { id } = req.params;
      
      // Validasi ID
      if (isNaN(parseInt(id))) {
        return sendError(res, 'ID skema harus berupa angka', 400);
      }

      // Cek skema exist
      const skema = await prisma.skema.findUnique({
        where: { id: parseInt(id) },
        include: {
          proposals: true
        }
      });

      if (!skema) {
        return sendError(res, 'Skema tidak ditemukan', 404);
      }

      // Cek proposal terkait
      if (skema.proposals.length > 0) {
        return sendError(res, 'Tidak dapat menghapus skema yang memiliki proposal', 400);
      }

      await prisma.skema.delete({
        where: { id: parseInt(id) }
      });

      return sendSuccess(res, 'Skema berhasil dihapus', null);

    } catch (error) {
      console.error('Error deleting skema:', error);
      return sendError(res, 'Gagal menghapus skema', 500);
    }
  }

  // Get skema statistics
  async getSkemaStats(req, res) {
    try {
      const stats = await prisma.skema.groupBy({
        by: ['kategori', 'status'],
        _count: {
          id: true
        }
      });

      const totalSkema = await prisma.skema.count();
      const activeSkema = await prisma.skema.count({
        where: { status: 'AKTIF' }
      });

      const formattedStats = {
        total: totalSkema,
        active: activeSkema,
        inactive: totalSkema - activeSkema,
        byKategori: stats.reduce((acc, item) => {
          if (!acc[item.kategori]) acc[item.kategori] = 0;
          acc[item.kategori] += item._count.id;
          return acc;
        }, {})
      };

      return sendSuccess(res, formattedStats, 'Skema statistics retrieved successfully');

    } catch (error) {
      console.error('Error getting skema stats:', error);
      return sendError(res, 'Failed to retrieve skema statistics', 500);
    }
  }

  // Get active skema
  async getActiveSkema(req, res) {
    try {
      const skemas = await prisma.skema.findMany({
        where: { 
          status: 'AKTIF',
          OR: [
            { tanggal_tutup: null },
            { tanggal_tutup: { gte: new Date() } }
          ]
        },
        orderBy: { nama: 'asc' }
      });

      return sendSuccess(res, skemas, 'Active skema retrieved successfully');

    } catch (error) {
      console.error('Error getting active skema:', error);
      return sendError(res, 'Failed to retrieve active skema', 500);
    }
  }
}

module.exports = new SkemaController();