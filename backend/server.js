const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db");

db.query("SELECT 1 AS test", (err, result) => {
    if(err){
        console.log(err);
    }else{
        console.log(result);
    }
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("CHI_TEST_123456");
});

app.get("/api/truong", (req, res) => {
    const sql = `
    SELECT
      id_truong,
      ma_truong,
      ten_truong,
      dia_chi,
      loai_hinh,
      khoi_nganh,
      thu_hang,
      trong_diem,
      khu_vuc,
      website,
      image_url
FROM truong_dh
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Lỗi truy vấn dữ liệu"
            });
        }

        res.json(result);
    });
});

app.get("/api/truong/timkiem", (req, res) => {
    const keyword = req.query.q;

    const sql = `
        SELECT *
        FROM truong_dh
        WHERE ten_truong LIKE ?
    `;

    db.query(sql, [`%${keyword}%`], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Lỗi truy vấn dữ liệu"
            });
        }

        res.json(result);
    });
});

app.put("/api/truong/:id", (req, res) => {

    const id = req.params.id;

    const {
    ma_truong,
    ten_truong,
    dia_chi,
    loai_hinh,
    khoi_nganh,
    thu_hang,
    trong_diem,
    khu_vuc,
    website,
    image_url,
    majors
} = req.body;

    const sql = `
        UPDATE truong_dh
        SET
    ma_truong = ?,
    ten_truong = ?,
    dia_chi = ?,
    loai_hinh = ?,
    khoi_nganh = ?,
    thu_hang = ?,
    trong_diem = ?,
    khu_vuc = ?,
    website = ?,
    image_url = ?
        WHERE id_truong = ?
    `;

    db.query(
        sql,
        [
            ma_truong,
    ten_truong,
    dia_chi,
    loai_hinh,
    khoi_nganh,
    thu_hang,
    trong_diem,
    khu_vuc,
    website,
    image_url,
    id
        ],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Loi cap nhat truong"
                });
            }

            res.json({
                message: "Cap nhat thanh cong"
            });
        }
    );
});

app.delete("/api/truong/:id", (req, res) => {

    const id = req.params.id;

    const deleteMajorsSql = `
        DELETE FROM nganh_hoc
        WHERE id_truong = ?
    `;

    db.query(deleteMajorsSql, [id], (err) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Loi xoa nganh hoc"
            });
        }

        const deleteSchoolSql = `
            DELETE FROM truong_dh
            WHERE id_truong = ?
        `;

        db.query(deleteSchoolSql, [id], (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Loi xoa truong"
                });
            }

            res.json({
                message: "Xoa truong thanh cong"
            });
        });
    });
});

app.post("/api/truong", (req, res) => {

    const {
        ma_truong,
        ten_truong,
        dia_chi,
        loai_hinh,
        khoi_nganh,
        thu_hang,
        trong_diem,
        khu_vuc,
        website,
        image_url
    } = req.body;

    const sql = `
        INSERT INTO truong_dh (
            ma_truong,
            ten_truong,
            dia_chi,
            loai_hinh,
            khoi_nganh,
            thu_hang,
            trong_diem,
            khu_vuc,
            website,
            image_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            ma_truong,
            ten_truong,
            dia_chi,
            loai_hinh,
            khoi_nganh,
            thu_hang,
            trong_diem,
            khu_vuc,
            website,
            image_url
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Loi them truong"
                });
            }

            res.json({
                message: "Them truong thanh cong",
                id: result.insertId
            });
        }
    );
});

