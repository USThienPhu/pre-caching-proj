# ==============================================================================
# HƯỚNG DẪN CHẠY UNSLOTH / VLLM SERVER TRÊN GOOGLE COLAB
# ĐỂ ĐO LƯỜNG PROMPT CACHING (KV CACHE REUSE)
# ==============================================================================

### BƯỚC 1: Mở Google Colab (chọn Runtime -> T4 GPU miễn phí)

### BƯỚC 2: Chạy ô code sau để cài đặt vLLM (hỗ trợ Unsloth & KV Cache reuse mặc định)
```bash
!pip install vllm pyngrok
```

### BƯỚC 3: Tạo đường hầm (Tunnel) qua Ngrok hoặc Cloudflare
(Nếu dùng Ngrok, đăng ký tài khoản miễn phí tại ngrok.com lấy authtoken)
```python
from pyngrok import ngrok
import getpass

# Nhập authtoken ngrok của bạn (hoặc điền trực tiếp)
NGROK_TOKEN = getpass.getpass("Nhập Ngrok Authtoken: ")
ngrok.set_auth_token(NGROK_TOKEN)

# Mở tunnel tới cổng 8000 của vLLM
tunnel = ngrok.connect(8000)
print(f"👉 PUBLIC URL CỦA BẠN: {tunnel.public_url}/v1")
print("Hãy copy URL trên dán vào biến COLAB_VLLM_BASE_URL trong file .env!")
```

### BƯỚC 4: Khởi động vLLM Server với tính năng Prompt Caching (--enable-prefix-caching)
vLLM hỗ trợ tự động tái sử dụng KV Cache cực mạnh bằng cờ `--enable-prefix-caching`:
```bash
!python3 -m vllm.entrypoints.openai.api_server \
    --model unsloth/Llama-3.2-3B-Instruct \
    --port 8000 \
    --enable-prefix-caching \
    --max-model-len 4096 \
    --gpu-memory-utilization 0.90
```

### BƯỚC 5: Chạy lệnh đo lường trên máy cá nhân của bạn
Mở terminal tại máy tính của bạn và gõ:
```bash
npm run measure
```
Script trên máy tính sẽ gọi qua tunnel tới máy ảo Colab, đo đạc độ trễ giữa:
- Lần 1: Cache Miss (Prompt evaluation từ đầu)
- Lần 2: Prefix Cache Hit (Tái sử dụng KV Cache từ GPU của Colab)
