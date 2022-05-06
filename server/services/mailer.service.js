const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const { Service } = require("../core");
const { resolve } = require("path");

class MailerService extends Service {
  _transporter;

  constructor() {
    super();
    this.configTransporter();
    this.configUseTemplate();
  }

  configTransporter() {
    this._transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      // host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });
  }

  configUseTemplate() {
    this._transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          layoutsDir: resolve(__dirname, "../views/layouts"),
          partialsDir: resolve(__dirname, "../views/partials"),
        },
        viewPath: resolve(__dirname, "../views"),
        extName: ".hbs",
      })
    );
  }

  async sendEmail({ to, subject, template, context, attachments }) {
    return await this._transporter.sendMail({
      from: '"Mern Stack 👻" truongdq.dev@gmail.com', // sender address
      to,
      subject,
      template,
      context,
      attachments,
    });
  }
}

module.exports = new MailerService();
