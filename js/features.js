/* ============================================================
   UniMate - features.js
   Gợi ý trường, So sánh trường, Hồ sơ cá nhân
   ============================================================ */

/* ---------- GỢI Ý TRƯỜNG ---------- */

function renderSuggest() {
  const toan = parseFloat(document.getElementById('s-toan')?.value) || 0;
  const ly   = parseFloat(document.getElementById('s-ly')?.value)   || 0;
  const anh  = parseFloat(document.getElementById('s-anh')?.value)  || 0;
  const hoa  = parseFloat(document.getElementById('s-hoa')?.value) || 0;
const sinh = parseFloat(document.getElementById('s-sinh')?.value) || 0;
const van  = parseFloat(document.getElementById('s-van')?.value) || 0;
const su   = parseFloat(document.getElementById('s-su')?.value) || 0;
const dia  = parseFloat(document.getElementById('s-dia')?.value) || 0;

  const hasScores = toan > 0 || ly > 0 || anh > 0;

  document.getElementById('suggest-no-score').style.display  = hasScores ? 'none' : '';
  document.getElementById('suggest-results').style.display   = hasScores ? ''     : 'none';

  if (!hasScores) return;

  // Tính điểm trung bình tổ hợp thang 30
  let avg = 0;
  let selectedBlock = "A00";

  const selectedTags =
      [...document.querySelectorAll(
          "#interest-tags .tag.selected"
      )]
      .map(x => x.textContent.trim());

  if (
      selectedTags.includes("Y dược")
  ) {

      avg = toan + hoa + sinh;
      selectedBlock = "B00";

  }
  else if (
      selectedTags.includes("Kinh tế") ||
      selectedTags.includes("Tài chính - Ngân hàng") ||
      selectedTags.includes("Quản trị kinh doanh")
  ) {

      avg = toan + van + anh;
      selectedBlock = "D01";

  }
  else if (
      selectedTags.includes("Luật") ||
      selectedTags.includes("Báo chí - Truyền thông")
  ) {

      avg = van + su + dia;
      selectedBlock = "C00";

  }
  else {

      avg = toan + ly + anh;
      selectedBlock = "A01";

  }

  avg = avg.toFixed(1);

  document.getElementById(
      "avg-score"
).textContent = avg;
  document.getElementById(
      "selected-block"
  ).textContent = selectedBlock;

let aiComment = "";

if (selectedTags.includes("Y dược")) {

    aiComment =
        parseFloat(avg) >= 28
            ? "Bạn có khả năng cạnh tranh ở nhóm ngành Y Dược top đầu như Đại học Y Hà Nội, Đại học Dược Hà Nội."

        : parseFloat(avg) >= 25
            ? "Bạn có nhiều cơ hội ở các ngành Dược học, Điều dưỡng, Y tế công cộng."

        : "Bạn nên cân nhắc thêm các lựa chọn an toàn trong khối ngành sức khỏe.";

}

else {

    aiComment =
        parseFloat(avg) >= 28
            ? "Bạn có nhiều cơ hội ở nhóm ngành yêu thích và các trường chất lượng cao."

        : parseFloat(avg) >= 24
            ? "Bạn có khả năng cạnh tranh ở nhiều ngành phù hợp với sở thích của mình."

        : "Bạn nên bổ sung thêm một số lựa chọn an toàn để tăng cơ hội trúng tuyển.";

}
    document.getElementById(
      'suggest-ai-comment'
  ).textContent = aiComment;
  // Lọc trường có ngành đạt được với điểm hiện tại (± 2 điểm)
  const selectedInterests =
    [...document.querySelectorAll(
        "#interest-tags .tag.selected"
    )]
    .map(x => x.textContent.trim());

const interestKeywords = {

    "Công nghệ thông tin": [

    "công nghệ thông tin",
    "khoa học máy tính",
    "khoa học dữ liệu",
    "kỹ thuật dữ liệu",

    "trí tuệ nhân tạo",
    "aiot",

    "hệ thống thông tin",
    "mạng máy tính",

    "an toàn thông tin",

    "phần mềm",

    "internet vạn vật",
    "iot",

    "đa phương tiện",

    "game",

    "thương mại điện tử"
],

    "Kinh tế": [

    "kinh tế",

    "kinh doanh",

    "marketing",

    "logistics",

    "kế toán",

    "kiểm toán",

    "tài chính",

    "ngân hàng",

    "thương mại điện tử"
],

    "Y dược": [

    "y khoa",

    "y học",

    "dược",

    "điều dưỡng",

    "răng hàm mặt",

    "xét nghiệm",

    "y sinh",

    "sức khỏe",

    "bệnh viện",

    "y tế công cộng"
],

    "Kỹ thuật": [

    "kỹ thuật",

    "cơ khí",

    "cơ điện tử",

    "điện",

    "điện tử",

    "viễn thông",

    "tự động hóa",

    "ô tô",

    "xây dựng",

    "hạ tầng",

    "robot"
],

    "Luật": [
        "luật"
    ],

    "Sư phạm": [
        "sư phạm",
        "giáo dục"
    ],

    "Ngoại ngữ": [

    "ngôn ngữ",

    "anh",

    "trung",

    "nhật",

    "hàn",

    "đông phương"
],
    "Nghệ thuật": [

    "thiết kế",

    "mỹ thuật",

    "thời trang",

    "nội thất",

    "đồ họa",

    "đa phương tiện",

    "truyền thông",

    "báo chí",

    "quan hệ công chúng",

    "nghệ thuật"
],

    "Nông nghiệp": [

    "nông",

    "lâm",

    "thủy",

    "sinh học",

    "môi trường",

    "tài nguyên",

    "đất đai",

    "khí tượng",

    "thủy văn"
],

    "Kiến trúc": [

    "kiến trúc",

    "quy hoạch",

    "nội thất",

    "xây dựng",
    "thiết kế"
],

    "Báo chí - Truyền thông": [

    "báo chí",

    "truyền thông",

    "đa phương tiện",

    "quan hệ công chúng"
],

    "Quản trị kinh doanh": [
        "quản trị kinh doanh",
        "marketing",
        "logistics"
    ],

    "Tài chính - Ngân hàng": [
        "tài chính",
        "ngân hàng",
        "kiểm toán",
        "kế toán"
    ]
};
  
  const suitableMajors = [];

schools.forEach(school => {

    school.majors.forEach(major => {

        const diemChuan =
            parseFloat(major.diem_chuan);

        if (isNaN(diemChuan)) return;

        if (diemChuan <= parseFloat(avg) + 2) {
            let interestScore = 0;

const tenNganh =
    (major.ten_nganh || "")
    .toLowerCase();

for (const interest of selectedInterests) {

    const keywords =
        interestKeywords[interest] || [];

    if (
        keywords.some(
            k => tenNganh.includes(
                k.toLowerCase()
            )
        )
    ) {
        interestScore += 50;
    }
}
            suitableMajors.push({

    schoolName:
        school.name,

    schoolCode:
        school.code,

    schoolRank:
        school.rank,

    majorName:
        major.ten_nganh,

    diemChuan:
        diemChuan,

    diff:
      Math.abs(
          parseFloat(avg) - diemChuan
      ),

  interestScore:
      interestScore

});
        }
    });

});

suitableMajors.sort((a, b) => {

    const scoreA =
        a.interestScore
        - a.diff * 10
        + (100 - a.schoolRank);

    const scoreB =
        b.interestScore
        - b.diff * 10
        + (100 - b.schoolRank);

    return scoreB - scoreA;

});

document.getElementById(
    'suggest-ai-comment'
).innerHTML = aiComment;

document.getElementById('suggest-list').innerHTML =
    suitableMajors.length

    ? suitableMajors.slice(0, 10).map(item => `

        <div class="card"
             style="padding:16px; margin-bottom:12px;">

            <h4 style="margin-bottom:8px;">
                ${item.majorName}
            </h4>

            <div>
                Trường:
                <b>${item.schoolName}</b>
            </div>

            <div>
                Mã trường:
                ${item.schoolCode}
            </div>

            <div>
    Điểm chuẩn:
    <b>${item.diemChuan}</b>
</div>

<div>
    Chênh lệch:
    <b>
        ${(parseFloat(avg) - item.diemChuan).toFixed(1)}
    </b>
</div>

<div>
    Cơ hội:
    <b>
        ${
            parseFloat(avg) - item.diemChuan >= 1
            ? '✓ Cao'

            : parseFloat(avg) - item.diemChuan >= -1
            ? '≈ Cân nhắc'

            : '✗ Thấp'
        }
    </b>
</div>

        </div>

    `).join('')

    : `
        <p style="
            padding:20px;
            color:var(--text-secondary);
        ">
            Không có ngành phù hợp.
        </p>
    `;
    }

