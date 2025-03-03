
import React from 'react';
import { FileText, Calendar, Download, Mail, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Document } from './types';

interface DocumentTableProps {
  documents: Document[];
  selectedDocs: string[];
  toggleSelectDocument: (id: string) => void;
  selectAllDocuments: () => void;
  onViewDocument: (id: string) => void;
  onDownloadDocument: (id: string) => void;
  onSendEmail: (id: string) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  selectedDocs,
  toggleSelectDocument,
  selectAllDocuments,
  onViewDocument,
  onDownloadDocument,
  onSendEmail
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 text-left">
            <th className="p-3 w-[50px] text-slate-500 font-medium text-sm">
              <Checkbox
                checked={selectedDocs.length === documents.length && documents.length > 0}
                onCheckedChange={selectAllDocuments}
              />
            </th>
            <th className="p-3 text-slate-500 font-medium text-sm">Document</th>
            <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Entreprise</th>
            <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Type</th>
            <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Date</th>
            <th className="p-3 text-slate-500 font-medium text-sm hidden md:table-cell">Taille</th>
            <th className="p-3 text-slate-500 font-medium text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <tr key={doc.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="p-3">
                  <Checkbox
                    checked={selectedDocs.includes(doc.id)}
                    onCheckedChange={() => toggleSelectDocument(doc.id)}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <span className="font-medium text-slate-900 line-clamp-1">{doc.name}</span>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell text-slate-700">{doc.company}</td>
                <td className="p-3 hidden md:table-cell">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    doc.type === 'Appel de cotisation' ? 'bg-blue-100 text-blue-800' :
                    doc.type === 'Facture' ? 'bg-green-100 text-green-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.type}
                  </span>
                </td>
                <td className="p-3 hidden md:table-cell text-slate-700">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 text-slate-400 mr-2" />
                    {doc.date}
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell text-slate-700">{doc.size}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onViewDocument(doc.id)}>
                      <Eye className="h-4 w-4 text-slate-700" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDownloadDocument(doc.id)}>
                      <Download className="h-4 w-4 text-slate-700" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onSendEmail(doc.id)}>
                      <Mail className="h-4 w-4 text-slate-700" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-8 text-center">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">Aucun document trouvé</h3>
                <p className="text-slate-500">
                  {/* Show different message based on whether user is searching */}
                  Générez des documents à partir de vos données pour les voir apparaître ici.
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
