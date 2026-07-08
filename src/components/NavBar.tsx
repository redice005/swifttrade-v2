import { useNavigate, useLocation } from 'react-router-dom'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { label: ' Manual trading', path: '/dashboard' },
    { label: ' Free Bots', path: '/bots' },
    { label: ' Analysis', path: '/analysis' },
    { label: ' AI Scanner', path: '/ai-scanner' },
  ]

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      {tabs.map(tab => (
        <button
          key={tab.path}
          onClick={() => navigate(tab.path)}
          style={{
            flex: 1,
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            background: location.pathname === tab.path ? '#6c63ff' : '#1a1a2e',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}