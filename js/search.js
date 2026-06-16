/* ============================================================
   UniMate - search.js
   Tra cứu trường, xem chi tiết trường, lưu yêu thích
   ============================================================ */

/* ---------- TRA CỨU TRƯỜNG ---------- */

function renderSearchResults() {
  const query  = (document.getElementById('search-input')?.value || '').toLowerCase();
  const region = document.getElementById('filter-region')?.value || '';
  const type   = document.getElementById('filter-type')?.value   || '';

  const results = schools.filter(s => {
    const matchQ = !query  || s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query);
    const matchR = !region || s.region === region;
    const matchT = !type   || s.type   === type;
    return matchQ && matchR && matchT;
  });

  const el = document.getElementById('search-results');
  if (!el) return;

  el.innerHTML = results.length
    ? results.map((s, i) => schoolCardHTML(s, i)).join('')
    : '<p style="color:var(--text-secondary); padding:20px;">Không tìm thấy trường nào.</p>';
}

function filterSchools() { renderSearchResults(); }

function clearFilters() {
  document.getElementById('search-input').value  = '';
  document.getElementById('filter-region').value = '';
  document.getElementById('filter-type').value   = '';
  renderSearchResults();
}

/* ---------- CHI TIẾT TRƯỜNG ---------- */

async function openDetail(id) {
  currentDetailId = id;
  const s       = schools.find(x => x.id === id);
  console.log("IMAGE URL =", s.img);
  const idx     = schools.indexOf(s);
  const isSaved = savedSchools.has(id);
  const response = await fetch(
    `http://localhost:5000/api/truong/${id}/nganh`
);

const allMajors = await response.json();

const majors =
    selectedMajorYear === "all"
        ? allMajors
        : allMajors.filter(
            m => String(m.nam) === String(selectedMajorYear)
        );

console.log("YEAR =", selectedMajorYear);
console.log("ALL =", allMajors.length);
console.log("FILTERED =", majors.length);

console.log("FILTERED =", majors.length);
const hocPhis = majors.map(m => m.hoc_phi);

const feeMin =
    hocPhis.length > 0
        ? Math.min(...hocPhis)
        : 0;

const feeMax =
    hocPhis.length > 0
        ? Math.max(...hocPhis)
        : 0;

console.log("MAJORS =", majors);

  const majorsHTML = majors.map(m => `
<tr>
  <td>${m.ten_nganh}</td>
  <td>${m.ma_nganh}</td>
  <td>${m.to_hop}</td>
  <td>${m.diem_chuan}</td>

  <td>
    <button
      class="btn-outline"
      onclick="showMajorDetail(${m.id_nganh})">
      Chi tiết
    </button>
  </td>
</tr>
`).join('');

  document.getElementById('detail-content').innerHTML = `
    <div style="margin-bottom:16px;">
      <button class="btn-outline" style="padding:8px 16px; font-size:0.82rem;"
              onclick="navigate('search')">← Quay lại</button>
    </div>

    <!-- Hero banner trường -->
    <div class="detail-hero"
     style="
       background-image:
         linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)),
         url('${s.img}');
       background-size: cover;
       background-position: center;
     ">
      <div class="detail-hero-content">
        <h1>${s.name}</h1>
        <div class="detail-hero-badges">
          <span class="detail-badge">${s.type}</span>
          <span class="detail-badge">📍 ${s.city} • ${s.region}</span>
          <span class="detail-badge">☆ Xếp hạng #${s.rank}</span>
        </div>
      </div>
    </div>

    <!-- Nút hành động -->
    <div class="detail-actions">
      <button class="btn-heart ${isSaved ? 'saved' : ''}" id="detail-save-btn"
              onclick="toggleSave(${s.id})">
        ${isSaved ? '♥ Đã lưu' : '♡ Thêm yêu thích'}
      </button>
      <button class="btn-web" onclick="window.open('${s.web}','_blank')">
        🌐 Website trường
      </button>
    </div>

    <!-- Thông tin cơ bản -->
    <div class="info-grid">
      <div class="info-card">
        <div class="info-icon purple">🎓</div>
        <div>
          <div class="info-label">Mã trường</div>
          <div class="info-value">${s.code}</div>
        </div>
      </div>
      <div class="info-card">
        <div class="info-icon yellow">💰</div>
        <div>
          <div class="info-label">Học phí</div>
          <div class="info-value">
    ${(feeMin / 1000000).toFixed(0)}
    -
    ${(feeMax / 1000000).toFixed(0)}
    triệu/năm
</div>
        </div>
      </div>
    </div>

    <!-- Giới thiệu -->
    <div class="card">
      <div class="card-title">Giới thiệu</div>
      <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.7;">
  ${s.desc || 'Là một trong những trường đại học có chất lượng đào tạo tốt, cung cấp môi trường học tập hiện đại và đa dạng ngành nghề cho sinh viên.'}
</p>
    </div>

    <!-- Ngành đào tạo -->
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
  <div class="card-title" style="margin-bottom:0;">
    📖 Ngành đào tạo (${majors.length} ngành)
  </div>

<select id="major-year-filter"
        onchange="
          selectedMajorYear=this.value;
          openDetail(${s.id});
        "
        style="padding:6px 10px;border:1px solid #ddd;border-radius:8px;">
    <option value="all">Tất cả năm</option>
    <option value="2025">2025</option>
    <option value="2024">2024</option>
    <option value="2023">2023</option>
  </select>
</div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ngành</th><th>Mã ngành</th><th>Tổ hợp</th><th>Điểm chuẩn</th><th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>${majorsHTML}</tbody>
        </table>
      </div>
    </div>`;
  setTimeout(() => {
  const select = document.getElementById('major-year-filter');

  if (select) {
    select.value = selectedMajorYear;
  }
}, 0);

  navigate('detail');
}

