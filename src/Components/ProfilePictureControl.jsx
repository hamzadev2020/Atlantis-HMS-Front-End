import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Camera, UserRound } from "lucide-react";
import { uploadImage } from "../config/cloudinary.js";

const PROFILE_API = `${import.meta.env?.VITE_API_URL || "http://localhost:5000/api"}/ManageProfile`;

export const ProfilePictureControl = ({ accent = "sky", showDetails = false }) => {
  const inputRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios.get(`${PROFILE_API}/viewprofile`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }).then(({ data }) => {
      if (active) setProfile(data);
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || "Profile could not be loaded.");
    });
    return () => {
      active = false;
    };
  }, []);

  const changePhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const profileImage = await uploadImage(file);
      const { data } = await axios.post(`${PROFILE_API}/updateprofile`, { profileImage }, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setProfile((current) => ({ ...current, ...data.user }));
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || uploadError.message || "Profile photo could not be saved.");
    } finally {
      setUploading(false);
    }
  };

  const ringColor = accent === "emerald" ? "ring-emerald-200" : accent === "violet" ? "ring-violet-200" : "ring-sky-200";

  return (
    <div className={`relative flex items-center gap-3 ${showDetails ? "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" : ""}`}>
      <input ref={inputRef} className="sr-only" type="file" accept="image/*" onChange={changePhoto} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        title={error || (uploading ? "Uploading profile photo…" : "Upload profile photo")}
        aria-label={error || (uploading ? "Uploading profile photo" : "Upload profile photo")}
        className={`group relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-500 ring-2 ${showDetails ? "h-16 w-16" : "h-10 w-10"} ${ringColor} disabled:opacity-60`}
      >
        {profile?.profileImage
          ? <img src={profile.profileImage} alt="" className="h-full w-full object-cover" />
          : <span className="font-semibold">{profile?.name?.trim()?.charAt(0)?.toUpperCase() || <UserRound size={18} />}</span>}
        <span className="absolute inset-0 grid place-items-center bg-slate-900/55 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Camera size={15} />
        </span>
      </button>
      <span className={`${showDetails ? "min-w-0" : "hidden max-w-28 xl:block"} truncate text-xs text-slate-600`}>
        <strong className="block truncate text-sm text-slate-800">{uploading ? "Uploading…" : profile?.name || "Loading profile…"}</strong>
        {showDetails && <>
          <span className="mt-0.5 block truncate text-slate-500">{profile?.email || ""}</span>
          <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] capitalize text-slate-600">{profile?.role || ""}</span>
          <span className="mt-1 block text-[10px] text-slate-400">Select the photo to update your profile image.</span>
        </>}
      </span>
      {error && <span role="alert" className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg bg-red-50 p-2 text-xs text-red-700 shadow">{error}</span>}
    </div>
  );
};
