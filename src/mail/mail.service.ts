import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger('MailService');
  constructor(private readonly mailerService: MailerService) {}

  async sendMail({ to, subject, html }: SendMailDto): Promise<void> {
    try {
      await this.mailerService.sendMail({ to, subject, html });
      this.logger.log(`Email sent to ${to} with subject "${subject}"`);
    } catch (error) {
      this.logger.error(`Error sending email to ${to}: ${error.message}`);
      throw error;
    }
  }
}
