import { Navbar } from "../../Components/Admin/Navbar.jsx";
import { Sidebar } from "../../Components/Admin/Sidebar.jsx";

export const Admin = () => {
  const stats = [
    { label: "Total Rooms", value: "128", change: "+12%", tone: "bg-purple-600" },
    { label: "Available", value: "84", change: "+5%", tone: "bg-emerald-500" },
    { label: "Occupied", value: "31", change: "-2%", tone: "bg-amber-500" },
    { label: "Staff Members", value: "24", change: "+3%", tone: "bg-sky-500" },
  ];

  const quickActions = [
    { title: "Upload Room", description: "Add a new room to inventory", path: "/rooms/upload" },
    { title: "Manage Rooms", description: "View, edit, and delete rooms ", path: "/rooms/manage" },
    { title: "Manage Staffs", description: "Update staff details and roles", path: "/ManageStaffs" },
  ];

  const recentActivity = [
    { title: "New Deluxe room added", detail: "Room 205 is now live in the inventory", time: "2 hours ago" },
    { title: "Staff profile updated", detail: "Receptionist Sara changed her contact details", time: "4 hours ago" },
    { title: "Room maintenance scheduled", detail: "Suite 301 marked under maintenance", time: "Today" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here is a quick overview of your hotel operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl shadow-lg border border-purple-100 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <h2 className="mt-2 text-3xl font-bold text-gray-800">{stat.value}</h2>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.tone} flex items-center justify-center text-white text-lg font-bold`}>
                      {stat.value[0]}
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-green-600">{stat.change} from last month</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
                  <span className="text-sm text-purple-600 font-semibold">Operations</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action) => (
                    <div key={action.title} className="bg-purple-50 border border-purple-100 rounded-xl p-4 hover:shadow-md transition">
                      <h4 className="text-lg font-semibold text-gray-800">{action.title}</h4>
                      <p className="mt-2 text-sm text-gray-600">{action.description}</p>
                      <button
                        type="button"
                        className="mt-4 w-full px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
                      >
                        Open
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>

                <div className="space-y-4">
                  {recentActivity.map((item) => (
                    <div key={item.title} className="border-l-4 border-purple-500 pl-4">
                      <p className="font-semibold text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
                      <span className="text-xs text-gray-400 mt-2 block">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};