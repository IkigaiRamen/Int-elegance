// mailer.js
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

// Function to send an invite email
const sendInviteEmail = async (userEmail, companyName, creatorName) => {
  const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: `Invitation to Join ${companyName}`,
        text: `Hello,\n\nYou have been invited by ${creatorName} to join the company "${companyName}".\n\nBest Regards,\nCompany Team`,
    };


  return transporter.sendMail(mailOptions); // Send email
};


const sendVerificationEmail = async (userEmail, verificationToken) => {
  const verificationUrl = `http://localhost:5000/api/users/verify-email?token=${verificationToken}`;

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




module.exports = { sendInviteEmail,  sendVerificationEmail,
};
