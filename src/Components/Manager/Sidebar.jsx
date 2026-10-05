import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BedDouble,
  ClipboardList,
  Settings,
  ChevronRight,
  LogOut,
  MessageSquareText,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    children: [{ label: "Overview & Reports", path: "/Welcome-Manager" }],
  },
  {
    id: "staff",
    label: "Staff Management",
    icon: Users,
    children: [{ label: "Manage Staffs", path: "/Manage-Staff" }],
  },
  {
    id: "rooms",
    label: "Room Management",
    icon: BedDouble,
    children: [
      { label: "Manage Rooms", path: "/manager-rooms" },
    ],
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: ClipboardList,
    children: [{ label: "View Bookings", path: "/Manager-View-Bookings" }],
  },
  {
    id: "requests",
    label: "Requests",
    icon: ClipboardList,
    children: [
      { label: "House keeping Services", path: "/Manager-Service-View" },
      // { label: "Housekeeping Tasks", path: "/manager-housekeeping" },
    ],
  },
  {
    id: "guest-relations",
    label: "Guest Relations",
    icon: MessageSquareText,
    children: [
      { label: "Contact Messages", path: "/guest-contacts" },
      { label: "Guest Feedback", path: "/guest-feedback-inbox" },
    ],
  },
];

const SINGLE_LINKS = [
  { path: "/manager-settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const isActive = (path) => location.pathname === path;
  const sectionHasActiveChild = (section) =>
    section.children.some((c) => isActive(c.path));

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const parentStyle = (highlighted) =>
    `flex w-full items-center justify-between rounded-xl border-0 bg-transparent px-4 py-3 text-left text-sm font-semibold transition focus:outline-none ${
      highlighted
        ? "!text-emerald-700"
        : "!text-slate-700 hover:bg-emerald-50 hover:!text-emerald-700"
    }`;

  const subLinkStyle = (path) =>
    `block w-full rounded-lg border-0 bg-transparent px-4 py-2.5 text-left text-sm transition focus:outline-none ${
      isActive(path)
        ? "bg-emerald-100 !text-emerald-700 font-semibold shadow-sm border border-emerald-200"
        : "bg-transparent !text-slate-600 hover:bg-emerald-50 hover:!text-emerald-700"
    }`;

  const singleLinkStyle = (path) =>
    `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
      isActive(path)
        ? "bg-emerald-100 !text-emerald-700 shadow-sm border border-emerald-200"
        : "!text-slate-700 hover:bg-emerald-50 hover:!text-emerald-700"
    }`;

  const CollapsibleSection = ({ id, label, icon: Icon, children, highlighted }) => {
    const open = openMenu === id;

    return (
      <div
        className={`overflow-hidden rounded-xl p-1 transition-colors ${
          highlighted ? "bg-emerald-50" : "bg-slate-50"
        }`}
      >
        <button className={parentStyle(highlighted)} onClick={() => toggleMenu(id)}>
          <span className="flex items-center gap-3">
            <Icon size={18} className="text-emerald-500 shrink-0" />
            <span className="truncate">{label}</span>
          </span>
          <ChevronRight
            size={16}
            className={`shrink-0 text-slate-400 transition-transform duration-300 ${
              open ? "rotate-90" : "rotate-0"
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="ml-3 space-y-1 border-l-2 border-emerald-100 pl-3 pb-1.5 pt-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 px-3 pt-5">
        <div className="mb-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 p-3 text-white shadow-md">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
            Working Area
          </p>
          <h3 className="mt-1 text-base font-bold">Manager Desk</h3>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 pb-3">
        {NAV_SECTIONS.map((section) => (
          <CollapsibleSection
            key={section.id}
            id={section.id}
            label={section.label}
            icon={section.icon}
            highlighted={sectionHasActiveChild(section)}
          >
            {section.children.map((child) => (
              <button
                key={child.path}
                className={subLinkStyle(child.path)}
                onClick={() => navigate(child.path)}
              >
                {child.label}
              </button>
            ))}
          </CollapsibleSection>
        ))}

        {SINGLE_LINKS.map(({ path, label, icon: Icon }) => (
          <button key={path} className={singleLinkStyle(path)} onClick={() => navigate(path)}>
            <Icon size={18} className={isActive(path) ? "text-white" : "text-emerald-500"} />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer - fixed at bottom */}
      <div className="shrink-0 border-t border-slate-200 px-3 py-3">
        <button
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
          onClick={() => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
            navigate("/login");
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};