import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, BedDouble, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GuestShell } from "../../Components/Guest/GuestShell.jsx";


const API = `${import.meta.env?.VITE_API_URL || "http://localhost:5000/api"}/ManageRooms/public`;
const authConfig = () => ({
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
});
const money = (value) => new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
}).format(Number(value) || 0);

export const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios.get(API, authConfig())
      .then(({ data }) => {
        if (!active) return;
        const rooms = Array.isArray(data) ? data : data?.rooms || data?.data || [];
        const match = rooms.find((item) => item._id === roomId);
        if (!match) setError("This room could not be found.");
        setRoom(match || null);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Room details could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [roomId]);

  const images = room?.images
    ? (Array.isArray(room.images) ? room.images : [room.images]).filter((image) => typeof image === "string" && image.trim())
    : [];
  const isAvailable = String(room?.status || "").toLowerCase() === "available" && room?.isActive !== false;

  return (
    <GuestShell>
      <Link to="/user-dashboard" className="guest-text-link"><ArrowLeft size={15} /> Back to rooms</Link>
      {loading ? (
        <div className="guest-empty-state mt-6">Loading room details…</div>
      ) : error ? (
        <div className="guest-alert mt-6" role="alert">{error}</div>
      ) : room && (
        <article className="mt-6 overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.35fr_0.85fr]">
            <section className="min-w-0">
              <div className="relative h-72 bg-slate-100 sm:h-[440px]">
                {images.length ? (
                  <img src={images[activeImage] || images[0]} alt={`${room.roomType} room ${room.roomNumber}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center font-serif text-5xl text-emerald-700">A</div>
                )}
                <span className="absolute left-4 top-4 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-emerald-800">{room.roomType}</span>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-3">
                  {images.map((image, index) => (
                    <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(index)} aria-label={`Show room photo ${index + 1}`} aria-pressed={activeImage === index} className={`h-16 w-24 shrink-0 overflow-hidden border-2 ${activeImage === index ? "border-emerald-700" : "border-transparent"}`}>
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="flex flex-col p-6 sm:p-8">
              <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                {isAvailable ? "Available" : String(room.status || "Unavailable").replaceAll("-", " ")}
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{room.roomType} · Room {room.roomNumber}</p>
              <h1 className="mt-2 font-serif text-4xl text-slate-800">Room {room.roomNumber}</h1>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {room.description || "A considered space to rest, reset, and make the most of your stay."}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-slate-50 p-4">
                  <Users size={19} className="text-emerald-700" />
                  <div><span className="block text-xs text-slate-500">Maximum guests</span><strong className="text-sm text-slate-800">{room.capacity || 2} guests</strong></div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-4">
                  <BedDouble size={19} className="text-emerald-700" />
                  <div><span className="block text-xs text-slate-500">Room type</span><strong className="text-sm text-slate-800">{room.roomType}</strong></div>
                </div>
              </div>

              <div className="mt-auto border-t border-slate-200 pt-6">
                <div className="mb-5 flex items-end justify-between gap-3">
                  <span className="text-xs text-slate-500">Price per night</span>
                  <strong className="text-2xl text-emerald-800">{money(room.pricePerNight)} <small className="text-xs font-normal text-slate-500">/ night</small></strong>
                </div>
                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => navigate(sessionStorage.getItem("role") === "guest" ? `/booking/${room._id}` : "/login")}
                  className="flex w-full items-center justify-center gap-2 bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isAvailable ? "Choose this room" : "Currently unavailable"} {isAvailable && <ArrowRight size={16} />}
                </button>
              </div>
            </section>
          </div>
        </article>
      )}
    </GuestShell>
  );
};
