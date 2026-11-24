import type { ComponentDef } from "../types";

const FIELD = { width: "100%" };

/** Checkbox, radio group and file upload. */
export const FORM_EXTRA_COMPONENTS: ComponentDef[] = [
  {
    type: "checkbox",
    label: "Checkbox",
    category: "Forms",
    icon: "checkbox",
    defaultProps: { label: "I agree to the terms and conditions", name: "terms", required: true, checked: false },
    defaultStyles: FIELD,
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "name", label: "Field name", type: "text" },
      { key: "required", label: "Required", type: "toggle" },
      { key: "checked", label: "Ticked by default", type: "toggle" },
    ],
  },
  {
    type: "radio",
    label: "Radio group",
    category: "Forms",
    icon: "radio",
    defaultProps: { label: "Ticket type", name: "ticket", items: ["Student", "Professional", "Alumni"], required: false },
    defaultStyles: FIELD,
    fields: [
      { key: "label", label: "Question", type: "text" },
      { key: "name", label: "Field name", type: "text" },
      { key: "items", label: "Choices", type: "items" },
      { key: "required", label: "Required", type: "toggle" },
    ],
  },
  {
    type: "file",
    label: "File upload",
    category: "Forms",
    icon: "upload",
    defaultProps: { label: "Upload your resume", name: "file", accept: ".pdf,.doc,.docx", multiple: false, required: false },
    defaultStyles: FIELD,
    fields: [
      { key: "label", label: "Label", type: "text" },
      { key: "name", label: "Field name", type: "text" },
      { key: "accept", label: "Allowed files", type: "text", placeholder: "e.g. image/*,.pdf", help: "The form's submit URL must accept file uploads." },
      { key: "multiple", label: "Allow several files", type: "toggle" },
      { key: "required", label: "Required", type: "toggle" },
    ],
  },
];
