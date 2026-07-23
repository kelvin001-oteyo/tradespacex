export default function AuthLayout({ docNumber, title, subtitle, children, footer }) {
  return (
    <div className="page-center">
      <div className="container-sm">
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="font-display" style={{ fontSize: 19, fontWeight: 600 }}>TradespaceX</span>
          <span className="doc-number">{docNumber}</span>
        </div>

        <div className="ledger-card" style={{ padding: 30 }}>
          <h1 className="font-display" style={{ fontSize: 26, margin: '0 0 6px' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 13.5, color: 'var(--slate)', margin: '0 0 22px' }}>{subtitle}</p>}
          {children}
        </div>

        {footer && <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13.5, color: 'var(--slate)' }}>{footer}</div>}
      </div>
    </div>
  )
}