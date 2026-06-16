/* ============================================================
   UniMate - admin.js
   Quản lý trường đại học và người dùng (dành cho Admin)
   ============================================================ */

/* ============================================================
   QUẢN LÝ TRƯỜNG ĐẠI HỌC
   ============================================================ */

let editingMajorIndex = null;
function renderAdminSchools(query = '') {
  const q    = query.toLowerCase();
  const list = schools.filter(s =>
    !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
  );

  document.getElementById('admin-school-count').textContent = `${schools.length} trường trong hệ thống`;
  document.getElementById('admin-schools-body').innerHTML = list.map(s => `
    <tr>
      <td style="font-weight:600; color:var(--text-secondary); font-size:0.82rem;">${s.code}</td>
      <td style="font-weight:600;">${s.name}</td>
      <td><span class="badge">${s.type}</span></td>
      <td style="color:var(--primary);">${s.city}</td>
      <td>
        <span style="background:#EEF2FF; color:var(--primary);
                     padding:2px 10px; border-radius:20px;
                     font-size:0.78rem; font-weight:700;">
          ${s.majors.length}
        </span>
      </td>
      <td>
        <button class="action-btn edit" onclick="openEditSchool(${s.id})" title="Sửa">✏️</button>
        <button class="action-btn del"  onclick="deleteSchool(${s.id})"   title="Xóa">🗑️</button>
      </td>
    </tr>`).join('');
}

function filterAdminSchools(q) { renderAdminSchools(q); }

