const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const nodemailer = require('nodemailer');

// Create a transporter using Outlook SMTP settings
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail's built-in service
  auth: {
    user: process.env.EMAIL, // Your Gmail address (e.g., your-email@gmail.com)
    pass: process.env.PASSWORD, // Your Gmail password or app-specific password
  },
  tls: {
    rejectUnauthorized: false, // This is important to avoid SSL issues
  },
});

const registerUser = async (firstName, lastName, email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    isVerified: false, // Initially set the user as not verified
  });

  // Save the user first
  await user.save();

  // Generate the verification token and save it in the user's document
  const verificationToken = generateVerificationToken(user._id);
  user.verificationToken = verificationToken; // Store the token in the user's record
  await user.save(); // Save the updated user with the verification token

  // Send the verification email with the token
  await sendVerificationEmail(user.email, verificationToken);

  return {
    message: "User registered. Please check your email for verification.",
  };
};


const generateVerificationToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
};

const sendVerificationEmail = async (userEmail, verificationToken) => {
  const verificationUrl = `http://localhost:5173/VerifyEmail?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: 'Email Verification',
    text: `Hello,\n\nPlease verify your email address by clicking the following link: \n\n${verificationUrl}\n\nIf you did not request this, please ignore this email.\n\nBest Regards,\nYour Company Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to', userEmail);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending verification email');
  }
};


const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
 // Check if the user is verified
 if (!user.isVerified) {
  return res.status(400).json({ message: 'Email not verified. Please check your inbox.' });
}
  return generateToken(user._id);
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  registerUser,
  loginUser,
};
