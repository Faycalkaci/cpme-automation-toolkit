
import { ParsedRow } from './csv-utils';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface EmailAttachment {
  filename: string;
  content: Blob;
}

export interface EmailResult {
  success: boolean;
  message: string;
  recipient: string;
}

/**
 * Mock function to send email (would be replaced with a real service)
 */
export const sendEmail = async (
  to: string,
  subject: string,
  body: string,
  attachments: EmailAttachment[] = []
): Promise<EmailResult> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate email format
  if (!to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return {
      success: false,
      message: 'Adresse email invalide',
      recipient: to
    };
  }
  
  // In a real implementation, this would call an API endpoint
  console.log(`Email sent to ${to}`, { subject, body, attachments });
  
  return {
    success: true,
    message: 'Email envoyé avec succès',
    recipient: to
  };
};

/**
 * Send emails in bulk
 */
export const sendBulkEmails = async (
  rows: ParsedRow[],
  emailField: string,
  emailTemplate: EmailTemplate,
  attachments: Record<string, EmailAttachment[]> = {}
): Promise<EmailResult[]> => {
  const results: EmailResult[] = [];
  
  for (const row of rows) {
    const email = row[emailField];
    
    if (!email) {
      results.push({
        success: false,
        message: 'Adresse email manquante',
        recipient: 'inconnu'
      });
      continue;
    }
    
    // Replace template variables with values from row
    let subject = emailTemplate.subject;
    let body = emailTemplate.body;
    
    Object.keys(row).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, row[key] || '');
      body = body.replace(regex, row[key] || '');
    });
    
    // Get attachments for this row
    const rowAttachments = attachments[email] || [];
    
    // Send email
    const result = await sendEmail(email, subject, body, rowAttachments);
    results.push(result);
  }
  
  return results;
};