/* --- Mở modal thêm trường --- */
function openAddSchool() {
  editingSchoolId = null;
  document.getElementById('modal-school-title').textContent = 'Thêm trường';

  // Xóa các trường input
  ['ms-name','ms-code','ms-city','ms-desc','ms-img','ms-web'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('ms-rank').value    = '';
  document.getElementById('ms-fee-min').value = '';
  document.getElementById('ms-fee-max').value = '';

  tempMajors = [];
  renderMajors();
  document.getElementById('modal-school').classList.add('open');
}

/* --- Mở modal chỉnh sửa trường --- */
function openEditSchool(id) {
  editingSchoolId = id;
  const s = schools.find(x => x.id === id);
  document.getElementById('modal-school-title').textContent = 'Chỉnh sửa trường';

  document.getElementById('ms-name').value    = s.name;
  document.getElementById('ms-code').value    = s.code;
  document.getElementById('ms-city').value    = s.city;
  document.getElementById('ms-type').value    = s.type;
  document.getElementById('ms-region').value  = s.region;
  document.getElementById('ms-rank').value    = s.rank;
  document.getElementById('ms-fee-min').value = s.feeMin;
  document.getElementById('ms-fee-max').value = s.feeMax;
  document.getElementById('ms-desc').value    = s.desc;
  document.getElementById('ms-img').value     = s.img  || '';
  document.getElementById('ms-web').value     = s.web  || '';

 tempMajors = s.majors.map(m => ({
  id_nganh: m.id_nganh || null,

  name: m.name || m.ten_nganh || "",
  code: m.code || m.ma_nganh || "",
  combo: m.combo || m.to_hop || "",
  score: m.score || m.diem_chuan || 0,

  nam: m.nam || 2025,
  hoc_phi: m.hoc_phi || 0,
  chi_tieu: m.chi_tieu || 0
}));
  renderMajors();
  document.getElementById('modal-school').classList.add('open');
}

/* --- Render danh sách ngành trong modal --- */
function renderMajors() {
  document.getElementById('major-count-label').textContent = `Ngành đào tạo (${tempMajors.length})`;
  document.getElementById('majors-list').innerHTML = tempMajors.map((m, i) => `
    <div class="major-row">
      <input type="text"   value="${m.name}"  placeholder="Tên ngành"
             oninput="tempMajors[${i}].name=this.value">
      <input type="text"   value="${m.code}"  placeholder="Mã ngành"
             oninput="tempMajors[${i}].code=this.value">
      <input type="text"   value="${m.combo}" placeholder="Tổ hợp"
             oninput="tempMajors[${i}].combo=this.value">
      <input type="number" value="${m.score}" placeholder="Điểm" step="0.1"
             oninput="tempMajors[${i}].score=parseFloat(this.value)||0">
      <button class="btn-edit-major"
        onclick="editMajor(${i})">
  ✏️
</button>

<button class="btn-del-major"
        onclick="deleteMajor(${i})">
  🗑️
</button>
    </div>`).join('');
}

function addMajorRow() {
  tempMajors.push({ name: '', code: '', combo: 'A00', score: 0 });
  renderMajors();
}

async function deleteMajor(i) {

  const major = tempMajors[i];

  if (!confirm(`Xóa ngành "${major.name}"?`)) {
    return;
  }

  try {

    if (major.id_nganh) {

      await fetch(
        `http://localhost:5000/api/nganh/${major.id_nganh}`,
        {
          method: "DELETE"
        }
      );
    }

    tempMajors.splice(i, 1);

    renderMajors();

    showToast(
      'Đã xóa ngành!',
      'success'
    );

  } catch (error) {

    console.error(error);

    showToast(
      'Lỗi xóa ngành',
      'error'
    );
  }
}
function editMajor(i) {

    const m = tempMajors[i];

    editingMajorIndex = i;

    document.getElementById("major-name").value =
        m.name || "";

    document.getElementById("major-code").value =
        m.code || "";

    document.getElementById("major-hedao").value =
        m.he_dao_tao || "Đại học chính quy";

    document.getElementById("major-year").value =
        m.nam || 2025;

    document.getElementById("major-combo").value =
        m.combo || "";

    document.getElementById("major-score").value =
        m.score || 0;

    document.getElementById("major-fee").value =
        m.hoc_phi || 0;

    document.getElementById("major-quota").value =
        m.chi_tieu || 0;

    document.getElementById("major-method").value =
        m.phuong_thuc || "Thi THPT";

    document.getElementById("major-scale").value =
        m.thang_diem || 30;

    document.getElementById("major-jobrate").value =
        m.ty_le_viec_lam || 0;

    document.getElementById("major-salary").value =
        m.luong_trung_binh || 0;

    document
        .getElementById("modal-major")
        .classList.add("open");
}
/* --- Lưu trường (thêm mới hoặc cập nhật) --- */
function saveSchool() {

    const name = document.getElementById('ms-name').value.trim();
    const code = document.getElementById('ms-code').value.trim();

    if (!name || !code) {
        showToast('Vui lòng nhập tên và mã trường!', 'error');
        return;
    }

    const data = {
        name,
        code,
        type: document.getElementById('ms-type').value,
        city: document.getElementById('ms-city').value,
        region: document.getElementById('ms-region').value,
        rank: parseInt(document.getElementById('ms-rank').value) || 99,
        feeMin: parseInt(document.getElementById('ms-fee-min').value) || 0,
        feeMax: parseInt(document.getElementById('ms-fee-max').value) || 0,
        desc: document.getElementById('ms-desc').value,
        img: document.getElementById('ms-img').value,
        web: document.getElementById('ms-web').value,
        majors: tempMajors
    };

    // =========================
    // CẬP NHẬT TRƯỜNG
    // =========================
    if (editingSchoolId) {

        fetch(
            `http://localhost:5000/api/truong/${editingSchoolId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ma_truong: data.code,
                    ten_truong: data.name,
                    dia_chi: data.city,
                    loai_hinh: data.type,
                    khoi_nganh: "",
                    thu_hang: data.rank,
                    trong_diem: 0,
                    khu_vuc: data.region,
                    website: data.web,
                    image_url: data.img
                })
            }
        )
        .then(async () => {

          // Cập nhật hoặc thêm ngành

for (const major of data.majors) {

    if (major.id_nganh) {

        // Ngành đã tồn tại -> UPDATE

        await fetch(
            `http://localhost:5000/api/nganh/${major.id_nganh}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    ten_nganh: major.name,
                    ma_nganh: major.code,

                    he_dao_tao:
                        major.he_dao_tao || "Đại học chính quy",

                    to_hop:
                        major.combo,

                    diem_chuan:
                        major.score,

                    hoc_phi:
                        major.hoc_phi || 0,

                    chi_tieu:
                        major.chi_tieu || 0,

                    nam:
                        major.nam || 2025,

                    phuong_thuc:
                        major.phuong_thuc || "Thi THPT",

                    thang_diem:
                        major.thang_diem || 30,

                    ty_le_viec_lam:
                        major.ty_le_viec_lam || 0,

                    luong_trung_binh:
                        major.luong_trung_binh || 0
                })
            }
        );

    } else {

        // Ngành mới -> INSERT

        await fetch(
            "http://localhost:5000/api/nganh",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    id_truong: editingSchoolId,

                    ten_nganh: major.name,
                    ma_nganh: major.code,

                    he_dao_tao:
                        major.he_dao_tao || "Đại học chính quy",

                    to_hop:
                        major.combo,

                    diem_chuan:
                        major.score,

                    hoc_phi:
                        major.hoc_phi || 0,

                    chi_tieu:
                        major.chi_tieu || 0,

                    nam:
                        major.nam || 2025,

                    phuong_thuc:
                        major.phuong_thuc || "Thi THPT",

                    thang_diem:
                        major.thang_diem || 30,

                    ty_le_viec_lam:
                        major.ty_le_viec_lam || 0,

                    luong_trung_binh:
                        major.luong_trung_binh || 0
                })
            }
        );
    }
}

            await loadSchools();

            renderAdminSchools();
            renderSearchResults();

            closeModal('modal-school');

            showToast(
                'Đã cập nhật trường!',
                'success'
            );
        })
        .catch(err => {

            console.error(err);

            showToast(
                'Lỗi cập nhật trường',
                'error'
            );
        });

    }

    // =========================
    // THÊM TRƯỜNG MỚI
    // =========================
    else {

        fetch(
            "http://localhost:5000/api/truong",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ma_truong: data.code,
                    ten_truong: data.name,
                    dia_chi: data.city,
                    loai_hinh: data.type,
                    khoi_nganh: "",
                    thu_hang: data.rank,
                    trong_diem: 0,
                    khu_vuc: data.region,
                    website: data.web,
                    image_url: data.img
                })
            }
        )
        .then(res => res.json())
        .then(async (result) => {

            console.log("ID trường mới =", result.id);
            console.log("Ngành =", data.majors);

            for (const major of data.majors) {

                await fetch(
                    "http://localhost:5000/api/nganh",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({

                            id_truong: result.id,

                            ten_nganh: major.name,
                            ma_nganh: major.code,

                            he_dao_tao:
                                major.he_dao_tao || "Đại học chính quy",

                            to_hop:
                                major.combo,

                            nam:
                                major.nam || 2025,

                            diem_chuan:
                                major.score,

                            hoc_phi:
                                major.hoc_phi || 0,

                            chi_tieu:
                                major.chi_tieu || 0,

                            phuong_thuc:
                                major.phuong_thuc || "Thi THPT",

                            thang_diem:
                                major.thang_diem || 30,

                            ty_le_viec_lam:
                                major.ty_le_viec_lam || 0,

                            luong_trung_binh:
                                major.luong_trung_binh || 0
                        })
                    }
                );
            }

            await loadSchools();

            renderAdminSchools();
            renderSearchResults();

            closeModal('modal-school');

            showToast(
                'Đã thêm trường thành công!',
                'success'
            );
        })
        .catch(err => {

            console.error(err);

            showToast(
                'Lỗi thêm trường',
                'error'
            );
        });
    }
}