/* ---------- SO SÁNH TRƯỜNG ---------- */

function renderCompare() {
  const chipsEl = document.getElementById('compare-chips');

  // Render chip từng trường đã thêm
  const chipHTML = compareSchools.map(s => `
    <div class="chip">
      <span style="background:${schoolColor(schools.indexOf(s))}; color:white;
                   padding:2px 8px; border-radius:6px; font-size:0.75rem;">${s.code}</span>
      ${s.name}
      <button class="chip-remove" onclick="removeFromCompare(${s.id})">✕</button>
    </div>`).join('');

  chipsEl.innerHTML = chipHTML +
    `<button class="btn-add-school" onclick="openAddCompare()">+ Thêm trường</button>`;

  const emptyEl    = document.getElementById('compare-empty');
  const tableWrap  = document.getElementById('compare-table-wrap');

  if (compareSchools.length < 2) {
    emptyEl.style.display   = '';
    tableWrap.style.display = 'none';
    return;
  }

  emptyEl.style.display   = 'none';
  tableWrap.style.display = '';

  // Header cột
  const colsHTML = compareSchools.map(s => `
    <th class="school-col">
      <div class="school-avatar"
           style="background:${schoolColor(schools.indexOf(s))}">${s.code}</div>
      <div style="font-weight:700; font-size:0.9rem;">${s.name}</div>
      <div style="font-size:0.78rem; color:var(--text-secondary);">${s.code}</div>
    </th>`).join('');

  // Các hàng so sánh
  const rows = [
    ['Loại trường',           s => `<b>${s.type}</b>`],
    ['Khu vực',               s => `📍 ${s.region}`],
    ['Thành phố',             s => s.city],
    ['Xếp hạng',              s => `<span style="color:var(--primary);font-weight:700">🏆 #${s.rank}</span>`],
    ['Học phí (triệu/năm)',   s => `📋 ${s.feeMin} – ${s.feeMax}`],
    ['Số ngành',              s => `📖 ${s.majors.length} ngành`],
    ['Điểm chuẩn thấp nhất',
 s => {
   const scores = s.majors
     .map(m => parseFloat(m.score || m.diem_chuan))
     .filter(x => !isNaN(x));

   return `<b>${scores.length ? Math.min(...scores) : '—'}</b>`;
 }],

['Điểm chuẩn cao nhất',
 s => {
   const scores = s.majors
     .map(m => parseFloat(m.score || m.diem_chuan))
     .filter(x => !isNaN(x));

   return `<b>${scores.length ? Math.max(...scores) : '—'}</b>`;
 }],
  ];

  const rowsHTML = rows.map(([label, fn]) => `
    <tr>
      <td style="color:var(--text-secondary); font-size:0.85rem;">${label}</td>
      ${compareSchools.map(s => `<td style="text-align:center; font-size:0.875rem;">${fn(s)}</td>`).join('')}
    </tr>`).join('');

  document.getElementById('compare-table').innerHTML = `
    <thead><tr><th>Tiêu chí</th>${colsHTML}</tr></thead>
    <tbody>${rowsHTML}</tbody>`;
}

