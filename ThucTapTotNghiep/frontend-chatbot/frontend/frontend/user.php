<?php
/**
 * =========================================================================
 * File: user.php
 * Mô tả: Xử lý logic hiển thị nội dung riêng biệt và phân quyền cho từng loại tài khoản:
 *        - Nếu đăng nhập là ADMIN -> Tự động chuyển hướng vào trang quản trị (Admin Dashboard).
 *        - Nếu đăng nhập là USER (Thí sinh) -> Hiển thị cổng thông tin cá nhân của thí sinh.
 * =========================================================================
 */

// 1. Khởi động phiên làm việc (Session)
session_start();

// 2. Bước 1: Kiểm tra xem người dùng đã đăng nhập hay chưa
if (!isset($_SESSION['user']) || empty($_SESSION['user'])) {
    // Chưa đăng nhập -> Chuyển hướng về trang đăng nhập
    header("Location: login.php");
    exit();
}

// 3. Bước 2: Lấy thông tin tài khoản và vai trò (Role)
$currentUser = $_SESSION['user'];
$userRole = strtolower($currentUser['role'] ?? 'user');
$userName = htmlspecialchars($currentUser['name'] ?? 'Thí sinh');
$userEmail = htmlspecialchars($currentUser['email'] ?? '');

// 4. Bước 3: Logic PHÂN QUYỀN (RBAC Check)
// Nếu vai trò là ADMIN hoặc CÁN BỘ QUẢN LÝ -> Chuyển sang trang quản trị Admin
if ($userRole === 'admin' || $userRole === 'manager') {
    header("Location: admin_dashboard.php"); // hoặc trang quản trị /dashboard
    exit();
}

// 5. Bước 4: Xử lý dữ liệu hiển thị riêng biệt cho USER (Thí sinh)
// Dữ liệu hồ sơ mẫu của thí sinh (Trong thực tế sẽ truy vấn từ CSDL MySQL / Firestore)
$candidateProfile = [
    'candidateCode' => 'TS2026-8899',
    'fullName' => $userName,
    'email' => $userEmail,
    'phone' => '0912 345 678',
    'selectedMajor' => 'Công nghệ Thông tin (CNTT & AI)',
    'admissionMethod' => 'Xét học bạ THPT (Tổ hợp A00, A01)',
    'totalScore' => 26.75,
    'applicationStatus' => 'submitted', // submitted, reviewing, accepted, enrolled
    'paymentStatus' => 'paid',
    'submissionDate' => date('d/m/Y')
];

