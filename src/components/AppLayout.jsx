import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const [activePath, setActivePath] = useState(location.pathname)

  // Close the mobile drawer whenever navigation changes, including browser
  // back/forward and programmatic navigation.
  if (activePath !== location.pathname) {
    setActivePath(location.pathname)
    setSidebarOpen(false)
  }

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
