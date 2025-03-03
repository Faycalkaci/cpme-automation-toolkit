
import React from 'react';
import { 
  Mail, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  FileText, 
  Eye
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface EmailListProps {
  filteredEmails: any[];
  selectedEmails: string[];
  toggleSelectEmail: (id: string) => void;
  viewDocument: (id: string) => void;
  viewEmail: (id: string) => void;
  resendEmail: (id: string) => void;
}

const EmailList: React.FC<EmailListProps> = ({
  filteredEmails,
  selectedEmails,
  toggleSelectEmail,
  viewDocument,
  viewEmail,
  resendEmail,
}) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-slate-50 text-left">
          <th className="p-3 w-[50px] text-slate-500 font-medium text-sm">
            <Checkbox
              checked={false}
              disabled
            />
          </th>
          <th className="p-3 text-slate-500 font-medium text-sm">Destinataire</th>
          <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Entreprise</th>
          <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Type</th>
          <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Date</th>
          <th className="p-3 text-slate-500 font-medium text-sm">Statut</th>
          <th className="p-3 text-slate-500 font-medium text-sm text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredEmails.length > 0 ? (
          filteredEmails.map((email) => (
            <tr key={email.id} className="border-t border-slate-200 hover:bg-slate-50">
              <td className="p-3">
                <Checkbox
                  checked={selectedEmails.includes(email.id)}
                  onCheckedChange={() => toggleSelectEmail(email.id)}
                />
              </td>
              <td className="p-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium text-slate-900">{email.recipient}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 hidden sm:block">{email.subject}</div>
              </td>
              <td className="p-3 hidden md:table-cell text-slate-700">{email.company}</td>
              <td className="p-3 hidden md:table-cell">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  email.documentType === 'Appel de cotisation' ? 'bg-blue-100 text-blue-800' :
                  email.documentType === 'Facture' ? 'bg-green-100 text-green-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {email.documentType}
                </span>
              </td>
              <td className="p-3 hidden md:table-cell text-slate-700">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 text-slate-400 mr-2" />
                  {email.date}
                </div>
              </td>
              <td className="p-3">
                {email.status === 'sent' ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Envoyé
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="h-3 w-3 mr-1" />
                    Échec
                  </span>
                )}
              </td>
              <td className="p-3 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => viewDocument(email.id)}>
                    <FileText className="h-4 w-4 text-slate-700" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => viewEmail(email.id)}>
                    <Eye className="h-4 w-4 text-slate-700" />
                  </Button>
                  {email.status === 'failed' && (
                    <Button variant="ghost" size="icon" onClick={() => resendEmail(email.id)}>
                      <Mail className="h-4 w-4 text-slate-700" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="p-8 text-center">
              <Mail className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun email trouvé</h3>
              <p className="text-slate-500">
                {filteredEmails.length === 0 
                  ? "Aucun email ne correspond à votre recherche." 
                  : "Aucun email n'a été envoyé pour le moment."}
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default EmailList;