app.get("/api/truong/:id/nganh", (req, res) => {
    console.log("GOI API NGANH", req.params.id);

    const id = req.params.id;

    const sql = `
    SELECT
        id_nganh,
        id_truong,
        ten_nganh,
        ma_nganh,
        he_dao_tao,
        to_hop,
        nam,
        diem_chuan,
        hoc_phi,
        chi_tieu,
        phuong_thuc,
        thang_diem,
        ty_le_viec_lam,
        luong_trung_binh
    FROM nganh_hoc
    WHERE id_truong = ?
`;

    db.query(sql, [id], (err, result) => {
        console.log("ERR =", err);
        console.log("RESULT =", result);

        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

app.post("/api/nganh", (req, res) => {

    const {
    id_truong,
    ten_nganh,
    ma_nganh,
    he_dao_tao,
    to_hop,
    nam,
    diem_chuan,
    hoc_phi,
    chi_tieu,
    phuong_thuc,
    thang_diem,
    ty_le_viec_lam,
    luong_trung_binh
} = req.body;

   const sql = `
    INSERT INTO nganh_hoc (
        id_truong,
        ten_nganh,
        ma_nganh,
        he_dao_tao,
        to_hop,
        nam,
        diem_chuan,
        hoc_phi,
        chi_tieu,
        phuong_thuc,
        thang_diem,
        ty_le_viec_lam,
        luong_trung_binh
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
    db.query(
        sql,
        [
            id_truong,
            ten_nganh,
            ma_nganh,
            he_dao_tao,
            to_hop,
            nam,
            diem_chuan,
            hoc_phi,
            chi_tieu,
            phuong_thuc,
            thang_diem,
            ty_le_viec_lam,
            luong_trung_binh
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Loi them nganh"
                });
            }

            res.json({
                message: "Them nganh thanh cong",
                id_nganh: result.insertId
            });
        }
    );
});

app.put("/api/nganh/:id", (req, res) => {

    const id = req.params.id;

    const {
    ten_nganh,
    ma_nganh,
    he_dao_tao = "Đại học chính quy",
    to_hop,
    nam,
    diem_chuan,
    hoc_phi,
    chi_tieu,
    phuong_thuc,
    thang_diem,
    ty_le_viec_lam,
    luong_trung_binh
} = req.body;

    const sql = `
    UPDATE nganh_hoc
    SET
        ten_nganh = ?,
        ma_nganh = ?,
        he_dao_tao = ?,
        to_hop = ?,
        nam = ?,
        diem_chuan = ?,
        hoc_phi = ?,
        chi_tieu = ?,
        phuong_thuc = ?,
        thang_diem = ?,
        ty_le_viec_lam = ?,
        luong_trung_binh = ?
    WHERE id_nganh = ?
`;

    db.query(
        sql,
        [
        ten_nganh,
        ma_nganh,
        he_dao_tao,
        to_hop,
        nam,
        diem_chuan,
        hoc_phi,
        chi_tieu,
        phuong_thuc,
        thang_diem,
        ty_le_viec_lam,
        luong_trung_binh,
        id
    ],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Loi cap nhat nganh"
                });
            }

            res.json({
                message: "Cap nhat nganh thanh cong"
            });
        }
    );
});

app.delete("/api/nganh/:id", (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM nganh_hoc
        WHERE id_nganh = ?
    `;

    db.query(
        sql,
        [id],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Loi xoa nganh"
                });
            }

            res.json({
                message: "Xoa nganh thanh cong"
            });
        }
    );
});

app.get("/api/truong/:id", (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT *
        FROM truong_dh
        WHERE id_truong = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Lỗi truy vấn dữ liệu"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy trường"
            });
        }

        res.json(result[0]);
    });
});


const PORT = 5000;

