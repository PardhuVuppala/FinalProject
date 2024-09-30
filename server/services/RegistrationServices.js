
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587, 
    secure: false, 
    auth: {
        user: 'pardhuvuppala',
        pass: "vrglfejbdissytzl" 
    }
});

const sendMail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: `"Task Management Website" <${process.env.EMAIL_USER}>`, 
            to, 
            subject,
            text 
        });

        console.log('Message sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendMail
};