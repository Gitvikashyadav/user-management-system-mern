import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateOwnProfileApi } from '../../api/usersApi'
import { User, Lock, Eye, EyeOff, Save, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const roleGrad = { admin: 'from-sky-400 to-blue-500', manager: 'from-amber-400 to-orange-500', user: 'from-violet-400 to-purple-600' }
const roleBadge = { admin: 'bg-sky-400/10 text-sky-400 border-sky-400/20', manager: 'bg-amber-400/10 text-amber-400 border-amber-400/20', user: 'bg-violet-400/10 text-violet-400 border-violet-400/20' }

const inp = (err) =>
  `w-full bg-[#0d1421] border ${err ? 'border-rose-500/50' : 'border-white/[0.07]'} rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10 transition-all`

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [nameForm, setNameForm] = useState({ name: user?.name || '' })
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [nameLoading, setNameLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [nameErrors, setNameErrors] = useState({})
  const [passErrors, setPassErrors] = useState({})

  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const grad = roleGrad[user?.role] || roleGrad.user

  const validateName = () => {
    const e = {}
    if (!nameForm.name.trim()) e.name = 'Name is required'
    setNameErrors(e)
    return !Object.keys(e).length
  }

  const validatePass = () => {
    const e = {}
    if (!passForm.currentPassword) e.currentPassword = 'Current password required'
    if (!passForm.newPassword) e.newPassword = 'New password required'
    else if (passForm.newPassword.length < 6) e.newPassword = 'Min 6 characters'
    if (passForm.newPassword !== passForm.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setPassErrors(e)
    return !Object.keys(e).length
  }

  const handleNameSave = async (ev) => {
    ev.preventDefault()
    if (!validateName()) return
    setNameLoading(true)
    try {
      const { data } = await updateOwnProfileApi({ name: nameForm.name })
      updateUser({ ...user, name: data.data?.name || data.user?.name || nameForm.name })
      toast.success('Profile updated!')
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    finally { setNameLoading(false) }
  }

  const handlePassSave = async (ev) => {
    ev.preventDefault()
    if (!validatePass()) return
    setPassLoading(true)
    try {
      await updateOwnProfileApi({ currentPassword: passForm.currentPassword, password: passForm.newPassword })
      toast.success('Password changed!')
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to change password') }
    finally { setPassLoading(false) }
  }

  const Label = ({ text }) => <label className="block text-xs font-semibold text-slate-500 mb-2 tracking-wide uppercase">{text}</label>

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-slate-100 tracking-tight mb-1">My Profile</h1>
        <p className="text-sm text-slate-500">Manage your account information and password</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sidebar profile */}
        <div className="col-span-1">
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-6 text-center sticky top-8">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center font-display font-black text-3xl mx-auto mb-5 shadow-[0_0_32px_rgba(56,189,248,0.15)] border-2 border-white/10`} style={{ color: '#080c14' }}>
              {userInitials}
            </div>
            <h2 className="font-display font-bold text-xl text-slate-100 mb-1">{user?.name}</h2>
            <p className="text-sm text-slate-600 mb-4 break-all">{user?.email}</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize ${roleBadge[user?.role] || roleBadge.user}`}>{user?.role}</span>

            <div className="mt-6 text-left space-y-2.5">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Your Permissions</p>
              {[
                { label: 'View own profile', ok: true },
                { label: 'Update name & password', ok: true },
                { label: 'View all users', ok: ['admin', 'manager'].includes(user?.role) },
                { label: 'Create users', ok: user?.role === 'admin' },
                { label: 'Delete users', ok: user?.role === 'admin' },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ok ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                  <span className={`text-xs ${ok ? 'text-slate-400' : 'text-slate-700'}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Forms */}
        <div className="col-span-2 space-y-5">
          {/* Name */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-sky-400/10 flex items-center justify-center">
                <User size={16} className="text-sky-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-100">Personal Information</h3>
                <p className="text-xs text-slate-600">Update your display name</p>
              </div>
            </div>
            <form onSubmit={handleNameSave} className="space-y-5">
              <div>
                <Label text="Full Name" />
                <input type="text" className={inp(nameErrors.name)} value={nameForm.name} onChange={e => setNameForm({ name: e.target.value })} placeholder="Your full name" />
                {nameErrors.name && <p className="text-xs text-rose-400 mt-1.5">{nameErrors.name}</p>}
              </div>
              <div>
                <Label text="Email Address" />
                <input type="email" className={`${inp(false)} opacity-50 cursor-not-allowed`} value={user?.email || ''} disabled />
                <p className="text-xs text-slate-700 mt-1.5">Email cannot be changed. Contact an admin.</p>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={nameLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-sky-400 hover:bg-sky-300 text-[#080c14] transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] disabled:opacity-50">
                  {nameLoading ? <><span className="w-4 h-4 rounded-full border-2 border-sky-900/30 border-t-[#080c14] spinner inline-block" />Saving...</> : <><Save size={15} />Save Changes</>}
                </button>
              </div>
            </form>
          </div>

          {/* Password */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center">
                <Lock size={16} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-100">Change Password</h3>
                <p className="text-xs text-slate-600">Keep your account secure</p>
              </div>
            </div>
            <form onSubmit={handlePassSave} className="space-y-5">
              <div>
                <Label text="Current Password" />
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className={`${inp(passErrors.currentPassword)} pr-11`}
                    value={passForm.currentPassword} onChange={e => setPassForm(p => ({ ...p, currentPassword: e.target.value }))} placeholder="Current password" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passErrors.currentPassword && <p className="text-xs text-rose-400 mt-1.5">{passErrors.currentPassword}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label text="New Password" />
                  <input type={showPass ? 'text' : 'password'} className={inp(passErrors.newPassword)}
                    value={passForm.newPassword} onChange={e => setPassForm(p => ({ ...p, newPassword: e.target.value }))} placeholder="Min 6 characters" />
                  {passErrors.newPassword && <p className="text-xs text-rose-400 mt-1.5">{passErrors.newPassword}</p>}
                </div>
                <div>
                  <Label text="Confirm Password" />
                  <input type={showPass ? 'text' : 'password'} className={inp(passErrors.confirmPassword)}
                    value={passForm.confirmPassword} onChange={e => setPassForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Repeat new password" />
                  {passErrors.confirmPassword && <p className="text-xs text-rose-400 mt-1.5">{passErrors.confirmPassword}</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={passLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 transition-all disabled:opacity-50">
                  {passLoading ? <><span className="w-4 h-4 rounded-full border-2 border-amber-900/30 border-t-amber-400 spinner inline-block" />Updating...</> : <><Lock size={15} />Update Password</>}
                </button>
              </div>
            </form>
          </div>

          {/* Account meta */}
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-violet-400/10 flex items-center justify-center">
                <Calendar size={16} className="text-violet-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-100">Account Details</h3>
                <p className="text-xs text-slate-600">Read-only account metadata</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Account ID', value: user?._id?.slice(-8)?.toUpperCase() || '—' },
                { label: 'Role', value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) },
                { label: 'Member Since', value: user?.createdAt ? format(new Date(user.createdAt), 'PPP') : '—' },
                { label: 'Last Updated', value: user?.updatedAt ? format(new Date(user.updatedAt), 'PPP') : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#0d1421] border border-white/[0.05] rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-slate-300">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}