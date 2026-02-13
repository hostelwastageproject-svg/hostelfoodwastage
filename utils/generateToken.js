const jwt = require("jsonwebtoken");

const generateToken = (student) => {
  return jwt.sign(
    {
      id: student.id,
      name: student.name,
      reg_no: student.reg_no,
      food_pref: student.food_pref
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

module.exports = generateToken;
