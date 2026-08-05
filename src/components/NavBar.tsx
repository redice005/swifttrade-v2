import { useNavigate, useLocation } from 'react-router-dom'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { label: 'Manual trading', path: '/dashboard' },
    { label: 'Strategies',path: '/strategies'},
    { label: 'Free Bots', path: '/bots' },
    { label: 'Analysis', path: '/analysis' },
    { label: 'AI Scanner', path: '/ai-scanner' },
    { label: 'Get Funded', path: '/funded' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollSnapType: 'x proximity',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        paddingBottom: '0.25rem',
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.path}
          onClick={() => navigate(tab.path)}
          style={{
            flex: '0 0 auto',
            scrollSnapAlign: 'start',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            border: 'none',
            background: location.pathname === tab.path ? '#6c63ff' : '#1a1a2e',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
