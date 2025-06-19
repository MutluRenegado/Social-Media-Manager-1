"use client";

export default function CancelledPage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Payment Cancelled</h1>
      <p>Your payment was cancelled. You can try again anytime.</p>
      <a href="/admin" style={{
        display: 'inline-block',
        marginTop: '2rem',
        padding: '0.75rem 2rem',
        background: '#1e293b',
        color: '#fff',
        borderRadius: '0.375rem',
        textDecoration: 'none',
        fontWeight: 600,
        letterSpacing: '0.5px',
        transition: 'background 0.2s'
      }}
      onMouseOver={e=>e.currentTarget.style.background="#334155"}
      onMouseOut={e=>e.currentTarget.style.background="#1e293b"}
      >
        Go to Admin Dashboard
      </a>
    </main>
  );
}
