const nodemailer = require("nodemailer");
require("dotenv").config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "send.mailer.lab@gmail.com",
        pass: "waliquavihgfluli",
      },
    });
  }

  async sendPasswordMail(to, newPassword) {
    console.log(to);
    await this.transporter.sendMail({
      from: "send.mailer.lab@gmail.com",
      to,
      subject: "New password",
      text: "",
      html: `
        <div>
          <h1>
            Your new password:
            <span style="font-style: italic;">${newPassword}</span>
          </h1>
        </div>
      `,
    });
  }
}

module.exports = new MailService();
