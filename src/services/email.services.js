const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.CLIENT_ID) {
      throw new Error('Email credentials not configured. Please set up environment variables.');
    }

    const info = await transporter.sendMail({
      from: `"Backend-ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error; // Re-throw to propagate to controller
  }
};

async function sendRegistrationEmail(userEmail, username) {
    const subject = 'Welcome to Backend ledger';
    const text = `Hello ${username}, \n\n Thank you for registering at Backend-ledger.We're excited to have you on board! \n\nBest regards,\nThe Backend Ledger Team`;
    const html = `<p>Hello ${username},</p><p>Thank you for registering at Backend-ledger.We're excited to have you on board!</p><p>Best regards,<br>The Backend Ledger Team</p>`;
    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail,username,amount,toAccount) {
  const subject = 'Transaction Alert';
  const text = `Hello ${username}, \n\n Your transaction of ${amount} to ${toAccount} is successfull. \n\nIf it wasnot you please contact us. \n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${username},</p><p>Your transaction of ${amount} to ${toAccount} is successfull. </p><p>If it wasnot you please contact us. </p><p>Best regards,<br>The Backend Ledger Team </p>`;
  await sendEmail(userEmail,subject,text,html);
}

async function sendFailedTransactionEmail(userEmail,username,amount,toAccount) {
  const subject = 'Transaction Alert';
  const text = `Hello ${username}, \n\n Your transaction of ${amount} to ${toAccount} is unsuccessfull. \n\nIf it wasnot you please contact us. \n\nBest regards,\nThe Backend Ledger Team`;
  const html = `<p>Hello ${username},</p><p>Your transaction of ${amount} to ${toAccount} is unsuccessfull. </p><p>If it wasnot you please contact us. </p><p>Best regards,<br>The Backend Ledger Team </p>`;
  await sendEmail(userEmail,subject,text,html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendFailedTransactionEmail
};