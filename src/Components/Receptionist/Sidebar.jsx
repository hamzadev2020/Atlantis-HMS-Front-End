import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    children: [
    //   { label: "Overview", path: "/receptionist-dashboard" },
      { label: "Reports & Analytics", path: "/receptionist-analytics" },
    ],
  },
   {
    id: "reports",
    label: "Task Management ",
    icon: BarChart3,
    children: [
      { label: "View Tasks", path: "/receptionist-tasks" },
      
      { label: "Reporting", path: "/receptionist-reporting" },
      { label: "Service Requests", path: "/receptionist-service-requests" },
    ],
  },
  // {
  //   id: "tasks",
  //   label: "Task Management",
  //   icon: BriefcaseBusiness,
  //   children: [
  //     // { label: "Assign Room Tasks", path: "/receptionist-housekeeping" },
  //   ],
  // },
  {
    id: "bookings",
    label: "Booking Management",
    icon: BedDouble,
    children: [
      { label: "Manage Bookings", path: "/Manage-Bookings-By-Recep" },
      { label: "Room Availability", path: "/receptionist-room-availability" },
    ],
  },
  {
    id: "guests",
    label: "Guest Management",
    icon: Users,
    children: [
      { label: "Guest Profiles", path: "/receptionist-guests" },
      { label: "Contact Messages", path: "/receptionist-contact" },
      { label: "Guest Feedback", path: "/receptionist-feedback" },
    ],
  },
 
];

const SINGLE_LINKS = [
//   { path: "/receptionist-appointments", label: "Appointments", icon: BookMarked },
//   { path: "/receptionist-notifications", label: "Notifications", icon: BellRing },
  { path: "/receptionist-settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const isActive = (path) => location.pathname === path;

  const sectionHasActiveChild = (section) =>
    section.children.some((child) => isActive(child.path));

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const parentStyle = (highlighted) =>
    `flex w-full items-center justify-between rounded-xl border-0 bg-transparent px-4 py-3 text-left text-sm font-semibold transition focus:outline-none ${
      highlighted
        ? "!text-sky-700"
        : "!text-slate-700 hover:bg-sky-50 hover:!text-sky-700"
    }`;

  const subLinkStyle = (path) =>
    `block w-full rounded-lg border-0 bg-transparent px-4 py-2.5 text-left text-sm transition focus:outline-none ${
      isActive(path)
        ? "bg-sky-100 !text-sky-700 font-semibold shadow-sm border border-sky-200"
        : "bg-transparent !text-slate-600 hover:bg-sky-50 hover:!text-sky-700"
    }`;

  const singleLinkStyle = (path) =>
    `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
      isActive(path)
        ? "bg-sky-100 !text-sky-700 shadow-sm border border-sky-200"
        : "!text-slate-700 hover:bg-sky-50 hover:!text-sky-700"
    }`;

  const CollapsibleSection = ({ id, label, icon: Icon, children, highlighted }) => {
    const open = openMenu === id;

    return (
      <div
        className={`overflow-hidden rounded-xl p-1 transition-colors ${
          highlighted ? "bg-sky-50" : "bg-slate-50"
        }`}
      >
        <button className={parentStyle(highlighted)} onClick={() => toggleMenu(id)}>
          <span className="flex items-center gap-3">
            <Icon size={18} className="shrink-0 text-sky-500" />
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
            <div className="ml-3 space-y-1 border-l-2 border-sky-100 pl-3 pb-1.5 pt-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className="sticky top-[73px] h-[calc(100vh-73px)] w-64 shrink-0 border-r border-slate-200 bg-white shadow-sm">
      <div className="px-3 pt-5">
        <div className="mb-4 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 p-3 text-white shadow-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-100">
            Working Area
          </p>
          <h3 className="mt-1 text-base font-bold">Reception Desk</h3>
        </div>
      </div>

      <nav className="h-[calc(100%-150px)] space-y-1.5 overflow-y-auto px-3 pb-3">
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

        <div className="space-y-1.5 pt-1">
          {SINGLE_LINKS.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              className={singleLinkStyle(path)}
              onClick={() => navigate(path)}
            >
              <Icon size={18} className={isActive(path) ? "text-sky-700" : "text-sky-500"} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-200 px-3 py-3">
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
