import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Admin } from "./pages/Admin/Admin_Dashboard.jsx"
import { SignUpForm } from "./pages/Authentications/SignUpForm.jsx";
import { LoginForm } from "./pages/Authentications/LoginForm.jsx";
import { ProtectedRoute } from "./pages/Authentications/ProtectedRoute.jsx";
import { UserDashboard } from "./pages/Guest/Dashboard.jsx";
import { AddStaff } from "./pages/Admin/ManageStaffs/AddStaff.jsx";
import { AdminSetting } from "./pages/Admin/AdminSettings/AdminSetting.jsx";
import { ManagerSettings } from './pages/Manager/ManagerSettings.jsx';
import { ManagerDashboard } from './pages/Manager/ManagerDashboard.jsx';
import UploadsRooms from "./pages/Admin/ManageRooms/UploadsRooms.jsx";
import ManageRooms from "./pages/Admin/ManageRooms/ManageRooms.jsx";
import ManageStaffs from "./pages/Admin/ManageStaffs/ManageStaffs.jsx";
import ManageBookings from "./pages/Admin/ManageBookings/ManageBookings.jsx";
import UploadsPolicies from "./pages/Admin/CreatePolicies/UploadsPolicies.jsx";
import ManagePolicies from "./pages/Admin/CreatePolicies/ManagePolicies.jsx";
import ManageServiceRequests from "./pages/Admin/ServiceRequests/ManageServiceRequests.jsx";
import Manager_ManageStaffs from "./pages/Manager/ManagerStaff/ManageStaffs.jsx";
import Manager_ManageRooms from './pages/Manager/ManageRoom/ManageRooms.jsx';
import Manager_ManageServiceRequests from './pages/Manager/Manager_ServiceRequests/Manager_ManageServiceRequests.jsx'
import Manager_ManageBookings from './pages/Manager/ManageBookings/Manager_ManageBookings.jsx'
import { Booking } from './pages/Guest/RoomBooking/Booking.jsx';
import { BookingHistory } from './pages/Guest/BookingHistory.jsx';
import { ServiceRequests } from './pages/Guest/ServiceRequests.jsx';
import { ContactFeedback } from './pages/Guest/ContactFeedback.jsx';
import { GuestCommunications } from './pages/Staff/GuestCommunications.jsx';
// import { ReceptionistDashboard } from './pages/Receptionist/ReceptionistDashboard.jsx';
import { ReceptionistModulePage } from './pages/Receptionist/ReceptionistModulePage.jsx';
import { ReceptionistAnalytics } from './pages/Receptionist/ReceptionistAnalytics.jsx';
import { RoomAvailability } from './pages/Receptionist/RoomAvailability.jsx';
import { ReceptionistSettings } from './pages/Receptionist/ReceptionistSettings.jsx';
import ManageBookingByRecep from './pages/Receptionist/ManageBookingByRecep/ManageBookingRecep.jsx';
import Invoice from './pages/Receptionist/Invoice/Invoice.jsx';
import { LandingPage } from './Landing.jsx';
import { GuestProfile } from './pages/Guest/Profile.jsx';
import { PrivacyPolicy } from './pages/Guest/PrivacyPolicy.jsx';
import { RoomDetails } from './pages/Guest/RoomDetails.jsx';
import { GuestProfiles } from './pages/Staff/GuestProfiles.jsx';
import ReceptionistServiceRequests from './pages/Receptionist/ServiceRequests/ReceptionistServiceRequests.jsx';
import { HousekeepingDashboard } from './pages/Housekeeping/HousekeepingDashboard.jsx';
import { TaskAssignmentBoard } from './pages/Housekeeping/TaskAssignmentBoard.jsx';

// Dedicated Luxury Public Pages
import { SuitesPage } from './pages/Public/SuitesPage.jsx';
import { StoryPage } from './pages/Public/StoryPage.jsx';
import { AmenitiesPage } from './pages/Public/AmenitiesPage.jsx';
import { ExperiencePage } from './pages/Public/ExperiencePage.jsx';
import { GalleryPage } from './pages/Public/GalleryPage.jsx';
import { ReviewsPage } from './pages/Public/ReviewsPage.jsx';
import { FaqPage } from './pages/Public/FaqPage.jsx';

