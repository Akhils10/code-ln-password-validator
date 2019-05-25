const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');

export default function EmailSender(receiver, subject, msg){
  const auth = {
    auth: {
      api_key: '52b0ea77-c4130739',
      domain: 'sandbox2336efb54c7c4886bf18e9e4044c5733.mailgun.org'
    }
  }
    let transporter = nodemailer.createTransport( mailgun(auth) );
      
    let mailOptions = {
      from: 'Excited user <philip@Codeln_test.com>',
      to: receiver,
      subject: subject,
      text: msg
    };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
