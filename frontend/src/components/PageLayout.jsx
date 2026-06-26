import { useSidebar } from '../context/SidebarContext.jsx'

export default function PageLayout({ children }) {
  const { collapsed } = useSidebar()
  return (
    <div
      className="min-h-screen bg-gray-50 font-sans transition-all duration-300 ease-in-out"
      style={{ marginLeft: collapsed ? '0px' : '256px' }}
    >
      {children}
    </div>
  )
}
