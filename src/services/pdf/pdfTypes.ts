
export interface TemplateField {
  name: string;
  placeholder: string;
}

export const DEFAULT_FIELD_MAPPINGS: TemplateField[] = [
  { name: "DATE ECHEANCE", placeholder: "{{DATE ECHEANCE}}" },
  { name: "Cotisation", placeholder: "{{Cotisation}}" },
  { name: "N° adh", placeholder: "{{N° adh}}" },
  { name: "SOCIETE", placeholder: "{{SOCIETE}}" },
  { name: "Dirigeant", placeholder: "{{Dirigeant}}" },
  { name: "E MAIL 1", placeholder: "{{E MAIL 1}}" },
  { name: "E Mail 2", placeholder: "{{E Mail 2}}" },
  { name: "Adresse", placeholder: "{{Adresse}}" },
  { name: "ville", placeholder: "{{ville}}" }
];
