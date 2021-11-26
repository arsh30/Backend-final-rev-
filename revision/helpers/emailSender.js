const nodemailer = require("nodemailer");
const { APP_PASSWORD } = require("../secret");

module.exports = async function main(token, userEmail) {  //token idr paas krege
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "as3096734@gmail.com", // generated ethereal user
        pass: APP_PASSWORD, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻"', // sender address
      to: "as3096734@gmail.com", // list of receivers
      subject: "Token for reset", // Subject line
      text: "Hello world?", // plain text body
        html: `
        <p> your reset token is
        <br> ${token} <br>
      </p>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
//   main().catch(console.error);