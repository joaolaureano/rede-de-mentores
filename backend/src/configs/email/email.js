import nodemailer from 'nodemailer';

require('dotenv').config();

// Envio de e-mail desligado por padrao: sem SMTP configurado na nuvem (o SES
// nao e gratuito fora dos 12 primeiros meses da conta). EMAIL_ENABLED=true
// religa o Gmail SMTP com EMAIL_ACCOUNT/EMAIL_PASSWORD.
const enabled = process.env.EMAIL_ENABLED === 'true';

// Mesmo formato do transporter do nodemailer que os controllers usam: `use`
// para o handlebars e `sendMail` com callback. O callback recebe sucesso, entao
// as rotas respondem como se o envio tivesse acontecido.
const disabledTransporter = {
  use() {},
  sendMail(options, callback) {
    console.log(`email desativado; nao enviado para ${options.to}: ${options.subject}`);
    if (callback) return callback(null, { skipped: true });
    return Promise.resolve({ skipped: true });
  },
};

const transporter = enabled
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : disabledTransporter;

export default transporter;