/* --- Xóa trường --- */
async function deleteSchool(id) {

  if (!confirm('Bạn có chắc muốn xóa trường này?')) {
    return;
  }

  try {

    const response = await fetch(
      `http://localhost:5000/api/truong/${id}`,
      {
        method: "DELETE"
      }
    );

    const result = await response.json();

    await loadSchools();

    renderAdminSchools();
    renderSearchResults();

    compareSchools = compareSchools.filter(
      s => s.id !== id
    );

    savedSchools.delete(id);

    showToast(
      result.message,
      "success"
    );

  } catch (error) {

    console.error(error);

    showToast(
      "Lỗi xóa trường",
      "error"
    );
  }
}

function openMajorModal() {
    editingMajorIndex = null;

    document.getElementById("major-name").value = "";
    document.getElementById("major-code").value = "";

    document.getElementById("major-hedao").value =
        "Đại học chính quy";

    document.getElementById("major-year").value =
        2025;

    document.getElementById("major-combo").value = "";

    document.getElementById("major-score").value = "";

    document.getElementById("major-fee").value = "";

    document.getElementById("major-quota").value = "";

    document.getElementById("major-method").value =
        "Thi THPT";

    document.getElementById("major-scale").value =
        30;

    document.getElementById("major-jobrate").value = "";

    document.getElementById("major-salary").value = "";

    document
        .getElementById("modal-major")
        .classList.add("open");
}

