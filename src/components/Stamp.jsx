export default function Stamp({ label = 'VERIFIED', active = true, size = 72 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transform: 'rotate(-8deg)',
        border: `2px solid ${active ? 'var(--brass)' : 'rgba(51,71,79,0.3)'}`,
        opacity: active ? 1 : 0.4,
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 3,
          borderRadius: '9999px',
          border: `1px solid ${active ? 'var(--brass)' : 'rgba(51,71,79,0.3)'}`,
        }}
      />
      <span
        className="font-mono"
        style={{
          fontSize: 9,
          letterSpacing: '0.14em',
          textAlign: 'center',
          padding: '0 4px',
          color: active ? 'var(--brass)' : 'rgba(51,71,79,0.5)',
        }}
      >
        {label}
      </span>
    </div>
  )
}