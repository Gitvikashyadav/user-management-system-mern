import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUsersApi } from '../../api/usersApi'
import { Users, UserCheck, UserX, ShieldCheck, Clock, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'

const roleGrad = { admin: 'from-sky-400 to-blue-500', manager: 'from-amber-400 to-orange-500', user: 'from-violet-400 to-purple-600' }
const roleBadge = { admin: 'bg-sky-400/10 text-sky-400 border-sky-400/20', manager: 'bg-amber-400/10 text-amber-400 border-amber-400/20', user: 'bg-violet-400/10 text-violet-400 border-violet-400/20' }
const statusBadge = (u) => (u.status === 'active' || u.isActive !== false)
  ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
  : 'bg-rose-400/10 text-rose-400 border-rose-400/20'

const StatCard = ({ icon, label, value, color, trend }) => (
  <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 hover:border-sky-400/15 hover:shadow-[0_0_40px_rgba(56,189,248,0.06)] transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>{icon}</div>
      <ArrowUpRight size={14} className="text-slate-700 group-hover:text-sky-400 transition-colors" />
    </div>
    <div className="font-display font-black text-4xl text-slate-100 mb-1">{value ?? '—'}</div>
    <div className="text-sm text-slate-500">{label}</div>
  </div>
)

const initials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

export default function DashboardPage() {
  const { user, isAdminOrManager } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdminOrManager) { setLoading(false); return }
    getUsersApi({ limit: 100 }).then(({ data }) => {
      const users = data.data?.users || data.users || []
      const active = users.filter(u => u.status === 'active' || u.isActive !== false).length
      setStats({ total: users.length, active, inactive: users.length - active, admins: users.filter(u => u.role === 'admin').length })
      setRecentUsers(users.slice(0, 6))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [isAdminOrManager])

  const userInitials = initials(user?.name)
  const grad = roleGrad[user?.role] || roleGrad.user

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-slate-100 tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
      </div>

      {/* Hero profile card */}
      <div className="relative bg-[#111827] border border-white/[0.06] rounded-2xl p-8 flex items-center gap-6 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 to-transparent pointer-events-none" />
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center font-display font-black text-3xl flex-shrink-0 shadow-[0_0_32px_rgba(56,189,248,0.2)] border-2 border-white/10`}
          style={{ color: '#080c14' }}>
          {userInitials}
        </div>
        <div className="relative z-10">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-1">Signed in as</p>
          <h2 className="font-display font-bold text-2xl text-slate-100 mb-2 tracking-tight">{user?.name}</h2>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${roleBadge[user?.role]}`}>{user?.role}</span>
            <span className="text-sm text-slate-500">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      {isAdminOrManager && !loading && stats && (
        <div className="grid grid-cols-4 gap-5 mb-8">
          <StatCard icon={<Users size={20} className="text-sky-400" />} label="Total Users" value={stats.total} color="bg-sky-400/10" />
          <StatCard icon={<UserCheck size={20} className="text-emerald-400" />} label="Active" value={stats.active} color="bg-emerald-400/10" />
          <StatCard icon={<UserX size={20} className="text-rose-400" />} label="Inactive" value={stats.inactive} color="bg-rose-400/10" />
          <StatCard icon={<ShieldCheck size={20} className="text-amber-400" />} label="Admins" value={stats.admins} color="bg-amber-400/10" />
        </div>
      )}

      {/* Recent users table */}
      {isAdminOrManager && !loading && recentUsers.length > 0 && (
        <div className="bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div>
              <h2 className="font-display font-bold text-base text-slate-100">Recent Users</h2>
              <p className="text-xs text-slate-600 mt-0.5">Latest accounts in the system</p>
            </div>
            <Link to="/users" className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {['User', 'Role', 'Status', 'Created'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr key={u._id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${roleGrad[u.role] || roleGrad.user} flex items-center justify-center text-[11px] font-bold flex-shrink-0`} style={{ color: '#080c14' }}>
                        {initials(u.name)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-200">{u.name}</div>
                        <div className="text-xs text-slate-600">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border capitalize ${roleBadge[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadge(u)}`}>
                      {(u.status === 'active' || u.isActive !== false) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} />
                      {u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : '—'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Regular user message */}
      {!isAdminOrManager && (
        <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-sky-400/10 flex items-center justify-center mx-auto mb-5">
            <UserCheck size={28} className="text-sky-400 opacity-60" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-300 mb-2">Your Workspace</h3>
          <p className="text-sm text-slate-600 max-w-xs mx-auto">Manage your profile and account settings from the sidebar navigation.</p>
        </div>
      )}
    </div>
  )
}