const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { createObjectCsvWriter } = require("csv-writer");

// ===== Config qua CLI =====
// Cách dùng: node convert.js input.csv output.csv
const inputFile = process.argv[2] || "./data1/hen.csv";
const outputFile = process.argv[3] || "output.csv";

// ===== Helpers làm sạch dữ liệu =====
const cleanText = (v) =>
  (v ?? "")
    .toString()
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim();

const cleanMultilineNumber = (v) => {
  // Ví dụ: "\n    88621\n  " -> "88621"
  const n = (v ?? "").toString().replace(/[^\d]/g, ""); // bỏ mọi ký tự không phải số
  return n ? Number(n) : null;
};

const toSafeString = (v) => (v == null ? "" : String(v));

const normalizeUrl = (v) => {
  const s = cleanText(v);
  if (!s) return "";
  // Bỏ khoảng trắng vô tình chèn trong URL
  return s.replace(/\s+/g, "");
};

// ===== Đầu ra =====
const records = [];
let idCounter = 1;

// ===== Kiểm tra tồn tại file =====
if (!fs.existsSync(inputFile)) {
  console.error(`❌ Không tìm thấy file đầu vào: ${inputFile}`);
  process.exit(1);
}

// ===== Đọc & chuyển đổi =====
let total = 0;
let skipped = 0;

fs.createReadStream(inputFile, { encoding: "utf8" })
  // csv-parser mặc định xử lý đúng CSV có xuống dòng trong ô khi ô được bao bằng dấu "
  .pipe(
    csv({
      mapHeaders: ({ header }) => cleanText(header).toLowerCase(), // chuẩn hoá header
      skipLines: 0,
      strict: false,
      separator: ",",
    })
  )
  .on("data", (row) => {
    total++;

    // Lấy dữ liệu gốc theo đúng header mong đợi
    const name = cleanText(row.name);
    const view = cleanMultilineNumber(row.view);
    const img = normalizeUrl(row.img);
    const year = cleanText(row.year);
    const info = cleanText(row.info);
    const link = normalizeUrl(row.link);

    // Bỏ qua dòng không có tên (hoặc là dòng trống)
    if (!name) {
      skipped++;
      return;
    }

    // Map sang schema mới
    const out = {
      id: idCounter++,
      title: name,
      originalTitle: name,
      category: info || "",          // nếu muốn, có thể tách từ khoá ở đây
      actor: "",                     // chưa có dữ liệu, để trống
      videoLink: link,
      filePath: img,
      // Bạn vẫn còn `view`, `year` nếu cần lưu thêm—nhưng không thuộc schema yêu cầu
      // view, year
    };

    records.push(out);
  })
  .on("end", async () => {
    console.log(`✅ Đọc xong: ${total} dòng (bỏ qua ${skipped}) từ ${inputFile}`);

    const csvWriter = createObjectCsvWriter({
      path: outputFile,
      header: [
        { id: "id", title: "id" },
        { id: "title", title: "title" },
        { id: "originalTitle", title: "originalTitle" },
        { id: "category", title: "category" },
        { id: "actor", title: "actor" },
        { id: "videoLink", title: "videoLink" },
        { id: "filePath", title: "filePath" },
      ],
      // luôn ghi header mới
      append: false,
    });

    try {
      await csvWriter.writeRecords(records);
      console.log(`🎉 Xuất thành công: ${outputFile}`);
      console.log(`📦 Tổng ghi: ${records.length} dòng`);
    } catch (err) {
      console.error("❌ Lỗi ghi file:", err);
      process.exit(1);
    }
  })
  .on("error", (err) => {
    console.error("❌ Lỗi đọc CSV:", err);
    process.exit(1);
  });
