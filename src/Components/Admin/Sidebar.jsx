import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BedDouble,
    CalendarCheck,
    Sparkles,
    Settings,
    ShieldCheck,
    ChevronRight,
    MessageSquareText
} from "lucide-react";

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState("dashboard"); // Dashboard default open

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const isActive = (path) => location.pathname === path;

    const parentStyle =
        "flex w-full items-center justify-between border-0 bg-transparent px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700 focus:outline-none rounded-lg";

    const subLinkStyle = (path) =>
        `block w-full border-0 bg-transparent px-4 py-2.5 text-left text-sm transition focus:outline-none rounded-lg ${
            isActive(path)
                ? "bg-violet-600 text-white font-semibold shadow-sm"
                : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
        }`;

    const singleLinkStyle = (path) =>
        `flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition rounded-xl ${
            isActive(path)
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
        }`;

    const CollapsibleSection = ({ id, label, icon: Icon, children }) => {
        const open = openMenu === id;
        return (
            <div className="rounded-xl bg-slate-50 p-1 overflow-hidden">
                <button className={parentStyle} onClick={() => toggleMenu(id)}>
                    <span className="flex items-center gap-3">
                        <Icon size={18} className="text-violet-500" />
                        {label}
                    </span>
                    <ChevronRight
                        size={16}
                        className={`text-slate-400 transition-transform duration-300 ${
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
                        <div className="ml-3 space-y-1 border-l-2 border-violet-100 pl-3 pt-1 pb-1.5">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <aside className="min-h-screen w-64 border-r border-slate-200 bg-white px-3 py-5 shadow-sm space-y-1.5">

            <CollapsibleSection id="dashboard" label="Dashboard" icon={LayoutDashboard}>
                <button
                    className={subLinkStyle("/Welcome-Admin")}
                    onClick={() => navigate("/Welcome-Admin")}
                >
                    Analytics and Reports
                </button>
            </CollapsibleSection>

            <CollapsibleSection id="staff" label="Staff Management" icon={Users}>
                <button className={subLinkStyle("/staff-Add")} onClick={() => navigate("/staff-Add")}>
                    Create Staff
                </button>
                <button className={subLinkStyle("/ManageStaffs")} onClick={() => navigate("/ManageStaffs")}>
                    Manage Staffs
                </button>
            </CollapsibleSection>

            <CollapsibleSection id="rooms" label="Room Management" icon={BedDouble}>
                <button className={subLinkStyle("/rooms/upload")} onClick={() => navigate("/rooms/upload")}>
                    Uploads Rooms
                </button>
                <button className={subLinkStyle("/rooms/manage")} onClick={() => navigate("/rooms/manage")}>
                    Manage Rooms
                </button>
            </CollapsibleSection>




  <CollapsibleSection id="bookings" label="Bookings" icon={CalendarCheck}>
                <button className={subLinkStyle("/Manage-Bookings")} onClick={() => navigate("/Manage-Bookings")}>
                    Manage Room Bookings
                </button>
            </CollapsibleSection>



            <CollapsibleSection id="bookings" label=" Maintenance" icon={CalendarCheck}>
                 <button className={singleLinkStyle("/housekeeping")} onClick={() => navigate("/service-requests")}>
                <Sparkles size={18} className="text-violet-500" />
                Housekeeping & Maintenance
            </button>

            </CollapsibleSection>

            <button className={singleLinkStyle("/guest-contacts")} onClick={() => navigate("/guest-contacts")}>
                <MessageSquareText size={18} className="text-violet-500" />
                Guest Contact Messages
            </button>
            <button className={singleLinkStyle("/guest-feedback-inbox")} onClick={() => navigate("/guest-feedback-inbox")}>
                <MessageSquareText size={18} className="text-violet-500" />
                Guest Feedback
            </button>
            <button className={singleLinkStyle("/admin-guests")} onClick={() => navigate("/admin-guests")}>
                <Users size={18} className="text-violet-500" />
                Guest Profiles
            </button>

           
            <button className={singleLinkStyle("/settings")} onClick={() => navigate("/settings")}>
                <Settings size={18} className="text-violet-500" />
                System Settings
            </button>

            <button className={singleLinkStyle("/privacy-policy")} onClick={() => navigate("/privacy-policy")}>
                <ShieldCheck size={18} className="text-violet-500" />
                Privacy Policy
            </button>

        </aside>
    );
};