# Melody Store - Premium Musical Instruments & Audio Gear
> **LAB 1 - THIẾT KẾ WEBSITE E-COMMERCE**  
> **Môn học:** Thiết kế Web  
> **Giảng viên hướng dẫn:** Thầy Nguyễn Thiện Dương  
> **Trường:** Trường Đại học Giao thông Vận tải - Phân hiệu tại TP. Hồ Chí Minh (UTC2)  
> **Sinh viên thực hiện:** Lê Võ Đức Huy - MSSV: 6651071098  
> **Live Demo (GitHub Pages):** [https://duchuy-cmd.github.io/WebDesign_MelodyStore/](https://duchuy-cmd.github.io/WebDesign_MelodyStore/)  
> **Backup Live Demo (Vercel):** [https://melodystore-flax.vercel.app/](https://melodystore-flax.vercel.app/)  
> **GitHub Repository:** [https://github.com/DucHuy-cmd/WebDesign_MelodyStore](https://github.com/DucHuy-cmd/WebDesign_MelodyStore)  
> **Video Demo Review Website:** [Xem Video Review (video-demo.mp4)](https://github.com/DucHuy-cmd/WebDesign_MelodyStore/blob/main/Videos/video-demo.mp4)

---

## 🎵 Giới thiệu Đề tài (Project Overview)
**Melody Store** là website thương mại điện tử chuyên cung cấp nhạc cụ chính hãng cao cấp (Đàn Guitar Acoustic & Electric, Đàn Piano & Organ, Trống & Bộ gõ, Thiết bị phòng thu & Thu âm, Phụ kiện âm nhạc).

* Giao diện và các hiệu ứng tương tác đáp ứng **100% theo mẫu template Ogani** của giảng viên.
* Toàn bộ nội dung, mô tả, thông số kỹ thuật, bài viết và thông tin sản phẩm được chuẩn hóa **100% bằng tiếng Anh**.
* Hình ảnh sản phẩm độ phân giải cao, được tối ưu hóa kích thước chuẩn xác.
* **Đặc biệt:** Tích hợp đầy đủ tài nguyên âm thanh (`Sounds/` - `.mp3`) cho tính năng nghe thử chất âm mộc của đàn và video (`Videos/` - `.mp4`) phục vụ video demo sản phẩm tại trang chi tiết.

---

## 📁 Cấu trúc Thư mục chuẩn theo Yêu cầu LAB 1 (Directory Structure)
```
WebDesign_MelodyStore/
│── index.html              # Trang chủ (Hero banner, Carousel, Featured, Latest, Blog, Footer)
│── shop-grid.html          # Danh sách sản phẩm (Lọc theo giá, màu sắc, cấu hình, Sale Off)
│── shop-details.html       # Chi tiết sản phẩm (Thư viện ảnh, Audio test sound, Video demo, Tabs specs)
│── shoping-cart.html       # Giỏ hàng (Bảng sản phẩm, tăng giảm số lượng, coupon, tổng tiền)
│── checkout.html           # Trang thanh toán & đặt hàng (Billing Details Form, tóm tắt đơn)
│── blog.html               # Trang tin tức / bài viết chia sẻ kinh nghiệm âm nhạc
│── blog-details.html       # Chi tiết bài viết hướng dẫn chọn đàn guitar
│── contact.html            # Trang liên hệ (Thông tin, bản đồ Google Map, form gửi tin nhắn)
│── README.md               # Tài liệu thuyết minh đồ án
│
├── Images/                 # Toàn bộ hình ảnh website (.jpg, .png)
│   ├── banner/             # Banner khuyến mãi
│   ├── blog/               # Hình ảnh bài viết blog & tác giả
│   ├── cart/               # Hình ảnh sản phẩm trong giỏ hàng
│   ├── categories/         # Danh mục nhạc cụ slider
│   ├── featured/           # Nhạc cụ nổi bật
│   ├── hero/               # Banner trang chủ
│   ├── latest-product/     # Sản phẩm mới nhất / đánh giá cao
│   └── product/            # Danh mục sản phẩm & chi tiết
│
├── Styles/                 # Toàn bộ file định dạng (.css)
│   ├── bootstrap.min.css
│   ├── elegant-icons.css
│   ├── font-awesome.min.css
│   ├── jquery-ui.min.css
│   ├── nice-select.css
│   ├── owl.carousel.min.css
│   ├── slicknav.min.css
│   └── style.css
│
├── Scripts/                # Toàn bộ file JavaScript (.js)
│   ├── bootstrap.min.js
│   ├── jquery-3.3.1.min.js
│   ├── jquery.nice-select.min.js
│   ├── jquery-ui.min.js
│   ├── jquery.slicknav.js
│   ├── mixitup.min.js
│   ├── owl.carousel.min.js
│   └── main.js
│
├── Sounds/                 # File âm thanh test nhạc cụ (.mp3)
│   ├── acoustic-guitar-sample.mp3
│   └── piano-melody-sample.mp3
│
├── Videos/                 # File video review nhạc cụ & video demo (.mp4)
│   ├── guitar-demo.mp4     # Video demo nhạc cụ mẫu tại trang shop-details
│   └── video-demo.mp4      # Video quay demo và review các tính năng của website
│
└── fonts/                  # Phông chữ FontAwesome & ElegantIcons
```

---

## 🚀 Các tính năng chính (Key Features)
1. **Responsive 100%:** Tương thích hoàn hảo từ màn hình máy tính để bàn (Desktop), máy tính bảng (Tablet) đến điện thoại di động (Mobile Hamburger Menu).
2. **Featured Filter Tabs:** Sử dụng MixItUp lọc mượt mà theo từng dòng nhạc cụ: *All, Guitars, Keyboards, Drums, Studio Gear*.
3. **Interactive Audio & Video Player:** Tích hợp thẻ `<audio>` và `<video>` HTML5 nguyên bản tại trang `shop-details.html` giúp khách hàng nghe thử âm thanh nhạc cụ chân thực trước khi mua.
4. **Interactive Shopping Cart:** Bảng giỏ hàng hiển thị đầy đủ thông tin, tính toán tiền theo thời gian thực và liên kết liền mạch sang bước Check Out.
5. **SEO & Clean Code:** Sử dụng bảng mã UTF-8 Unicode, cấu trúc HTML5 chuẩn ngữ nghĩa, tối ưu tốc độ tải trang.

---

## 🛠 Hướng dẫn triển khai GitHub Pages
1. Push toàn bộ mã nguồn lên nhánh chính `main` (hoặc `master`).
2. Vào tab **Settings** trên GitHub Repository -> chọn mục **Pages** ở menu bên trái.
3. Tại phần **Build and deployment** -> **Source**: Chọn `Deploy from a branch`.
4. Branch: Chọn `main` (hoặc `master`) / folder: `/ (root)`.
5. Bấm **Save**, đợi khoảng 1 phút và truy cập vào link GitHub Pages được cấp.
