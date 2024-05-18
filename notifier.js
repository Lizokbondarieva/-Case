const db = require('./db');
const axios = require('axios');
const nodemailer = require('nodemailer');

const FROM_EMAIL = 'your_email@gmail.com';
const FROM_PASSWORD = 'your_email_password';
const SMTP_SERVER = 'smtp.gmail.com';
const SMTP_PORT = 587;

const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: FROM_EMAIL,
        pass: FROM_PASSWORD,
    },
});

const sendEmail = (toEmail, subject, message) => {
    const mailOptions = {
        from: FROM_EMAIL,
        to: toEmail,
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

const getUsdToUah = async () => {
    const apiUrl = 'https://openexchangerates.org/api/latest.json';
    const apiKey = 'YOUR_API_KEY';
    const response = await axios.get(`${apiUrl}?app_id=${apiKey}&symbols=UAH`);
    return response.data.rates.UAH;
};

const checkAndNotify = async () => {
    const currentRate = await getUsdToUah();
    db.all('SELECT email FROM subscriptions', [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            sendEmail(row.email, 'USD to UAH Rate', `The current USD to UAH rate is ${currentRate}`);
        });
    });
};

const scheduleDailyEmail = () => {
    const now = new Date();
    const nextRun = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        9, 0, 0, 0
    );

    const delay = nextRun - now;

    setTimeout(() => {
        checkAndNotify();
        setInterval(checkAndNotify, 24 * 60 * 60 * 1000);
    }, delay);
};

scheduleDailyEmail();
