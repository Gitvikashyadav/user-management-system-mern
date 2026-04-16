import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserByIdApi, deleteUserApi, toggleUserStatusApi } from '../../api/usersApi'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EditUserModal from './EditUserModal'
import { ArrowLeft, Pencil, Trash2, Clock, User, Mail, Shield, ToggleLeft, ToggleRight, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const roleGrad = { admin: 'from-sky-400 to-blue-500', manager: 'from-amber-400 to-orange-500', user: 'from-violet-400 to-purple-600' }
const roleBadge = { admin: 'bg-sky-400/10 text-sky-400 border-sky-400/20', manager: 'bg-amber-400/10 text-amber-400 border-amber-400/20', user: 'bg-violet-400/10 text-violet-400 border-violet-400/20' }

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-4 border-b border-white/[0.04] last:border-0">
    <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
      <Icon size={16} className="text-slate-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-0.5">{label}</p>
      <p className="text-sm text-slate-200 font-medium truncate">{value || '—'}</p>
    </div>
  </div>
)

export default function UserDetailPage() {
  const { id } = useParams()
  const { isAdmin, user: me } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [delLoading, setDelLoading] = useState(false)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const { data } = await getUserByIdApi(id)
      setUser(data.data || data.user || data)
    } catch { toast.error('User not found'); navigate('/users') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUser() }, [id])

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await deleteUserApi(id)
      toast.success('User deleted')
      navigate('/users')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
    finally { setDelLoading(false) }
  }

  const handleToggle = async () => {
    try {
      await toggleUserStatusApi(id)
      toast.success('Status updated')
      fetchUser()
    } catch { toast.error('Failed') }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-slate-600 text-sm">
      <span className="w-5 h-5 rounded-full border-2 border-slate-700 border-t-sky-400 spinner inline-block" /> Loading...
    </div>
  )

  if (!user) return null

  const active = user.status === 'active' || user.isActive !== false
  const userInitials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="animate-fadeIn">
      {/* Back + header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/users" className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-500 hover:text-slate-300 hover:bg-white/[0.07] transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display font-black text-3xl text-slate-100 tracking-tight">User Details</h1>
          <p className="text-sm text-slate-500 mt-0.5">View and manage user account</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button onClick={handleToggle}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-emerald-400 hover:border-emerald-400/30 hover:bg-emerald-400/5 transition-all">
              {active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
              {active ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-sky-400/10 border border-sky-400/20 text-sky-400 hover:bg-sky-400/20 transition-all">
              <Pencil size={15} /> Edit
            </button>
            {user._id !== me?._id && (
              <button onClick={() => setShowDelete(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-400/10 border border-rose-400/20 text-rose-400 hover:bg-rose-400/20 transition-all">
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left — profile card */}
        <div className="col-span-1">
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 text-center">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleGrad[user.role] || roleGrad.user} flex items-center justify-center font-display font-black text-3xl mx-auto mb-4`} style={{ color: '#080c14' }}>
              {userInitials}
            </div>
            <h2 className="font-display font-bold text-xl text-slate-100 mb-1">{user.name}</h2>
            <p className="text-sm text-slate-600 mb-4">{user.email}</p>
            <div className="flex items-center justify-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${roleBadge[user.role] || roleBadge.user}`}>{user.role}</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${active ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-rose-400/10 text-rose-400 border-rose-400/20'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                {active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Right — details */}
        <div className="col-span-2 space-y-5">
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-widest mb-2">Account Info</h3>
            <InfoRow icon={User} label="Full Name" value={user.name} />
            <InfoRow icon={Mail} label="Email Address" value={user.email} />
            <InfoRow icon={Shield} label="Role" value={user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} />
          </div>

          {/* Audit */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-widest mb-2">Audit Trail</h3>
            <InfoRow icon={Calendar} label="Created At" value={user.createdAt ? format(new Date(user.createdAt), 'PPP p') : '—'} />
            <InfoRow icon={Clock} label="Last Updated" value={user.updatedAt ? format(new Date(user.updatedAt), 'PPP p') : '—'} />
            <InfoRow icon={User} label="Created By" value={user.createdBy?.name || user.createdBy || 'System'} />
            <InfoRow icon={User} label="Updated By" value={user.updatedBy?.name || user.updatedBy || '—'} />
          </div>
        </div>
      </div>

      {showEdit && <EditUserModal user={user} onClose={() => setShowEdit(false)} onSuccess={() => { setShowEdit(false); fetchUser() }} />}
      <ConfirmDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} loading={delLoading}
        title="Delete User" message={`Are you sure you want to delete ${user.name}? This cannot be undone.`} confirmLabel="Delete User" />
    </div>
  )
}