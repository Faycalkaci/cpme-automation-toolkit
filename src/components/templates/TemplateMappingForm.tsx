
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, Form } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

interface MappingField {
  pdfField: string;
  csvColumn: string;
}

interface TemplateMappingFormProps {
  templateName: string;
  pdfFields: string[];
  csvColumns: string[];
  onSaveMapping: (mapping: Record<string, string>) => void;
}

const TemplateMappingForm: React.FC<TemplateMappingFormProps> = ({
  templateName,
  pdfFields,
  csvColumns,
  onSaveMapping
}) => {
  const [mappings, setMappings] = useState<MappingField[]>(
    pdfFields.map(field => ({ pdfField: field, csvColumn: '' }))
  );
  
  const form = useForm({
    defaultValues: {
      mappings: pdfFields.reduce((obj, field) => {
        obj[field] = '';
        return obj;
      }, {} as Record<string, string>)
    }
  });

  const handleMappingChange = (pdfField: string, csvColumn: string) => {
    form.setValue(`mappings.${pdfField}`, csvColumn);
  };

  const handleSubmit = (data: { mappings: Record<string, string> }) => {
    onSaveMapping(data.mappings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration du mappage pour "{templateName}"</CardTitle>
        <CardDescription>
          Associez chaque champ du modèle PDF à une colonne de vos données CSV
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {pdfFields.map((field, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Champ PDF</label>
                  <Input disabled value={field} />
                </div>
                <FormField
                  control={form.control}
                  name={`mappings.${field}`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>Colonne CSV</FormLabel>
                      <Select 
                        onValueChange={(value) => handleMappingChange(field, value)}
                        defaultValue={formField.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une colonne" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {csvColumns.map((column, idx) => (
                            <SelectItem key={idx} value={column}>
                              {column}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            ))}
            
            <div className="flex justify-end pt-4">
              <Button type="submit">Enregistrer le mappage</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TemplateMappingForm;
