import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { registerApi } from '../../api/authApi'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-400 mb-2 tracking-wide uppercase">{label}</label>
    {children}
    {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
  </div>
)

const inp = (hasErr) =>
  `w-full bg-[#0d1421] border ${hasErr ? 'border-rose-500/50' : 'border-white/[0.07]'} rounded-xl py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10 transition-all`

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password required'
    else if (form.password.length < 6) e.password = 'Min 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
   
    
    setLoading(true)
    
    
    try {
      await registerApi({ name: form.name, email: form.email, password: form.password })
      await login({ email: form.email, password: form.password })
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c14] relative overflow-hidden px-4 py-8">
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-sky-400/5 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-[400px] h-[400px] rounded-full bg-violet-400/4 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-slideUp">
        <div className="bg-[#111827] border border-white/[0.07] rounded-2xl p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-[0_0_24px_rgba(56,189,248,0.3)]">
              <span className="font-display font-black text-base text-[#080c14]">UF</span>
            </div>
            <span className="font-display font-bold text-xl text-slate-100 tracking-tight">
              User<span className="text-sky-400">Flow</span>
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl text-slate-100 mb-1.5 tracking-tight">Create account</h1>
          <p className="text-sm text-slate-500 mb-8">Join UserFlow to get started</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Full Name" error={errors.name}>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input type="text" className={`${inp(errors.name)} pl-10 pr-4`} placeholder="John Doe" value={form.name} onChange={set('name')} />
              </div>
            </Field>

            <Field label="Email Address" error={errors.email}>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input type="email" className={`${inp(errors.email)} pl-10 pr-4`} placeholder="you@example.com" value={form.email} onChange={set('email')} />
              </div>
            </Field>

            <Field label="Password" error={errors.password}>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} className={`${inp(errors.password)} pl-10 pr-11`} placeholder="Min 6 characters" value={form.password} onChange={set('password')} />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            <Field label="Confirm Password" error={errors.confirmPassword}>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} className={`${inp(errors.confirmPassword)} pl-10 pr-4`} placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} />
              </div>
            </Field>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-sky-400 hover:bg-sky-300 text-[#080c14] font-semibold text-sm transition-all hover:shadow-[0_0_24px_rgba(56,189,248,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-sky-900/30 border-t-[#080c14] spinner inline-block" />Creating...</>
                : <>Create Account <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="relative flex items-center my-7">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="px-4 text-xs text-slate-600">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-400 hover:text-sky-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}