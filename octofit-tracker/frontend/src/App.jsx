import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import { apiBaseUrl } from './api.js'
import './OctoFit.css'

const navigation = [
  { label: 'Activities', path: '/activities', number: '01' },
  { label: 'Leaderboard', path: '/leaderboard', number: '02' },
  { label: 'Teams', path: '/teams', number: '03' },
  { label: 'Members', path: '/users', number: '04' },
  { label: 'Workouts', path: '/workouts', number: '05' },
]

function App() {
  const { pathname } = useLocation()
  const currentPage = navigation.find((item) => item.path === pathname)?.label ?? 'Tracker'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand-lockup" to="/activities" aria-label="OctoFit Tracker home">
          <img src="/octofitapp-small.png" alt="" className="brand-logo" />
          <span className="brand-copy">
            <span className="brand-name">OctoFit</span>
            <span className="brand-caption">TRAINING TRACKER</span>
          </span>
        </NavLink>

        <p className="sidebar-label">WORKSPACE</p>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}
              key={item.path}
              to={item.path}
            >
              <span className="nav-number">{item.number}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <span className="sidebar-foot-mark" aria-hidden="true">OF</span>
          <span>MOVE WITH INTENT</span>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb-line">
            <span>OCTOFIT</span>
            <span className="breadcrumb-divider">/</span>
            <span>{currentPage.toUpperCase()}</span>
          </div>
          <a className="api-link" href={`${apiBaseUrl}/`} target="_blank" rel="noreferrer">
            <span className="status-dot" aria-hidden="true" />
            API endpoint
            <span className="external-mark" aria-hidden="true">↗</span>
          </a>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/activities" replace />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Navigate to="/activities" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App