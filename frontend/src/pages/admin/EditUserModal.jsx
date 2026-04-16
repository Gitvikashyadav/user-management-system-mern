import { useState } from 'react'
import Modal from '../../components/common/Modal'
import { updateUserApi } from '../../api/usersApi'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ROLES = ['admin', 'manager', 'user']

export default function EditUserModal({ user, onClose, onSuccess }) {
  const { isAdmin } = useAuth()
  const [form, setForm] = useState({ name: user.name || '', email: user.email || '', role: user.role || 'user', status: user.status || 'active' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name required'
    if (!form.email) e.email = 'Email required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await updateUserApi(user._id, form)
      toast.success('User updated')
      onSuccess()
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    finally { setLoading(false) }
  }

  const Label = ({ text }) => <label className="block text-xs font-semibold text-slate-500 mb-2 tracking-wide uppercase">{text}</label>
  const inp = (err) => `w-full bg-[#0d1421] border ${err ? 'border-rose-500/50' : 'border-white/[0.07]'} rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10 transition-all`

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit User"
      footer={
        <>
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 bg-white/5 border border-white/[0.07] hover:bg-white/10 transition-all" onClick={onClose}>Cancel</button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-sky-400 hover:bg-sky-300 text-[#080c14] transition-all disabled:opacity-50" onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="w-4 h-4 rounded-full border-2 border-sky-900/30 border-t-[#080c14] spinner inline-block" />Saving...</> : 'Save Changes'}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <Label text="Full Name" />
          <input type="text" className={inp(errors.name)} value={form.name} onChange={set('name')} placeholder="Full name" />
          {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label text="Email" />
          <input type="email" className={inp(errors.email)} value={form.email} onChange={set('email')} placeholder="Email address" />
          {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
        </div>
        {isAdmin && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label text="Role" />
              <select className={inp(false)} value={form.role} onChange={set('role')}
                style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' }}>
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <Label text="Status" />
              <select className={inp(false)} value={form.status} onChange={set('status')}
                style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}