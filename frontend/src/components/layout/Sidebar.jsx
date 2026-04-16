import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Users, UserCircle, LogOut, ShieldPlus, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const ROLE_STYLES = {
  admin: { grad: 'from-sky-400 to-blue-500', text: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
  manager: { grad: 'from-amber-400 to-orange-500', text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  user: { grad: 'from-violet-400 to-purple-600', text: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' },
}

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border border-transparent group
      ${isActive ? 'nav-active' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`
    }
  >
    <Icon size={16} className="flex-shrink-0" />
    <span className="flex-1">{label}</span>
    <ChevronRight size={12} className="opacity-0 group-hover:opacity-40 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-150" />
  </NavLink>
)

export default function Sidebar() {
  const { user, logout, isAdmin, isAdminOrManager } = useAuth()
  const navigate = useNavigate()
  const rs = ROLE_STYLES[user?.role] || ROLE_STYLES.user

  const handleLogout = async () => {
    await logout()
    toast.success('Signed out')
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0] || 'U').toUpperCase()

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0d1421] border-r border-white/[0.06] flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.3)] flex-shrink-0">
            <span className="font-display font-black text-[15px] text-[#080c14]">UF</span>
          </div>
          <div>
            <span className="font-display font-bold text-[17px] text-slate-100 tracking-tight">
              User<span className="text-sky-400">Flow</span>
            </span>
            <div className="text-[10px] text-slate-600 tracking-widest uppercase mt-0.5">Management System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 px-3 mb-2">Main</div>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        {isAdminOrManager && <NavItem to="/users" icon={Users} label="User Management" />}
        <NavItem to="/profile" icon={UserCircle} label="My Profile" />

        {isAdmin && (
          <>
            <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-600 px-3 mt-5 mb-2">Admin</div>
            <NavItem to="/users/create" icon={ShieldPlus} label="Create User" />
          </>
        )}
      </nav>

      {/* Role badge + user + logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#111827] border border-white/[0.05]">
          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${rs.grad} flex items-center justify-center font-display font-bold text-[13px] text-[#080c14] flex-shrink-0`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-slate-200 truncate">{user?.name || 'User'}</div>
            <div className={`text-[11px] ${rs.text} capitalize font-medium`}>{user?.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}