// Hàm format nhãn trạng thái hồ sơ
function getStatusBadge($status) {
    switch ($status) {
        case 'accepted':
            return '<span class="badge badge-success">✓ ĐÃ TRÚNG TUYỂN SỚM</span>';
        case 'reviewing':
            return '<span class="badge badge-warning">⏳ ĐANG THẨM ĐỊNH HỌC BẠ</span>';
        case 'submitted':
        default:
            return '<span class="badge badge-info">📄 HỒ SƠ ĐÃ TIẾP NHẬN</span>';
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cổng Thông Tin Thí Sinh | Hệ Thống Tuyển Sinh 2026</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        body {
            background-color: #f8fafc;
            color: #1e293b;
            min-height: 100vh;
        }
        /* Thanh điều hướng */
        .navbar {
            background-color: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 700;
            color: #2563eb;
            font-size: 1.15rem;
        }
        .user-nav-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .role-pill {
            background-color: #dbeafe;
            color: #1d4ed8;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        .btn-logout {
            background-color: #f1f5f9;
            color: #475569;
            padding: 0.4rem 0.85rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 600;
            border: 1px solid #cbd5e1;
        }
        .btn-logout:hover {
            background-color: #e2e8f0;
        }
        /* Nội dung chính */
        .container {
            max-width: 1080px;
            margin: 2rem auto;
            padding: 0 1.5rem;
        }
        .welcome-card {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: #ffffff;
            padding: 2rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .welcome-card h1 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        .welcome-card p {
            font-size: 0.9rem;
            color: #bfdbfe;
        }
        .grid-layout {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
        }
        @media (max-width: 768px) {
            .grid-layout {
                grid-template-columns: 1fr;
            }
        }
        .card {
            background-color: #ffffff;
            border-radius: 0.875rem;
            border: 1px solid #e2e8f0;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            margin-bottom: 1.5rem;
        }
        .card-title {
            font-size: 1rem;
            font-weight: 700;
            margin-bottom: 1.25rem;
            color: #0f172a;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 0.75rem;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 0.6rem 0;
            font-size: 0.875rem;
            border-bottom: 1px dashed #f1f5f9;
        }
        .info-label {
            color: #64748b;
        }
        .info-val {
            font-weight: 600;
            color: #1e293b;
        }
        .badge {
            display: inline-block;
            padding: 0.25rem 0.6rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 700;
        }
        .badge-success { background: #dcfce7; color: #15803d; }
        .badge-warning { background: #fef3c7; color: #b45309; }
        .badge-info { background: #e0f2fe; color: #0369a1; }
        .action-btn {
            display: block;
            width: 100%;
            text-align: center;
            background-color: #2563eb;
            color: #ffffff;
            padding: 0.75rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.875rem;
            margin-top: 1rem;
        }
        .action-btn:hover {
            background-color: #1d4ed8;
        }
    </style>
</head>
<body>

    <!-- Header Navbar -->
    <header class="navbar">
        <div class="brand">
            🎓 CỔNG THÔNG TIN THÍ SINH (USER PORTAL)
        </div>
        <div class="user-nav-info">
            <a href="index.html" class="btn-logout" style="background:#2563eb; color:#fff; border:none;">← Trang Chủ</a>
            <span class="role-pill">Vai trò: <?php echo htmlspecialchars($userRole); ?></span>
            <span style="font-size: 0.875rem; font-weight: 600;"><?php echo $userName; ?></span>
            <a href="logout.php" class="btn-logout">Đăng xuất</a>
        </div>
    </header>

    <div class="container">
        <!-- Banner chào mừng -->
        <div class="welcome-card">
            <h1>Xin chào, <?php echo $userName; ?>! 👋</h1>
            <p>Hệ thống tự động nhận diện tài khoản THÍ SINH (USER) và hiển thị hồ sơ cá nhân, tiến độ thẩm định kết quả xét tuyển 2026.</p>
        </div>

        <div class="grid-layout">
            <!-- Cột trái: Thông tin hồ sơ xét tuyển -->
            <div>
                <div class="card">
                    <h2 class="card-title">Hồ Sơ Đăng Ký Xét Tuyển Đại Học 2026</h2>
                    <div class="info-row">
                        <span class="info-label">Mã số hồ sơ thí sinh:</span>
                        <span class="info-val"><?php echo $candidateProfile['candidateCode']; ?></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Ngành đăng ký xét tuyển:</span>
                        <span class="info-val"><?php echo $candidateProfile['selectedMajor']; ?></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Phương thức xét tuyển:</span>
                        <span class="info-val"><?php echo $candidateProfile['admissionMethod']; ?></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Tổng điểm xét tuyển học bạ:</span>
                        <span class="info-val" style="color: #2563eb; font-size: 1rem;"><?php echo $candidateProfile['totalScore']; ?> / 30.00</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Trạng thái thẩm định:</span>
                        <span class="info-val"><?php echo getStatusBadge($candidateProfile['applicationStatus']); ?></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Lệ phí xét tuyển (300.000 VNĐ):</span>
                        <span class="info-val" style="color: #16a34a;">✓ ĐÃ HOÀN TẤT QUA VNPAY</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Ngày nộp hồ sơ:</span>
                        <span class="info-val"><?php echo $candidateProfile['submissionDate']; ?></span>
                    </div>
                </div>
            </div>

            <!-- Cột phải: Hỗ trợ & Liên hệ -->
            <div>
                <div class="card">
                    <h2 class="card-title">Cán Bộ Tư Vấn Phụ Trách</h2>
                    <p style="font-size: 0.85rem; color: #475569; margin-bottom: 0.75rem;">
                        <strong>ThS. Nguyễn Văn Toàn</strong><br>
                        Trưởng ban Tư vấn Khối ngành Công nghệ<br>
                        Hotline: 1900 6868 (Nhánh 1)<br>
                        Email: toannv@admission.edu.vn
                    </p>
                    <a href="chatbot.php" class="action-btn">💬 Chat Trực Tiếp Với AI Tuyển Sinh</a>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
