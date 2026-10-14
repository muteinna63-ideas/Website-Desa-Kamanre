// STATE & LOCAL STORAGE INITIALIZATION
let isAdmin = localStorage.getItem('kamanre_isAdmin') === 'true';

// Initial Mock Data Berita
const initialBerita = [
    {
        id: 1,
        title: "Kerja Bakti Pembersihan Saluran Irigasi Sawah Dusun Kamanre",
        category: "Pertanian",
        date: "12 Oktober 2026",
        image: "https://images.unsplash.com/photo-1599580420422-92167d4f7a1f?auto=format&fit=crop&w=600&q=80",
        content: "Masyarakat Desa Kamanre bersama aparat pemerintah desa melaksanakan kegiatan gotong royong pembersihan saluran irigasi utama. Hal ini dilakukan guna menyambut musim tanam padi agar pasokan air ke sawah warga lancar dan terhindar dari penyumbatan."
    },
    {
        id: 2,
        title: "Pelatihan Pengolahan Biji Kakao Berkualitas Tinggi Bagi Petani Lokal",
        category: "Infrastruktur",
        date: "08 Oktober 2026",
        image: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&w=600&q=80",
        content: "Pemerintah Desa Kamanre bekerjasama dengan Dinas Pertanian Kabupaten Luwu mengadakan bimbingan teknis fermentasi biji kakao. Pelatihan ini bertujuan untuk meningkatkan nilai jual kakao hasil panen warga di pasar nasional."
    }
];

// Initial Mock Data Pengaduan
const initialComplaints = [
    {
        id: 101,
        name: "Bapak Rahmat",
        category: "Jalan & Infrastruktur",
        detail: "Mohon penambahan penerangan jalan umum di perbatasan masuk Dusun Kamanre karena kondisi minim cahaya saat malam hari.",
        image: null,
        status: "Diproses",
        date: "10 Okt 2026",
        response: "Terima kasih atas masukannya. Tim desa sudah mendata titik pemasangan lampu jalan."
    },
    {
        id: 102,
        name: "Ibu Nurhayati",
        category: "Kebersihan & Sampah",
        detail: "Diperlukan tempat sampah pilah komunal di area fasilitas umum dekat lapangan desa.",
        image: null,
        status: "Selesai",
        date: "05 Okt 2026",
        response: "Tempat sampah komunal sudah ditempatkan di 2 titik lokasi."
    }
];

// Initial Policy Comments
const initialPolicyComments = [
    {
        id: 201,
        name: "H. Syamsuddin",
        stance: "Sangat Setuju",
        text: "Sangat mendukung perbaikan irigasi sawah agar hasil panen padi warga Desa Kamanre melimpah tahun ini.",
        date: "11 Okt 2026"
    }
];

// Load Stores from LocalStorage or Fallback
let beritaData = JSON.parse(localStorage.getItem('kamanre_berita')) || initialBerita;
let complaintsData = JSON.parse(localStorage.getItem('kamanre_complaints')) || initialComplaints;
let policyCommentsData = JSON.parse(localStorage.getItem('kamanre_policyComments')) || initialPolicyComments;

function saveAllData() {
    localStorage.setItem('kamanre_berita', JSON.stringify(beritaData));
    localStorage.setItem('kamanre_complaints', JSON.stringify(complaintsData));
    localStorage.setItem('kamanre_policyComments', JSON.stringify(policyCommentsData));
    localStorage.setItem('kamanre_isAdmin', isAdmin);
}

// ON DOM LOADED
document.addEventListener('DOMContentLoaded', () => {
    renderBerita();
    renderComplaints();
    renderPolicyComments();
    initCharts();
    updateAdminUI();

    // Theme Toggle Listener
    document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);

    // Check System Theme Preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        updateThemeLabel(true);
    }
});

// UI TEXT RESIZER
function changeFontSize(type) {
    const html = document.documentElement;
    if (type === 'small') html.style.fontSize = '14px';
    if (type === 'normal') html.style.fontSize = '16px';
    if (type === 'large') html.style.fontSize = '18px';
}