/* ---------- LƯU YÊU THÍCH ---------- */

function toggleSave(id) {
  if (savedSchools.has(id)) {
    savedSchools.delete(id);
    showToast('Đã bỏ lưu trường.', '');
  } else {
    savedSchools.add(id);
    showToast('Đã lưu trường yêu thích! ♥', 'success');
  }

  // Cập nhật nút trong trang chi tiết nếu đang mở
  const btn = document.getElementById('detail-save-btn');
  if (btn) {
    const saved = savedSchools.has(id);
    btn.className = 'btn-heart' + (saved ? ' saved' : '');
    btn.innerHTML = saved ? '♥ Đã lưu' : '♡ Thêm yêu thích';
  }

  renderSaved();
}

/* ---------- TRƯỜNG YÊU THÍCH ---------- */

function renderSaved() {
  const list    = schools.filter(s => savedSchools.has(s.id));
  const emptyEl = document.getElementById('saved-empty');
  const listEl  = document.getElementById('saved-list');

  document.getElementById('saved-count').textContent =
    `Danh sách trường đại học bạn đã lưu (${list.length} trường)`;

  if (list.length === 0) {
    emptyEl.style.display = '';
    listEl.style.display  = 'none';
  } else {
    emptyEl.style.display = 'none';
    listEl.style.display  = 'grid';
    listEl.innerHTML = list.map((s, i) => schoolCardHTML(s, i)).join('');
  }
}

function showMajorDetail(id) {

  let major = null;

  for (const school of schools) {

    major = school.majors?.find(
      m => m.id_nganh == id
    );

    if (major) break;
  }

  if (!major) return;

  document.getElementById('detail-major-name').value =
    major.ten_nganh || '';

  document.getElementById('detail-major-code').value =
    major.ma_nganh || '';

  document.getElementById('detail-major-hedao').value =
    major.he_dao_tao || '';

  document.getElementById('detail-major-year').value =
    major.nam || '';

  document.getElementById('detail-major-combo').value =
    major.to_hop || '';

  document.getElementById('detail-major-score').value =
    major.diem_chuan || '';

  document.getElementById('detail-major-fee').value =
    major.hoc_phi || '';

  document.getElementById('detail-major-quota').value =
    major.chi_tieu || '';

  document.getElementById('detail-major-method').value =
    major.phuong_thuc || '';

  document.getElementById('detail-major-scale').value =
    major.thang_diem || '';

  document.getElementById('detail-major-jobrate').value =
    major.ty_le_viec_lam || '';

  document.getElementById('detail-major-salary').value =
    major.luong_trung_binh || '';

  document
  .getElementById('modal-major-detail')
  .classList.add('open');
}