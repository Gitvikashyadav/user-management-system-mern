import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const maxW = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size] || 'max-w-lg'

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#04080f]/80 backdrop-blur-sm animate-fadeIn"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full ${maxW} bg-[#111827] border border-white/[0.07] rounded-2xl shadow-2xl animate-slideUp overflow-hidden`}>
        <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.06]">
          <h2 className="font-display font-bold text-lg text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all">
            <X size={18} />
          </button>
        </div>
        <div className="px-7 py-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-white/[0.06]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}