function openAddCompare() {
  document.getElementById('compare-search').value = '';
  renderCompareSearch();
  document.getElementById('modal-compare').classList.add('open');
}

function renderCompareSearch() {
  const q          = document.getElementById('compare-search').value.toLowerCase();
  const compareIds = new Set(compareSchools.map(s => s.id));

  const list = schools.filter(s =>
    !compareIds.has(s.id) &&
    (s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
  );

  document.getElementById('compare-search-list').innerHTML = list.map(s => `
    <div class="school-search-item">
      <div>
        <div class="name">${s.name}</div>
        <div class="code">${s.code} • ${s.city}</div>
      </div>
      <button class="btn-add-to-compare" onclick="addToCompare(${s.id})">+ Thêm</button>
    </div>`).join('') ||
    '<p style="padding:16px; color:var(--text-secondary); text-align:center;">Không tìm thấy trường.</p>';
}

function addToCompare(id) {
  if (compareSchools.length >= 5) {
    showToast('Tối đa 5 trường!', 'error');
    return;
  }
  const s = schools.find(x => x.id === id);
  compareSchools.push(s);
  renderCompare();
  closeModal('modal-compare');
  showToast(`Đã thêm ${s.name}`, 'success');
}

function removeFromCompare(id) {
  compareSchools = compareSchools.filter(s => s.id !== id);
  renderCompare();
}

/* ---------- HỒ SƠ CÁ NHÂN ---------- */

function toggleTag(el) {
  el.classList.toggle('selected');
}

async function saveProfile() {

  const selectedTags = [...document.querySelectorAll("#interest-tags .tag.selected")]
    .map(tag => tag.textContent);

  const data = {
    id_nd: currentUser.id,

    ho_ten: document.getElementById("p-name").value,
    so_dien_thoai: document.getElementById("p-phone").value,
    truong_thpt: document.getElementById("p-school").value,
    tinh_thanh: document.getElementById("p-city").value,

    diem_toan: document.getElementById("s-toan").value || null,
    diem_ly: document.getElementById("s-ly").value || null,
    diem_hoa: document.getElementById("s-hoa").value || null,
    diem_van: document.getElementById("s-van").value || null,
    diem_anh: document.getElementById("s-anh").value || null,
    diem_sinh: document.getElementById("s-sinh").value || null,
    diem_su: document.getElementById("s-su").value || null,
    diem_dia: document.getElementById("s-dia").value || null,
    diem_gdcd: document.getElementById("s-gdcd").value || null,

    nganh_muc_tieu: selectedTags.join(", "),
    khu_vuc_mong_muon: document.getElementById("p-region").value,
    ngan_sach_toi_da: document.getElementById("p-budget").value || null
  };

  try {

    const response = await fetch(
      "http://localhost:5000/api/hoso",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.json();

    showToast(result.message, "success");

    renderSuggest();

  } catch (error) {

    console.error(error);

    showToast(
      "Không thể lưu hồ sơ",
      "error"
    );
  }
}

async function loadProfile() {

  try {

    const response = await fetch(
      `http://localhost:5000/api/hoso/${currentUser.id}`
    );

    if (!response.ok) return;

    const data = await response.json();

    document.getElementById("p-name").value = data.ho_ten || "";
    document.getElementById("p-phone").value = data.so_dien_thoai || "";
    document.getElementById("p-school").value = data.truong_thpt || "";
    document.getElementById("p-city").value = data.tinh_thanh || "";

    document.getElementById("s-toan").value = data.diem_toan || "";
    document.getElementById("s-ly").value = data.diem_ly || "";
    document.getElementById("s-hoa").value = data.diem_hoa || "";
    document.getElementById("s-van").value = data.diem_van || "";
    document.getElementById("s-anh").value = data.diem_anh || "";
    document.getElementById("s-sinh").value = data.diem_sinh || "";
    document.getElementById("s-su").value = data.diem_su || "";
    document.getElementById("s-dia").value = data.diem_dia || "";
    document.getElementById("s-gdcd").value = data.diem_gdcd || "";

    document.getElementById("p-region").value =
      data.khu_vuc_mong_muon || "Tất cả khu vực";

    document.getElementById("p-budget").value =
      data.ngan_sach_toi_da || "";

    // tô lại các tag sở thích
    if (data.nganh_muc_tieu) {

      const interests = data.nganh_muc_tieu
        .split(",")
        .map(x => x.trim());

      document.querySelectorAll("#interest-tags .tag")
        .forEach(tag => {

          if (interests.includes(tag.textContent.trim())) {
            tag.classList.add("selected");
          }
        });
    }

  } catch (err) {

    console.error("Load profile error:", err);

  }
}