// DARK MODE TOGGLE
function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    updateThemeLabel(isDark);
}

function updateThemeLabel(isDark) {
    const btn = document.getElementById('themeToggle');
    const label = document.getElementById('themeLabel');
    if (isDark) {
        btn.innerHTML = `<i class="fas font-solid fa-sun text-amber-400"></i><span id="themeLabel" class="hidden sm:inline">Terang</span>`;
    } else {
        btn.innerHTML = `<i class="fas font-solid fa-moon"></i><span id="themeLabel" class="hidden sm:inline">Gelap</span>`;
    }
}

// MOBILE MENU
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// ADMIN AUTHENTICATION
function toggleAdminAuth() {
    if (isAdmin) {
        logoutAdmin();
    } else {
        document.getElementById('adminModal').classList.remove('hidden');
    }
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.add('hidden');
}

function submitAdminLogin(e) {
    e.preventDefault();
    const pin = document.getElementById('adminPinInput').value;
    if (pin === '1234') {
        isAdmin = true;
        saveAllData();
        updateAdminUI();
        closeAdminModal();
        alert('Login Admin Berhasil!');
    } else {
        alert('PIN Salah! Gunakan PIN default: 1234');
    }
}

function logoutAdmin() {
    isAdmin = false;
    saveAllData();
    updateAdminUI();
    alert('Anda telah keluar dari Mode Admin.');
}

function updateAdminUI() {
    const banner = document.getElementById('adminBadgeBanner');
    const panel = document.getElementById('adminPanelSection');
    const btnText = document.getElementById('adminBtnText');

    if (isAdmin) {
        banner.classList.remove('hidden');
        panel.classList.remove('hidden');
        btnText.innerText = 'Keluar Admin';
    } else {
        banner.classList.add('hidden');
        panel.classList.add('hidden');
        btnText.innerText = 'Login Admin';
    }
    renderComplaints(); // re-render to update admin controls
    updateComplaintStats();
}

// RENDER ARTICLES / BERITA
function renderBerita() {
    const container = document.getElementById('beritaContainer');
    container.innerHTML = '';

    beritaData.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 flex flex-col justify-between";
        card.innerHTML = `
      <div>
        <div class="relative h-48 overflow-hidden">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover hover:scale-105 transition duration-300">
          <span class="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
            ${item.category}
          </span>
        </div>
        <div class="p-5">
          <span class="text-xs text-gray-500 dark:text-gray-400 block mb-1"><i class="far fa-calendar-alt mr-1"></i> ${item.date}</span>
          <h3 class="font-bold text-gray-900 dark:text-white text-base mb-2 line-clamp-2">${item.title}</h3>
          <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">${item.content}</p>
        </div>
      </div>
      <div class="px-5 pb-5 pt-0 flex justify-between items-center">
        <button onclick="openBeritaModal(${item.id})" class="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1">
          Baca Selengkapnya <i class="fas fa-arrow-right text-[10px]"></i>
        </button>
        ${isAdmin ? `<button onclick="deleteBerita(${item.id})" class="text-xs text-red-600 hover:underline"><i class="fas fa-trash"></i> Hapus</button>` : ''}
      </div>
    `;
        container.appendChild(card);
    });
}

// MODAL READ BERITA
function openBeritaModal(id) {
    const item = beritaData.find(b => b.id === id);
    if (!item) return;

    document.getElementById('modalTitle').innerText = item.title;
    document.getElementById('modalImg').src = item.image;
    document.getElementById('modalMeta').innerText = `Kategori: ${item.category} | Tanggal Publikasi: ${item.date}`;
    document.getElementById('modalContent').innerText = item.content;
    document.getElementById('beritaModal').classList.remove('hidden');
}

function closeBeritaModal() {
    document.getElementById('beritaModal').classList.add('hidden');
}