function saveMajor() {

    const majorData = {

        name:
            document.getElementById("major-name").value,

        code:
            document.getElementById("major-code").value,

        combo:
            document.getElementById("major-combo").value,

        score:
            parseFloat(
                document.getElementById("major-score").value
            ) || 0,

        he_dao_tao:
            document.getElementById("major-hedao").value,

        nam:
            parseInt(
                document.getElementById("major-year").value
            ) || 2025,

        hoc_phi:
            parseInt(
                document.getElementById("major-fee").value
            ) || 0,

        chi_tieu:
            parseInt(
                document.getElementById("major-quota").value
            ) || 0,

        phuong_thuc:
            document.getElementById("major-method").value,

        thang_diem:
            parseInt(
                document.getElementById("major-scale").value
            ) || 30,

        ty_le_viec_lam:
            parseFloat(
                document.getElementById("major-jobrate").value
            ) || 0,

        luong_trung_binh:
            parseInt(
                document.getElementById("major-salary").value
            ) || 0
    };

    if (editingMajorIndex !== null) {

        tempMajors[editingMajorIndex] = {
            ...tempMajors[editingMajorIndex],
            ...majorData
        };

    } else {

        tempMajors.push(majorData);
    }

    renderMajors();

    editingMajorIndex = null;

    closeModal("modal-major");
}

/* ============================================================
   QUẢN LÝ NGƯỜI DÙNG
   ============================================================ */

function renderAdminUsers(query = '') {
  const q    = query.toLowerCase();
  const list = users.filter(u =>
    !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );

  document.getElementById('admin-user-count').textContent = `${users.length} người dùng trong hệ thống`;
  document.getElementById('admin-users-body').innerHTML = list.map(u => `
    <tr>
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:30px; height:30px; border-radius:8px;
                      background:${u.role === 'admin' ? '#EEF2FF' : '#F3F4F6'};
                      display:flex; align-items:center; justify-content:center; font-size:0.9rem;">
            ${u.role === 'admin' ? '🛡' : '👤'}
          </div>
          <span style="font-weight:600; font-size:0.875rem;">${u.name}</span>
        </div>
      </td>
      <td style="color:var(--text-secondary); font-size:0.875rem;">${u.email}</td>
      <td>
        <select class="role-select" onchange="changeRole(${u.id}, this.value)">
          <option value="student" ${u.role === 'student' ? 'selected' : ''}>Học sinh</option>
          <option value="admin"   ${u.role === 'admin'   ? 'selected' : ''}>Quản trị</option>
        </select>
      </td>
      <td style="color:var(--text-secondary);">${u.school || '—'}</td>
      <td style="color:var(--text-secondary); font-size:0.875rem;">${u.joined}</td>
      <td>
        <button class="action-btn del" onclick="deleteUser(${u.id})" title="Xóa">🗑️</button>
      </td>
    </tr>`).join('');
}

function filterAdminUsers(q) { renderAdminUsers(q); }

function changeRole(id, role) {
  const u = users.find(x => x.id === id);
  if (u) {
    u.role = role;
    showToast('Đã cập nhật vai trò.', 'success');
  }
}

function deleteUser(id) {
  if (id === currentUser.id) {
    showToast('Không thể xóa tài khoản đang đăng nhập!', 'error');
    return;
  }
  if (!confirm('Xóa người dùng này?')) return;
  users = users.filter(u => u.id !== id);
  renderAdminUsers();
  showToast('Đã xóa người dùng.', '');
}
