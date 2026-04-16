import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUsersApi, deleteUserApi, toggleUserStatusApi } from '../../api/usersApi'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { Search, Plus, Eye, Pencil, Trash2, ToggleLeft, ToggleRight, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import EditUserModal from './EditUserModal'

const roleGrad = { admin: 'from-sky-400 to-blue-500', manager: 'from-amber-400 to-orange-500', user: 'from-violet-400 to-purple-600' }
const roleBadge = { admin: 'bg-sky-400/10 text-sky-400 border-sky-400/20', manager: 'bg-amber-400/10 text-amber-400 border-amber-400/20', user: 'bg-violet-400/10 text-violet-400 border-violet-400/20' }
const initials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

export default function UsersListPage() {
  const { isAdmin, user: me } = useAuth()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const LIMIT = 10

  const [editUser, setEditUser] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: LIMIT }
      if (search) params.search = search
      if (roleFilter) params.role = roleFilter
      if (statusFilter) params.status = statusFilter
      const { data } = await getUsersApi(params)
      setUsers(data.data?.users || data.users || [])
      setTotal(data.data?.total || data.total || 0)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }, [page, search, roleFilter, statusFilter])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteUserApi(deleteId)
      toast.success('User deleted')
      setDeleteId(null)
      fetchUsers()
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed') }
    finally { setDeleteLoading(false) }
  }

  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusApi(id)
      toast.success('Status updated')
      fetchUsers()
    } catch { toast.error('Failed to update status') }
  }

  const totalPages = Math.ceil(total / LIMIT)
  const isActive = (u) => u.status === 'active' || u.isActive !== false

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black text-3xl text-slate-100 tracking-tight mb-1">User Management</h1>
          <p className="text-sm text-slate-500">{total} {total === 1 ? 'user' : 'users'} in the system</p>
        </div>
        {isAdmin && (
          <Link to="/users/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-[#080c14] font-semibold text-sm transition-all hover:shadow-[0_0_24px_rgba(56,189,248,0.35)]">
            <Plus size={16} /> Create User
          </Link>
        )}
      </div>

      {/* Table card */}
      <div className="bg-[#111827] border border-white/[0.06] rounded-2xl overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full bg-[#0d1421] border border-white/[0.07] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-sky-400/40 transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1) }}
            className="bg-[#0d1421] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-sky-400/40 transition-all cursor-pointer appearance-none pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="bg-[#0d1421] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-slate-400 outline-none focus:border-sky-400/40 transition-all cursor-pointer appearance-none pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-600 text-sm">
            <span className="w-5 h-5 rounded-full border-2 border-slate-700 border-t-sky-400 spinner inline-block" />
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Filter size={40} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {['User', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3.5 text-left text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const active = isActive(u)
                  return (
                    <tr key={u._id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleGrad[u.role] || roleGrad.user} flex items-center justify-center text-[12px] font-bold flex-shrink-0`} style={{ color: '#080c14' }}>
                            {initials(u.name)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-200">{u.name}</div>
                            <div className="text-xs text-slate-600">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border capitalize ${roleBadge[u.role] || roleBadge.user}`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${active ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-rose-400/10 text-rose-400 border-rose-400/20'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          {active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">
                        {u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Link to={`/users/${u._id}`}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-sky-400 hover:bg-sky-400/10 transition-all" title="View">
                            <Eye size={15} />
                          </Link>
                          {isAdmin && (
                            <>
                              <button onClick={() => setEditUser(u)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-400/10 transition-all" title="Edit">
                                <Pencil size={15} />
                              </button>
                              <button onClick={() => handleToggleStatus(u._id)}
                                className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all" title="Toggle status">
                                {active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                              </button>
                              {u._id !== me?._id && (
                                <button onClick={() => setDeleteId(u._id)}
                                  className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 transition-all" title="Delete">
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
            <p className="text-xs text-slate-600">
              Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
            </p>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-white/[0.07] text-slate-500 hover:text-sky-400 hover:border-sky-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold border transition-all ${page === p ? 'bg-sky-400/15 text-sky-400 border-sky-400/30' : 'border-white/[0.07] text-slate-500 hover:text-sky-400 hover:border-sky-400/30'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-white/[0.07] text-slate-500 hover:text-sky-400 hover:border-sky-400/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => { setEditUser(null); fetchUsers() }}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete User"
        message="This action is permanent and cannot be undone. The user will lose all access immediately."
        confirmLabel="Delete User"
      />
    </div>
  )
}