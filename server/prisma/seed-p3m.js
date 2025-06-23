const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Mulai seeding data...');
  
  // Hash password default untuk semua user
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const dosenPassword = await bcrypt.hash('dosen123', saltRounds);
  const mhsPassword = await bcrypt.hash('mhs123', saltRounds);
  const reviewerPassword = await bcrypt.hash('reviewer123', saltRounds);

  // ==================== CREATE JURUSAN ====================
  const jurusanData = [
    { nama: 'Teknik Sipil' },
    { nama: 'Teknik Elektro' },
    { nama: 'Teknik Mesin' },
    { nama: 'Akuntansi' },
    { nama: 'Administrasi Bisnis' },
    { nama: 'Pariwisata' }
  ];

  console.log('🔧 Membuat jurusan...');
  const createdJurusan = {};
  for (const jurusan of jurusanData) {
    const created = await prisma.jurusan.create({
      data: jurusan
    });
    createdJurusan[jurusan.nama] = created;
    console.log(`   ✅ Jurusan "${jurusan.nama}" dibuat (ID: ${created.id})`);
  }

  // ==================== CREATE PRODI ====================
  const prodiData = [
    { nama: 'Teknologi Rekayasa Perawatan dan Restorasi Bangunan Gedung', jurusanId: createdJurusan['Teknik Sipil'].id },
    { nama: 'Konstruksi Bangunan Gedung', jurusanId: createdJurusan['Teknik Sipil'].id },
    { nama: 'Teknik Jalan Jembatan', jurusanId: createdJurusan['Teknik Sipil'].id },
    { nama: 'D3 Teknik Sipil', jurusanId: createdJurusan['Teknik Sipil'].id },
    
    { nama: 'Teknik Listrik', jurusanId: createdJurusan['Teknik Elektro'].id },
    { nama: 'Teknik Informatika', jurusanId: createdJurusan['Teknik Elektro'].id },
    { nama: 'D3 Teknik Listrik', jurusanId: createdJurusan['Teknik Elektro'].id },
    { nama: 'D3 Teknik Komputer', jurusanId: createdJurusan['Teknik Elektro'].id },
    
    { nama: 'Teknik Mesin Produksi dan Perawatan', jurusanId: createdJurusan['Teknik Mesin'].id },
    { nama: 'Teknologi Rekayasa Mekatronika', jurusanId: createdJurusan['Teknik Mesin'].id },
    
    { nama: 'Akuntansi Keuangan', jurusanId: createdJurusan['Akuntansi'].id },
    { nama: 'Akuntansi Perpajakan', jurusanId: createdJurusan['Akuntansi'].id },
    { nama: 'D3 Akuntansi', jurusanId: createdJurusan['Akuntansi'].id },
    
    { nama: 'Manajemen Bisnis', jurusanId: createdJurusan['Administrasi Bisnis'].id },
    { nama: 'D3 Administrasi Bisnis', jurusanId: createdJurusan['Administrasi Bisnis'].id },
    { nama: 'D3 Manajemen Pemasaran', jurusanId: createdJurusan['Administrasi Bisnis'].id },
    
    { nama: 'Perhotelan', jurusanId: createdJurusan['Pariwisata'].id },
    { nama: 'Manjemen Pariwisata Global', jurusanId: createdJurusan['Pariwisata'].id },
    { nama: 'D3 Pariwisata', jurusanId: createdJurusan['Pariwisata'].id },
    { nama: 'D3 Usaha Perjalan Wisata', jurusanId: createdJurusan['Pariwisata'].id },
    { nama: 'D3 Ekowisata Bawah Laut', jurusanId: createdJurusan['Pariwisata'].id }
  ];

  console.log('🔧 Membuat prodi...');
  const createdProdi = {};
  for (const prodi of prodiData) {
    const created = await prisma.prodi.create({
      data: prodi
    });
    createdProdi[prodi.nama] = created;
    console.log(`   ✅ Prodi "${prodi.nama}" dibuat (ID: ${created.id})`);
  }

  // ==================== CREATE USERS ====================
  console.log('👥 Membuat user...');
  
  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      nip: 'ADM0000000000000001',
      nama: 'Admin Sistem P3M',
      email: 'admin.p3m@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
      no_telp: '081234567890',
      status: 'AKTIF',
    },
  });
  console.log(`   ✅ Admin "${admin.nama}" dibuat (ID: ${admin.id})`);

  // 2. Dosen
  const dosen1 = await prisma.user.create({
    data: {
      nip: 'DSN0000000000000001',
      nama: 'Dr. Andi Wijaya, M.Kom',
      email: 'andi.wijaya@gmail.com',
      password: dosenPassword,
      role: 'DOSEN',
      no_telp: '081234567891',
      bidang_keahlian: 'Artificial Intelligence, Machine Learning',
      jurusanId: createdJurusan['Teknik Elektro'].id,
      prodiId: createdProdi['Teknik Informatika'].id,
      status: 'AKTIF',
    },
  });
  console.log(`   ✅ Dosen "${dosen1.nama}" dibuat (ID: ${dosen1.id})`);

  const dosen2 = await prisma.user.create({
    data: {
      nip: 'DSN0000000000000002',
      nama: 'Dr. Sari Melati, M.T',
      email: 'sari.melati@gmail.com',
      password: dosenPassword,
      role: 'DOSEN',
      no_telp: '081234567892',
      bidang_keahlian: 'Software Engineering, Database Systems',
      jurusanId: createdJurusan['Akuntansi'].id,
      prodiId: createdProdi['Akuntansi Keuangan'].id,
      status: 'AKTIF',
    },
  });
  console.log(`   ✅ Dosen "${dosen2.nama}" dibuat (ID: ${dosen2.id})`);

  // 3. Mahasiswa
  const mahasiswa1 = await prisma.user.create({
    data: {
      nim: '2021001',
      nama: 'Budi Santoso',
      email: 'budi.santoso@gmail.com',
      password: mhsPassword,
      role: 'MAHASISWA',
      no_telp: '081234567893',
      jurusanId: createdJurusan['Teknik Elektro'].id,
      prodiId: createdProdi['D3 Teknik Komputer'].id,
      status: 'AKTIF',
    },
  });
  console.log(`   ✅ Mahasiswa "${mahasiswa1.nama}" dibuat (ID: ${mahasiswa1.id})`);

  const mahasiswa2 = await prisma.user.create({
    data: {
      nim: '2021002',
      nama: 'Dewi Lestari',
      email: 'dewi.lestari@gmail.com',
      password: mhsPassword,
      role: 'MAHASISWA',
      no_telp: '081234567894',
      jurusanId: createdJurusan['Pariwisata'].id,
      prodiId: createdProdi['D3 Ekowisata Bawah Laut'].id,
      status: 'AKTIF',
    },
  });
  console.log(`   ✅ Mahasiswa "${mahasiswa2.nama}" dibuat (ID: ${mahasiswa2.id})`);

  // 4. Reviewer
  const reviewer1 = await prisma.user.create({
    data: {
      nip: 'REV0000000000000001',
      nama: 'Prof. Dr. Ahmad Rahman, M.Sc',
      email: 'ahmad.rahman@gmail.com',
      password: reviewerPassword,
      role: 'REVIEWER',
      no_telp: '081234567895',
      bidang_keahlian: 'Computer Vision, Deep Learning',
      status: 'AKTIF',
    },
  });
  console.log(`   ✅ Reviewer "${reviewer1.nama}" dibuat (ID: ${reviewer1.id})`);

  const reviewer2 = await prisma.user.create({
    data: {
      nip: 'REV0000000000000002',
      nama: 'Dr. Rina Sari, M.Kom',
      email: 'rina.sari@gmail.com',
      password: reviewerPassword,
      role: 'REVIEWER',
      no_telp: '081234567896',
      bidang_keahlian: 'Information Systems, Data Mining',
      status: 'AKTIF',
    },
  });
  console.log(`   ✅ Reviewer "${reviewer2.nama}" dibuat (ID: ${reviewer2.id})`);

  // ==================== CREATE SKEMA ====================
  console.log('📋 Membuat skema...');
  
  const skemaPenelitian = await prisma.skema.create({
    data: {
      kode: 'PEN-2025-001',
      nama: 'Penelitian Dasar Mahasiswa',
      kategori: 'PENELITIAN',
      luaran_wajib: 'Artikel Jurnal Nasional/Internasional, Laporan Penelitian',
      dana_min: 2000000,
      dana_max: 10000000,
      batas_anggota: 3,
      tahun_aktif: '2025',
      tanggal_buka: new Date('2025-02-01'),
      tanggal_tutup: new Date('2025-03-31'),
      status: 'AKTIF',
    },
  });
  console.log(`   ✅ Skema Penelitian "${skemaPenelitian.nama}" dibuat (ID: ${skemaPenelitian.id})`);

  const skemaPengabdian = await prisma.skema.create({
    data: {
      kode: 'PKM-2025-001',
      nama: 'Pengabdian Kepada Masyarakat',
      kategori: 'PENGABDIAN',
      luaran_wajib: 'Laporan Kegiatan, Dokumentasi Video, Publikasi Media',
      dana_min: 3000000,
      dana_max: 15000000,
      batas_anggota: 5,
      tahun_aktif: '2025',
      tanggal_buka: new Date('2025-02-15'),
      tanggal_tutup: new Date('2025-04-15'),
      status: 'AKTIF',
    },
  });
  console.log(`   ✅ Skema Pengabdian "${skemaPengabdian.nama}" dibuat (ID: ${skemaPengabdian.id})`);

  // Perbaikan: Menggunakan kategori yang valid (PENELITIAN/PENGABDIAN)
  const skemaHibah = await prisma.skema.create({
    data: {
      kode: 'HIB-2025-001',
      nama: 'Hibah Penelitian Dosen Muda',
      kategori: 'PENELITIAN', // Diperbaiki dari 'HIBAH_INTERNAL' menjadi kategori valid
      luaran_wajib: 'Artikel Jurnal Internasional, Produk/Prototype',
      dana_min: 5000000,
      dana_max: 25000000,
      batas_anggota: 4,
      tahun_aktif: '2025',
      tanggal_buka: new Date('2025-03-01'),
      tanggal_tutup: new Date('2025-05-01'),
      status: 'AKTIF',
    },
  });
  console.log(`   ✅ Skema Hibah "${skemaHibah.nama}" dibuat (ID: ${skemaHibah.id})`);

  // ==================== CREATE PROPOSALS ====================
  console.log('📝 Membuat proposal...');
  
  // Proposal oleh Dosen
  const proposalDosen = await prisma.proposal.create({
    data: {
      judul: 'Implementasi Machine Learning untuk Deteksi Dini Penyakit Tanaman',
      abstrak: 'Penelitian ini bertujuan untuk mengembangkan sistem deteksi dini penyakit tanaman menggunakan teknik machine learning dan computer vision. Sistem akan dapat mengidentifikasi berbagai jenis penyakit tanaman berdasarkan citra daun yang diambil menggunakan smartphone.',
      kata_kunci: 'machine learning, computer vision, deteksi penyakit tanaman, deep learning',
      skemaId: skemaHibah.id,
      ketuaId: dosen1.id,
      tahun: 2025,
      dana_diusulkan: 20000000,
      status: 'SUBMITTED',
      tanggal_submit: new Date(),
      reviewerId: reviewer1.id,
      tanggal_review: new Date(), // Field yang ditambahkan
    },
  });
  console.log(`   ✅ Proposal Dosen "${proposalDosen.judul}" dibuat (ID: ${proposalDosen.id})`);

  // Proposal oleh Mahasiswa
  const proposalMahasiswa = await prisma.proposal.create({
    data: {
      judul: 'Aplikasi Mobile untuk Monitoring Kesehatan Mental Mahasiswa',
      abstrak: 'Pengembangan aplikasi mobile berbasis Android untuk membantu mahasiswa dalam monitoring dan mengelola kesehatan mental mereka. Aplikasi akan dilengkapi dengan fitur mood tracking, konsultasi online, dan edukasi kesehatan mental.',
      kata_kunci: 'mobile application, kesehatan mental, android, mood tracking',
      skemaId: skemaPenelitian.id,
      ketuaId: mahasiswa1.id,
      tahun: 2025,
      dana_diusulkan: 7500000,
      status: 'REVIEW',
      tanggal_submit: new Date(),
      reviewerId: reviewer2.id,
      tanggal_review: new Date(), // Field yang ditambahkan
    },
  });
  console.log(`   ✅ Proposal Mahasiswa "${proposalMahasiswa.judul}" dibuat (ID: ${proposalMahasiswa.id})`);

  // Proposal Pengabdian
  const proposalPengabdian = await prisma.proposal.create({
    data: {
      judul: 'Pelatihan Digital Marketing untuk UMKM di Kota Manado',
      abstrak: 'Program pengabdian masyarakat berupa pelatihan digital marketing untuk meningkatkan kemampuan UMKM dalam memasarkan produk secara online. Kegiatan meliputi workshop, pendampingan, dan evaluasi implementasi.',
      kata_kunci: 'digital marketing, UMKM, pelatihan, e-commerce',
      skemaId: skemaPengabdian.id,
      ketuaId: dosen2.id,
      tahun: 2025,
      dana_diusulkan: 12000000,
      status: 'DRAFT',
    },
  });
  console.log(`   ✅ Proposal Pengabdian "${proposalPengabdian.judul}" dibuat (ID: ${proposalPengabdian.id})`);

  // ==================== CREATE PROPOSAL MEMBERS ====================
  console.log('👥 Membuat anggota proposal...');
  
  // Anggota untuk proposal dosen
  await prisma.proposalMember.create({
    data: {
      proposalId: proposalDosen.id,
      userId: dosen2.id,
      peran: 'ANGGOTA',
    },
  });
  console.log(`   ✅ Anggota proposal dosen: ${dosen2.nama}`);

  await prisma.proposalMember.create({
    data: {
      proposalId: proposalDosen.id,
      userId: mahasiswa1.id,
      peran: 'ANGGOTA',
    },
  });
  console.log(`   ✅ Anggota proposal dosen: ${mahasiswa1.nama}`);

  // Anggota untuk proposal mahasiswa
  await prisma.proposalMember.create({
    data: {
      proposalId: proposalMahasiswa.id,
      userId: mahasiswa2.id,
      peran: 'ANGGOTA',
    },
  });
  console.log(`   ✅ Anggota proposal mahasiswa: ${mahasiswa2.nama}`);

  // ==================== CREATE REVIEWS ====================
  console.log('📝 Membuat review...');
  
  const review1 = await prisma.review.create({
    data: {
      proposalId: proposalDosen.id,
      reviewerId: reviewer1.id,
      skor_total: 85.5,
      catatan: 'Proposal sangat baik dengan metodologi yang jelas. Disarankan untuk menambahkan dataset yang lebih beragam untuk meningkatkan akurasi model.',
      rekomendasi: 'LAYAK',
      tanggal_review: new Date(),
    },
  });
  console.log(`   ✅ Review untuk proposal dosen oleh ${reviewer1.nama}`);

  const review2 = await prisma.review.create({
    data: {
      proposalId: proposalMahasiswa.id,
      reviewerId: reviewer2.id,
      skor_total: 78.0,
      catatan: 'Proposal memiliki potensi yang baik. Perlu diperjelas mengenai target pengguna dan fitur keamanan data pengguna.',
      rekomendasi: 'REVISI',
      tanggal_review: new Date(),
    },
  });
  console.log(`   ✅ Review untuk proposal mahasiswa oleh ${reviewer2.nama}`);

  // ==================== CREATE PENGUMUMAN ====================
  console.log('📢 Membuat pengumuman...');
  
  await prisma.pengumuman.create({
    data: {
      judul: 'Pembukaan Pendaftaran Skema Penelitian 2025',
      konten: 'Pendaftaran skema penelitian dasar mahasiswa tahun 2025 telah dibuka. Batas waktu pendaftaran hingga 31 Maret 2025. Silakan lengkapi dokumen yang diperlukan dan submit proposal melalui sistem.',
      kategori: 'PENELITIAN',
      status: 'AKTIF',
    },
  });

  await prisma.pengumuman.create({
    data: {
      judul: 'Workshop Penulisan Proposal Penelitian',
      konten: 'Akan diadakan workshop penulisan proposal penelitian pada tanggal 15 Februari 2025. Workshop ditujukan untuk mahasiswa dan dosen yang akan mengajukan proposal penelitian.',
      kategori: 'PENGUMUMAN',
      status: 'AKTIF',
    },
  });
  console.log('   ✅ 2 Pengumuman berhasil dibuat');

  // ==================== CREATE DOCUMENTS ====================
  console.log('📄 Membuat dokumen...');
  
  await prisma.document.create({
    data: {
      name: 'Proposal_ML_Tanaman.pdf',
      url: '/uploads/documents/proposal_ml_tanaman.pdf',
      proposalId: proposalDosen.id,
    },
  });

  await prisma.document.create({
    data: {
      name: 'Proposal_Mobile_Mental_Health.pdf',
      url: '/uploads/documents/proposal_mobile_mental_health.pdf',
      proposalId: proposalMahasiswa.id,
    },
  });
  console.log('   ✅ 2 Dokumen berhasil dibuat');

  // ==================== SUMMARY ====================
  console.log('\n🎉 Seed data berhasil dimasukkan');
  console.log('📊 Data yang berhasil dibuat:');
  console.log(`   - ${await prisma.jurusan.count()} Jurusan`);
  console.log(`   - ${await prisma.prodi.count()} Prodi`);
  console.log(`   - ${await prisma.user.count()} Users`);
  console.log(`   - ${await prisma.skema.count()} Skema`);
  console.log(`   - ${await prisma.proposal.count()} Proposals`);
  console.log(`   - ${await prisma.proposalMember.count()} Proposal Members`);
  console.log(`   - ${await prisma.review.count()} Reviews`);
  console.log(`   - ${await prisma.pengumuman.count()} Pengumuman`);
  console.log(`   - ${await prisma.document.count()} Documents`);
}

main()
  .catch(e => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Koneksi database ditutup');
  });