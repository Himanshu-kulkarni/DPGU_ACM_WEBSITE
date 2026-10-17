export type TransactionalEmailType = 
  | 'REGISTRATION_CONFIRMED'
  | 'PAYMENT_PENDING'
  | 'REGISTRATION_CANCELLED'
  | 'PAYMENT_FAILED';

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: 'resend' | 'local_mock';
  timestamp: string;
}

export interface EmailLogEntry {
  id: string;
  to: string;
  subject: string;
  type: TransactionalEmailType;
  provider: string;
  status: 'SENT' | 'FAILED';
  error?: string;
  sentAt: string;
}
