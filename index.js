const express = require('express');
const mailer = require('nodemailer');
let ejs = require('ejs');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;
let mailerConfig = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/sendMail', async (req, res) => {
    console.log(req.body);
    try {
    let { companyLogoUrl, appLink, subject, to } = req.body;

    // Email Template
    let html = await ejs.renderFile(
        './views/basic.ejs', 
        {
            companyLogoUrl,
            appLink,
        },
    );

    // Send mail
    let transporter = mailer.createTransport(mailerConfig);
    let info = await transporter.sendMail(
        {
            from: 'Ilia Silici',
            to: to.join(','),
            subject: subject,
            html: html,
        }
    );

    res.status(200).send(
        { 
            "message": "success", 
            "data": { subject, companyLogoUrl, appLink, to }, 
            "msgId": info.messageId 
        },
    );
} catch(error){
    console.error(error);
        res.status(500).send("An error occurred while sending the email.");
}});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});