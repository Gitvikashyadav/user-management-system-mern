import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm"
      footer={
        <>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 bg-white/5 border border-white/[0.07] hover:bg-white/10 transition-all"
            onClick={onClose} disabled={loading}
          >Cancel</button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
            onClick={onConfirm} disabled={loading}
          >
            {loading
              ? <><span className="w-4 h-4 rounded-full border-2 border-rose-300/30 border-t-rose-400 spinner inline-block" />Deleting...</>
              : confirmLabel
            }
          </button>
        </>
      }
    >
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-2xl bg-rose-400/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-rose-400" />
        </div>
        <h3 className="font-display font-bold text-lg text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
      </div>
    </Modal>
  )
}