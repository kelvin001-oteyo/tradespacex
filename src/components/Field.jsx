export default function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label className="field-label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}