const App = () => {
  return (
    <BrowserRouter>
      {/* <TopNav /> */}

      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/suites" element={<SuitesPage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/amenities" element={<AmenitiesPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />



        <Route path="/booking/:roomId" element={
          <ProtectedRoute allowedRoles={['guest']}>

            <Booking />
          </ProtectedRoute>
        } />
        <Route path="/rooms/:roomId" element={
          <RoomDetails />
        } />

        <Route path="/mybookings" element={
          <ProtectedRoute allowedRoles={["guest"]}>
            <BookingHistory />
          </ProtectedRoute>
        } />
        <Route path="/guest-service-requests" element={
          <ProtectedRoute allowedRoles={["guest"]}>
            <ServiceRequests />
          </ProtectedRoute>
        } />
        <Route path="/guest-contact" element={
          <ProtectedRoute allowedRoles={["guest"]}>
            <ContactFeedback type="contact" />
          </ProtectedRoute>
        } />
        <Route path="/guest-feedback" element={
          <ProtectedRoute allowedRoles={["guest"]}>
            <ContactFeedback type="feedback" />
          </ProtectedRoute>
        } />
        <Route path="/guest-privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/guest-contact-feedback" element={
          <ProtectedRoute allowedRoles={["guest"]}>
            <Navigate to="/guest-contact" replace />
          </ProtectedRoute>
        } />
        <Route path="/guest-contacts" element={
          <ProtectedRoute allowedRoles={["admin", "manager", "receptionist"]}>
            <GuestCommunications type="contact" />
          </ProtectedRoute>
        } />
        <Route path="/guest-feedback-inbox" element={
          <ProtectedRoute allowedRoles={["admin", "manager", "receptionist"]}>
            <GuestCommunications type="feedback" />
          </ProtectedRoute>
        } />
        <Route path="/guest-communications" element={
          <ProtectedRoute allowedRoles={["admin", "manager", "receptionist"]}>
            <GuestCommunications />
          </ProtectedRoute>
        } />
        <Route path="/admin-guests" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <GuestProfiles />
          </ProtectedRoute>
        } />
        <Route path="/housekeeping-dashboard" element={
          <ProtectedRoute allowedRoles={["housekeeping"]}>
            <HousekeepingDashboard />
          </ProtectedRoute>
        } />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Welcome-Admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff-Add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/upload"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UploadsRooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageStaffs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageStaffs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageRooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms/manage"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageRooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Manage-Bookings"
          element={
            <ProtectedRoute allowedRoles={["admin",'receptionist']}>
              <ManageBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSetting />
            </ProtectedRoute>
          }
        />

        <Route
          path="/policies/upload"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UploadsPolicies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/policies/manage"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManagePolicies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManagePolicies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service-requests"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <ManageServiceRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={<UserDashboard />}
        />
        {/* //manager routes starts from here */}
        <Route
          path="/Manage-Staff"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <Manager_ManageStaffs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Welcome-Manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-rooms"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <Manager_ManageRooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-settings"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Manager-Service-View"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <Manager_ManageServiceRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-housekeeping"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <TaskAssignmentBoard audience="manager" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Manager-View-Bookings"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <Manager_ManageBookings />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/receptionist-dashboard"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/receptionist-tasks"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <TaskAssignmentBoard audience="receptionist" showAssignment={false} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-housekeeping"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <TaskAssignmentBoard audience="receptionist" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-analytics"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-room-booking"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistModulePage title="Room Booking" subtitle="Check room reservations and room assignment" stats={[{ label: "Confirmed", value: "28" }, { label: "Pending", value: "07" }, { label: "Walk-ins", value: "03" }, { label: "No-shows", value: "01" }]} highlights={["Booking confirmation", "Room assignment", "Check-in planning"]} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-guests"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <GuestProfiles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-contact"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <GuestCommunications type="contact" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-feedback"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <GuestCommunications type="feedback" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-reporting"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistModulePage title="Reporting" subtitle="Daily and weekly operational reporting" stats={[{ label: "Daily Reports", value: "05" }, { label: "Weekly Reports", value: "02" }, { label: "Alerts", value: "03" }, { label: "Resolution", value: "87%" }]} highlights={["Shift summary", "Operational reporting", "Staff productivity overview"]} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-service-requests"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistServiceRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-room-availability"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <RoomAvailability />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-appointments"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistModulePage title="Appointments" subtitle="Manage key guest and service appointments" stats={[{ label: "Today", value: "06" }, { label: "Upcoming", value: "11" }, { label: "Missed", value: "01" }, { label: "Confirmed", value: "15" }]} highlights={["Upcoming appointments", "Guest scheduling", "Follow-up reminders"]} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-notifications"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistModulePage title="Notifications" subtitle="Track alerts, updates, and internal messages" stats={[{ label: "Unread", value: "08" }, { label: "Urgent", value: "02" }, { label: "Alerts", value: "05" }, { label: "Inbox", value: "24" }]} highlights={["Urgent alerts", "Shift handover", "Team updates"]} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/receptionist-settings"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistSettings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Manage-Bookings-By-Recep"
          element={
            <ProtectedRoute allowedRoles={['receptionist']}>
              <ManageBookingByRecep />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoice/:id"
          element={<Invoice />}
        />

        <Route

          path="/my-profile"
          element={<ProtectedRoute allowedRoles={['guest']}><GuestProfile /></ProtectedRoute>}

        />

      </Routes>

    
    </BrowserRouter>
  );
};

export default App;