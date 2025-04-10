import { Injectable, Logger } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import {
  emailVerificationHTMLTemplate,
  eventRSVPHTMLTemplate,
  eventRSVPUpdateHTMLTemplate,
  passwordResetHTMLTemplate,
} from './constant';

@Injectable()
export class SendgridService {
  private readonly logger = new Logger(SendgridService.name);

  constructor() {
    SendGrid.setApiKey(process.env.SEND_GRID_API_KEY);
  }

  async send(mail: SendGrid.MailDataRequired) {
    const transport = await SendGrid.send(mail);
    this.logger.log(`E-mail sent to ${mail.to}`);

    return transport;
  }

  async sendEmailVerificationLink({
    email,
    token,
    name,
    callbackUrl,
  }: {
    email: string;
    token: string;
    name: string;
    callbackUrl: string;
  }) {
    const verificationLink = `${callbackUrl}/auth/email-verification?token=${token}`;

    const mail = {
      to: email,
      from: 'algorandafrica@algorand.foundation',
      subject: 'Email Verification',
      html: emailVerificationHTMLTemplate(verificationLink, name),
    };

    return this.send(mail);
  }

  async sendPasswordResetLink({
    email,
    token,
    name,
    callbackUrl,
  }: {
    email: string;
    token: string;
    name: string;
    callbackUrl: string;
  }) {
    const resetLink = `${callbackUrl}/auth/reset-password?token=${token}`;

    const mail = {
      to: email,
      from: 'algorandafrica@algorand.foundation',
      subject: 'Password Reset',
      html: passwordResetHTMLTemplate(resetLink, name),
    };

    return this.send(mail);
  }

  async sendEventRSVP({
    email,
    eventName,
    eventLink,
  }: {
    email: string;
    eventName: string;
    eventLink: string;
  }) {
    const mail = {
      to: email,
      from: 'algorandafrica@algorand.foundation',
      subject: 'Event Registration Confirmation',
      html: eventRSVPHTMLTemplate(eventName, eventLink),
    };

    return this.send(mail);
  }

  async sendEventRSVPUpdate({
    email,
    eventName,
    newEventLink,
  }: {
    email: string;
    eventName: string;
    newEventLink: string;
  }) {
    const mail = {
      to: email,
      from: 'algorandafrica@algorand.foundation',
      subject: 'Event Registration Update',
      html: eventRSVPUpdateHTMLTemplate(eventName, newEventLink),
    };

    return this.send(mail);
  }
}
