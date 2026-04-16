import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserApi } from "../../api/usersApi";
import { ArrowLeft, UserPlus, Eye, EyeOff, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const ROLES = ["user", "manager", "admin"];

const Label = ({ text, optional }) => (
  <label className="block text-xs font-semibold text-slate-500 mb-2 tracking-wide uppercase">
    {text}{" "}
    {optional && (
      <span className="text-slate-700 normal-case font-normal">(optional)</span>
    )}
  </label>
);

const inp = (err) =>
  `w-full bg-[#0d1421] border ${err ? "border-rose-500/50" : "border-white/[0.07]"} rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10 transition-all`;

const genPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
};

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createUserApi(form);
      toast.success(`User "${form.name}" created successfully!`);
      navigate("/users");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/users"
          className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-slate-500 hover:text-slate-300 hover:bg-white/[0.07] transition-all"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display font-black text-3xl text-slate-100 tracking-tight">
            Create User
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Add a new account to the system
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="bg-[#111827] border border-white/[0.06] rounded-2xl p-8 space-y-6">
            {/* Name */}
            <div>
              <Label text="Full Name" />
              <input
                type="text"
                className={inp(errors.name)}
                placeholder="John Doe"
                value={form.name}
                onChange={set("name")}
              />
              {errors.name && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label text="Email Address" />
              <input
                type="email"
                className={inp(errors.email)}
                placeholder="john@example.com"
                value={form.email}
                onChange={set("email")}
              />
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label text="Password" />
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className={`${inp(errors.password)} pr-24`}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={set("password")}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, password: genPassword() }))
                    }
                    className="p-1.5 rounded-lg text-slate-600 hover:text-sky-400 hover:bg-sky-400/10 transition-all"
                    title="Generate password"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1.5">
                  {errors.password}
                </p>
              )}
              <p className="text-xs text-slate-600 mt-2">
                Use the refresh icon to auto-generate a secure password
              </p>
            </div>

            {/* Role + Status */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label text="Role" />
                <select
                  className={inp(false)}
                  value={form.role}
                  onChange={set("role")}
                  style={{
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: "36px",
                    cursor: "pointer",
                  }}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label text="Status" />
                <select
                  className={inp(false)}
                  value={form.status}
                  onChange={set("status")}
                  style={{
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: "36px",
                    cursor: "pointer",
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Role description */}
            <div className="bg-sky-400/5 border border-sky-400/10 rounded-xl p-4">
              <p className="text-xs text-sky-400/80 font-medium mb-1">
                Role Permissions
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {form.role === "admin" &&
                  "Full access — create, edit, delete users, manage roles and system settings."}
                {form.role === "manager" &&
                  "View and update non-admin users. Cannot delete users or change roles."}
                {form.role === "user" &&
                  "Can only view and update their own profile. No access to other user data."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <Link
              to="/users"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-sky-400 hover:bg-sky-300 text-[#080c14] transition-all hover:shadow-[0_0_24px_rgba(56,189,248,0.35)] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-sky-900/30 border-t-[#080c14] spinner inline-block" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
