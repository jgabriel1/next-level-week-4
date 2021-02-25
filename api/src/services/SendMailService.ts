import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

interface ISendMailData<V> {
  to: string;
  subject: string;
  templatePath: string;
  variables: V;
}

export class SendMailService {
  private client: Transporter;

  private constructor(client: Transporter) {
    this.client = client;
  }

  public async execute<V = any>({
    to,
    subject,
    variables,
    templatePath,
  }: ISendMailData<V>) {
    const templateFileContent = fs.readFileSync(templatePath).toString('utf-8');
    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
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