app.post("/api/hoso", (req, res) => {

    const {
        id_nd,
        ho_ten,
        so_dien_thoai,
        truong_thpt,
        tinh_thanh,

        diem_toan,
        diem_ly,
        diem_hoa,
        diem_van,
        diem_anh,
        diem_sinh,
        diem_su,
        diem_dia,
        diem_gdcd,

        nganh_muc_tieu,
        khu_vuc_mong_muon,
        ngan_sach_toi_da
    } = req.body;

    const sql = `
        INSERT INTO ho_so_hoc_sinh (
            id_nd,
            ho_ten,
            so_dien_thoai,
            truong_thpt,
            tinh_thanh,

            diem_toan,
            diem_ly,
            diem_hoa,
            diem_van,
            diem_anh,
            diem_sinh,
            diem_su,
            diem_dia,
            diem_gdcd,

            nganh_muc_tieu,
            khu_vuc_mong_muon,
            ngan_sach_toi_da
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE

            ho_ten = VALUES(ho_ten),
            so_dien_thoai = VALUES(so_dien_thoai),
            truong_thpt = VALUES(truong_thpt),
            tinh_thanh = VALUES(tinh_thanh),

            diem_toan = VALUES(diem_toan),
            diem_ly = VALUES(diem_ly),
            diem_hoa = VALUES(diem_hoa),
            diem_van = VALUES(diem_van),
            diem_anh = VALUES(diem_anh),
            diem_sinh = VALUES(diem_sinh),
            diem_su = VALUES(diem_su),
            diem_dia = VALUES(diem_dia),
            diem_gdcd = VALUES(diem_gdcd),

            nganh_muc_tieu = VALUES(nganh_muc_tieu),
            khu_vuc_mong_muon = VALUES(khu_vuc_mong_muon),
            ngan_sach_toi_da = VALUES(ngan_sach_toi_da)
    `;

    db.query(
        sql,
        [
            id_nd,
            ho_ten,
            so_dien_thoai,
            truong_thpt,
            tinh_thanh,

            diem_toan,
            diem_ly,
            diem_hoa,
            diem_van,
            diem_anh,
            diem_sinh,
            diem_su,
            diem_dia,
            diem_gdcd,

            nganh_muc_tieu,
            khu_vuc_mong_muon,
            ngan_sach_toi_da
        ],
        (err, result) => {

            if (err) {
    console.error("LOI MYSQL:");
    console.error(err);

    return res.status(500).json({
        message: "Loi luu ho so"
    });
}

            res.json({
                message: "Luu ho so thanh cong"
            });
        }
    );
});

app.get("/api/hoso/:id_nd", (req, res) => {

    const id_nd = req.params.id_nd;

    const sql = `
        SELECT *
        FROM ho_so_hoc_sinh
        WHERE id_nd = ?
    `;

    db.query(sql, [id_nd], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Loi lay ho so"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Khong tim thay ho so"
            });
        }

        res.json(result[0]);
    });
});

app.post("/api/login", (req, res) => {

    const { email, mat_khau } = req.body;

    const sql = `
        SELECT *
        FROM tai_khoan
        WHERE email = ?
        AND mat_khau = ?
    `;

    db.query(sql, [email, mat_khau], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Loi server"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Sai email hoac mat khau"
            });
        }

        res.json(result[0]);
    });
});

app.post("/api/register", (req, res) => {

    const {
        ho_ten,
        email,
        mat_khau
    } = req.body;

    const checkSql =
        "SELECT id_nd FROM tai_khoan WHERE email = ?";

    db.query(checkSql, [email], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Loi server"
            });
        }

        if (result.length > 0) {
            return res.status(400).json({
                message: "Email da ton tai"
            });
        }

        const insertSql = `
            INSERT INTO tai_khoan
            (
                ho_ten,
                email,
                mat_khau,
                vai_tro
            )
            VALUES (?, ?, ?, 'HOC_SINH')
        `;

        db.query(
            insertSql,
            [ho_ten, email, mat_khau],
            (err2) => {

                if (err2) {
                    console.error(err2);

                    return res.status(500).json({
                        message: "Khong tao duoc tai khoan"
                    });
                }

                res.json({
                    message: "Dang ky thanh cong"
                });
            }
        );
    });
});

app.listen(PORT, "0.0.0.0", (err) => {
    if (err) {
        console.error("LOI LISTEN:", err);
        return;
    }

    console.log(`Server running on port ${PORT}`);
});