
// Mock email data
export const MOCK_EMAILS = [
  {
    id: '1',
    recipient: 'jean.dupont@example.com',
    company: 'Dupont SAS',
    subject: 'Appel de cotisation CPME',
    date: '12/03/2023',
    status: 'sent',
    documentType: 'Appel de cotisation'
  },
  {
    id: '2',
    recipient: 'sophie.martin@example.com',
    company: 'Martin & Co',
    subject: 'Facture CPME #2023-045',
    date: '10/03/2023',
    status: 'sent',
    documentType: 'Facture'
  },
  {
    id: '3',
    recipient: 'pierre.dubois@example.com',
    company: 'Dubois SARL',
    subject: 'Rappel de cotisation CPME',
    date: '05/03/2023',
    status: 'failed',
    documentType: 'Rappel de cotisation'
  },
  {
    id: '4',
    recipient: 'julie.lefevre@example.com',
    company: 'Lefevre Inc',
    subject: 'Appel de cotisation CPME',
    date: '01/03/2023',
    status: 'sent',
    documentType: 'Appel de cotisation'
  }
];

export type Email = typeof MOCK_EMAILS[0];
