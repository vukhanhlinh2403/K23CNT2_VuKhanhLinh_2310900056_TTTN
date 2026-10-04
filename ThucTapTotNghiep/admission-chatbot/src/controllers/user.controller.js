// Xử lý các chức năng liên quan đến User

const getUsers = (req, res) => {
    // Công dụng: trả về danh sách User
    res.json({
        success: true,
        message: "Danh sách người dùng"
    });
};

module.exports = {
    getUsers
};