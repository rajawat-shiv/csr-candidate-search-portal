const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "admin@csr.com";
const ADMIN_PASSWORD = "Admin@123";

const login = (req, res) => {
  const { email, password } = req.body;

  if (
    email !== ADMIN_EMAIL ||
    password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  console.log(process.env.JWT_SECRET);
  const token = jwt.sign(
    {
      email,
      role: "admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.json({
    success: true,
    token,
  });
};

module.exports = {
  login,
};