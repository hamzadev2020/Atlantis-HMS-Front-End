import { useEffect, useState } from "react";
import axios from "axios";
import { FileText } from "lucide-react";
import { GuestShell } from "../../Components/Guest/GuestShell.jsx";

const API = `${import.meta.env?.VITE_API_URL || "http://localhost:5000/api"}/policies/public`;
const API_BASE = import.meta.env.VITE_API_URL;
export const PrivacyPolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    axios.get(API, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    }).then(({ data }) => {
      if (active) setPolicies((data.policies || []).filter((policy) => policy.type === "privacy"));
    }).catch((requestError) => {
      if (active) setError(requestError.response?.data?.message || "Privacy policy could not be loaded.");
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <GuestShell>
      <header className="guest-page-heading">
        <div>
          <span className="guest-eyebrow">YOUR INFORMATION</span>
          <h1>Privacy policy</h1>
          <p>Review how the hotel handles and protects your information.</p>
        </div>
      </header>
      {error && <div className="guest-alert" role="alert">{error}</div>}
      {loading ? (
        <div className="guest-empty-state">Loading privacy policy…</div>
      ) : policies.length ? (
        <div className="mt-6 space-y-5">
          {policies.map((policy) => (
            <article key={policy._id} className="border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center bg-emerald-50 text-emerald-700"><FileText size={19} /></span>
                <h2 className="text-xl font-semibold text-slate-800">{policy.Heading}</h2>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">{policy.Descriptions}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="guest-empty-state mt-6">The hotel has not published a privacy policy yet.</div>
      )}
    </GuestShell>
  );
};
