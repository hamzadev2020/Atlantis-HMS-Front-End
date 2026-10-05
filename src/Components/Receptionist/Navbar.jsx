import { useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { ProfilePictureControl } from "../ProfilePictureControl.jsx";
import hotelLogo from "../../assets/HMSLOGO.jpg";

export const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-sky-100 bg-white/90 px-4 shadow-[0_8px_30px_rgba(20,72,105,0.06)] backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <span className="rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 p-1.5 ring-1 ring-sky-100">
          <img src={hotelLogo} alt="Hotel Management System" className="h-11 w-11 shrink-0 rounded-xl object-contain" />
        </span>

        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            Reception Workspace
          </p>
          <h2 className="mt-1 truncate text-sm font-bold leading-tight text-slate-800 sm:text-base">
            Hotel Management
          </h2>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-sky-100 bg-sky-50/70 px-3 py-2 text-xs text-sky-900 lg:flex">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Front office is active
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ProfilePictureControl />
        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 sm:flex"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={16} />
        </button>

        <button
          onClick={logout}
          aria-label="Logout"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-sky-300 sm:px-4"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </nav>
  );
};
