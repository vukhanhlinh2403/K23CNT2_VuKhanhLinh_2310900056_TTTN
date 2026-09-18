const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendVerificationEmail = async (
  email,
  name,
  token
) => {
  const verifyUrl =
    `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"DeepCode Academy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Xác thực tài khoản",

    html: `
      <h2>Xin chào ${name}</h2>

      <p>
        Cảm ơn bạn đã đăng ký tài khoản.
      </p>

      <p>
        Vui lòng click vào link bên dưới để xác thực email:
      </p>

      <a href="${verifyUrl}">
        Xác thực email
      </a>

      <p>
        Link có hiệu lực trong 15 phút.
      </p>
    `,
  });
};

const sendPasswordResetEmail = async (
  email,
  name,
  token
) => {
  const resetUrl =
    `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"DeepCode Academy" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Đặt lại mật khẩu",

    html: `
      <h2>Xin chào ${name}</h2>

      <p>
        Bạn vừa yêu cầu đặt lại mật khẩu.
      </p>

      <p>
        Click vào link bên dưới:
      </p>

      <a href="${resetUrl}">
        Đặt lại mật khẩu
      </a>

      <p>
        Link có hiệu lực trong 15 phút.
      </p>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
