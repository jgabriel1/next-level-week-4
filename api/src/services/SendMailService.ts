import nodemailer, { Transporter } from 'nodemailer';

interface ISendMailData {
  to: string;
  subject: string;
  body: string;
}

export class SendMailService {
  private client: Transporter;

  private constructor(client: Transporter) {
    this.client = client;
  }

  public async execute({ to, subject, body }: ISendMailData) {
    const message = await this.client.sendMail({
      to,
      subject,
      html: body,
      from: 'NPS <noreplay@nps.com.br>',
    });

    console.log(`Message sent: ${message.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }

  private static instance: SendMailService;

  private static async create(): Promise<void> {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    this.instance = new SendMailService(transporter);
  }

  public static async getInstance(): Promise<SendMailService> {
    if (!this.instance) {
      await this.create();
    }

    return this.instance;
  }
}
