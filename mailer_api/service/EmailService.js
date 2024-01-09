const nodemailer = require('nodemailer');
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.APP_PASS //Your gmail App-Password
  }
});

const emailTemplate = (message, recipient) => ({
  from: process.env.SENDER_MAIL,
  to: recipient,
  subject: 'You get Text Message from Your App!',
  text: message
});

const sendMails = ({message, emailList}) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (const recipient of emailList) {
                const mailOptions = emailTemplate(message, recipient);
        
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${recipient}`);
            }
            resolve("Success")
        } catch (error) {
            console.error('Error sending emails:', error.message);
            reject(error.message)
        }
    })
};

exports.sendMails = sendMails;