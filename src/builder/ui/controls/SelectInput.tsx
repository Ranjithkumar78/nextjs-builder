export type Option = { label: string; value: string };

/** A select with an empty "Default" choice; an unknown current value is still shown. */
export function SelectInput({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: Option[]; placeholder?: string }) {
  const known = options.some((o) => o.value === value);
  return (
    <select className="b-input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder ?? "Default"}</option>
      {!known && value ? <option value={value}>{value}</option> : null}
      <Options options={options} />
    </select>
  );
}

/** <option> elements for a list of options. */
export function Options({ options }: { options: Option[] }) {
  return (
    <>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </>
  );
}
