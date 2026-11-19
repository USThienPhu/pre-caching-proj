# Báo Cáo Seminar: Nghiên Cứu Thực Nghiệm Về Prompt Caching & Tái Sử Dụng KV Cache Trong Ứng Dụng Web

> **Môn học**: CSC13114 - Phát triển Ứng dụng Web Nâng cao (CQ2023/3)  
> **Mã đề tài**: B5 - Cắt giảm chi phí mô hình: routing, prompt caching, batching  
> **Kho lưu trữ (Repository)**: [https://github.com/USThienPhu/pre-caching-proj](https://github.com/USThienPhu/pre-caching-proj)  
> **Thành viên nhóm**:
> * Trương Thành Phát — 23120319
> * Thái Thiên Phú — 23120327
> * Huỳnh Lê Minh Triết — 23120380

---

## 1. Hướng Dẫn Tái Lập Thực Nghiệm (Quick Start)

Bất kỳ ai (giảng viên chấm bài hoặc nhóm phản biện Red-team) khi tải mã nguồn này về máy đều có thể chạy lại toàn bộ quy trình đo lường bằng **đúng một lệnh duy nhất**, không bắt buộc phải có GPU hay API key trả phí.

### Yêu cầu môi trường
* **Node.js**: Phiên bản 18.0.0 trở lên (hỗ trợ tốt trên Windows, Linux và macOS).

### Các bước thực hiện
```bash
# 1. Clone repository về máy
git clone https://github.com/USThienPhu/pre-caching-proj.git
cd pre-caching-proj

# 2. Cài đặt các gói phụ thuộc (dotenv)
npm install

# 3. Chạy lệnh đo lường tái lập duy nhất
npm run measure
```

---

## 2. Hai Chế Độ Chạy Đo Lường

### Chế độ A: Chạy Replay từ Log Thực Tế (Mặc định / Dành cho Chấm bài & Red-Team)
* **Khi không có file `.env` (hoặc comment toàn bộ các dòng trong `.env`)**:
  * Hệ thống sẽ **tự động kích hoạt Chế độ Replay (Phát lại)**.
  * Script sẽ đọc trực tiếp dữ liệu phản hồi thô (raw logs) đã được ghi lại trong thư mục [`results/`](./results).
  * Tự động tính toán lại toàn bộ các chỉ số: **Trung vị (Median)**, **Độ phân tán (Spread min-max)**, **% Độ trễ giảm được** và **% Chi phí tiết kiệm được**.
  * Giúp người chấm và Red-team kiểm chứng kết quả ngay lập tức mà không tốn tiền API, không cần duy trì server GPU và không sợ lỗi mạng.

### Chế độ B: Chạy Live Thực Tế Trên GPU Máy Ảo (Google Colab / vLLM)
* Nếu muốn đo lường trực tiếp với server GPU thực tế (chạy vLLM / Unsloth), bạn chỉ cần tạo file `.env` (dựa trên `.env.example`) và điền thông tin vào đúng các vị trí:
  ```env
  COLAB_VLLM_BASE_URL=https://your-tunnel-url.trycloudflare.com/v1   # URL tunnel từ máy ảo Colab
  COLAB_MODEL_NAME=unsloth/Llama-3.2-3B-Instruct                   # Tên model đang load
  COLAB_API_KEY=EMPTY                                               # API key (mặc định để EMPTY)
  ```
* Khi có đầy đủ cấu hình trên, lệnh `npm run measure` sẽ **bắt buộc chạy thật 100%** qua kết nối mạng, gửi prompt lên GPU để đo đạc và tự động xuất file log mới vào thư mục `results/`.
* **Lưu ý**: Chỉ cần comment (`#`) dòng `COLAB_VLLM_BASE_URL` hoặc xóa file `.env`, hệ thống sẽ lập tức quay về **Chế độ Replay**.

---

## 3. Cấu Trúc Thư Mục Dự Án
```text
.
├── data/
│   └── context.txt           # Bộ dữ liệu system prompt lớn (~1.000 tokens)
├── results/                  # Chứa toàn bộ các file log JSON đo lường thực tế
├── scripts/
│   └── colab_server_guide.md # Hướng dẫn thiết lập vLLM / Unsloth trên Google Colab
├── src/
│   └── measure.js            # Script đo lường tự động (5 runs, tính median, spread)
├── package.json              # Khai báo cấu hình lệnh chạy và dependencies
├── REPORT.md                 # Báo cáo khoa học phân tích chuyên sâu (dưới 3 trang)
├── slides.pdf                # Slide thuyết trình đề tài
├── TALK.md                   # Link video thuyết trình đã ghi hình (dưới 8 phút)
├── AI-LOG.md                 # Nhật ký sử dụng AI và các lỗi phát hiện/sửa đổi
├── SELF_ASSESSMENT_REPORT.md # Báo cáo tự chấm điểm theo barem rubric
└── .env.example              # Mẫu cấu hình môi trường
```
