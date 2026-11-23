/** "Create" and "Cancel" buttons under an inline form. */
export function FormActions({ submitLabel, onSubmit, onCancel }: { submitLabel: string; onSubmit: () => void; onCancel: () => void }) {
  return (
    <div className="b-inline">
      <button className="b-btn small primary" onClick={onSubmit}>
        {submitLabel}
      </button>
      <button className="b-btn small ghost" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}
