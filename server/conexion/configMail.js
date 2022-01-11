const nodemailer = require ('nodemailer');

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'dahdhenao@gmail.com', // generated ethereal user
      pass: 'bybi zprm fkfw voiy', // generated ethereal password
    },
});
transporter.verify().then(() => {
    console.log('ready for send mails')
})