// CREATE NEW BERITA (ADMIN)
function handleCreateBerita(e) {
    e.preventDefault();
    const title = document.getElementById('beritaTitle').value;
    const category = document.getElementById('beritaCategory').value;
    const content = document.getElementById('beritaContent').value;
    const fileInput = document.getElementById('beritaImageInput');

    const createAndSave = (imgUrl) => {
        const newArticle = {
            id: Date.now(),
            title: title,
            category: category,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            image: imgUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
            content: content
        };
        beritaData.unshift(newArticle);
        saveAllData();
        renderBerita();
        document.getElementById('adminBeritaForm').reset();
        alert('Artikel Berita Desa Berhasil Diterbitkan!');
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            createAndSave(evt.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        createAndSave(null);
    }
}

function deleteBerita(id) {
    if (confirm('Yakin ingin menghapus berita ini?')) {
        beritaData = beritaData.filter(b => b.id !== id);
        saveAllData();
        renderBerita();
    }
}

// COMPLAINTS & MASUKAN SYSTEM
function handleNewComplaint(e) {
    e.preventDefault();
    const name = document.getElementById('compName').value;
    const category = document.getElementById('compCategory').value;
    const detail = document.getElementById('compDetail').value;
    const fileInput = document.getElementById('compImage');

    const saveComplaint = (imgData) => {
        const newComp = {
            id: Date.now(),
            name: name,
            category: category,
            detail: detail,
            image: imgData,
            status: 'Terkirim',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            response: ''
        };
        complaintsData.unshift(newComp);
        saveAllData();
        renderComplaints();
        updateComplaintStats();
        document.getElementById('complaintForm').reset();
        alert('Masukan/Pengaduan Anda telah dikirim ke Pemerintah Desa Kamanre!');
    };

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            saveComplaint(evt.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveComplaint(null);
    }
}

function renderComplaints() {
    const container = document.getElementById('complaintsList');
    const filter = document.getElementById('filterStatus').value;
    container.innerHTML = '';

    const filtered = complaintsData.filter(item => {
        if (filter === 'ALL') return true;
        return item.status === filter;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<p class="text-xs text-gray-500 text-center py-4">Belum ada pengaduan dengan status ini.</p>`;
        return;
    }

    filtered.forEach(item => {
        let badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
        if (item.status === 'Diproses') badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
        if (item.status === 'Selesai') badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

        const card = document.createElement('div');
        card.className = "bg-white dark:bg-gray-700/60 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm text-xs space-y-2";
        card.innerHTML = `
      <div class="flex justify-between items-start gap-2">
        <div>
          <span class="font-bold text-gray-900 dark:text-white">${item.name}</span>
          <span class="text-[10px] text-gray-500 dark:text-gray-400 block">${item.date} • Kategori: ${item.category}</span>
        </div>
        <span class="px-2 py-0.5 rounded border ${badgeColor} font-semibold text-[10px]">${item.status}</span>
      </div>
      <p class="text-gray-700 dark:text-gray-200 leading-relaxed">${item.detail}</p>
      ${item.image ? `<img src="${item.image}" alt="Bukti Foto" class="w-24 h-24 object-cover rounded border mt-2">` : ''}
      
      ${item.response ? `
        <div class="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-l-2 border-emerald-600 text-emerald-900 dark:text-emerald-300 rounded-r">
          <strong>Respon Desa:</strong> ${item.response}
        </div>
      ` : ''}

      ${isAdmin ? `
        <div class="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600 flex flex-wrap items-center justify-between gap-2 bg-amber-50/50 dark:bg-gray-800 p-2 rounded">
          <div class="flex items-center gap-1">
            <span class="font-semibold text-[10px]">Ubah Status:</span>
            <select onchange="updateComplaintStatus(${item.id}, this.value)" class="text-[10px] px-1 py-0.5 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700">
              <option value="Terkirim" ${item.status === 'Terkirim' ? 'selected' : ''}>Terkirim</option>
              <option value="Diproses" ${item.status === 'Diproses' ? 'selected' : ''}>Diproses</option>
              <option value="Selesai" ${item.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
            </select>
          </div>
          <button onclick="promptComplaintResponse(${item.id})" class="bg-emerald-700 text-white text-[10px] px-2 py-1 rounded">
            <i class="fas fa-reply"></i> ${item.response ? 'Edit Balasan' : 'Beri Balasan'}
          </button>
        </div>
      ` : ''}
    `;
        container.appendChild(card);
    });
}

function updateComplaintStatus(id, newStatus) {
    const target = complaintsData.find(c => c.id === id);
    if (target) {
        target.status = newStatus;
        saveAllData();
        renderComplaints();
        updateComplaintStats();
    }
}

function promptComplaintResponse(id) {
    const target = complaintsData.find(c => c.id === id);
    if (target) {
        const res = prompt('Masukkan jawaban/balasan resmi pemerintah desa:', target.response || '');
        if (res !== null) {
            target.response = res;
            saveAllData();
            renderComplaints();
        }
    }
}

function updateComplaintStats() {
    document.getElementById('statTotalComplaints').innerText = complaintsData.length;
    document.getElementById('statProcessComplaints').innerText = complaintsData.filter(c => c.status === 'Diproses').length;
    document.getElementById('statDoneComplaints').innerText = complaintsData.filter(c => c.status === 'Selesai').length;
    document.getElementById('adminPendingBadge').innerText = `${complaintsData.filter(c => c.status !== 'Selesai').length} Belum Selesai`;
}

// POLICY COMMENTS SYSTEM
function handlePolicyComment(e) {
    e.preventDefault();
    const name = document.getElementById('policyName').value;
    const stance = document.getElementById('policyStance').value;
    const text = document.getElementById('policyText').value;

    const newComment = {
        id: Date.now(),
        name: name,
        stance: stance,
        text: text,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    policyCommentsData.unshift(newComment);
    saveAllData();
    renderPolicyComments();
    document.getElementById('policyCommentForm').reset();
}

function renderPolicyComments() {
    const container = document.getElementById('policyCommentsList');
    container.innerHTML = '';

    policyCommentsData.forEach(c => {
        let stanceBadge = 'bg-emerald-100 text-emerald-800';
        if (c.stance.includes('Catatan')) stanceBadge = 'bg-amber-100 text-amber-800';
        if (c.stance.includes('Evaluasi')) stanceBadge = 'bg-red-100 text-red-800';

        const card = document.createElement('div');
        card.className = "p-3 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 text-xs space-y-1";
        card.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-bold text-gray-900 dark:text-white">${c.name}</span>
        <span class="px-2 py-0.5 rounded text-[10px] font-semibold ${stanceBadge}">${c.stance}</span>
      </div>
      <p class="text-gray-600 dark:text-gray-300">${c.text}</p>
      <span class="text-[9px] text-gray-400 block">${c.date}</span>
    `;
        container.appendChild(card);
    });
}

// CHARTS DEMOGRAFI
function initCharts() {
    // Chart Pekerjaan
    const ctxPekerjaan = document.getElementById('chartPekerjaan').getContext('2d');
    new Chart(ctxPekerjaan, {
        type: 'doughnut',
        data: {
            labels: ['Petani Kakao & Padi', 'PNS / Guru', 'Pedagang / UMKM', 'Jasa / Lainnya'],
            datasets: [{
                data: [55, 15, 20, 10],
                backgroundColor: ['#059669', '#f59e0b', '#3b82f6', '#6b7280']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Mata Pencaharian Penduduk (%)' }
            }
        }
    });

    // Chart Penduduk
    const ctxPenduduk = document.getElementById('chartPenduduk').getContext('2d');
    new Chart(ctxPenduduk, {
        type: 'bar',
        data: {
            labels: ['Anak-anak', 'Usia Produktif (18-55)', 'Lansia (>55)'],
            datasets: [{
                label: 'Jumlah Jiwa',
                data: [420, 1350, 310],
                backgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: 'Kelompok Usia Penduduk Desa Kamanre' }
            }
        }
    });
}