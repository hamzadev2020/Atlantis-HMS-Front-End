import axios from 'axios';
import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL;


export const Myprofile = () => {
  const [profile, setprofile] = useState({});
  const [updateprofile, setUpdateProfile] = useState({ name: "", password: "" });
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle karne ke liye

  const GetToken = () => {
    const gettoken = sessionStorage.getItem("token");
    if (gettoken) {
      const settoken = "Bearer " + gettoken;
      axios.defaults.headers.common["Authorization"] = settoken;
    }
  };

  const GetProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/ManageProfile/viewprofile`);
      setprofile(res.data);
      // Form fields ko purane data se pre-fill karne ke liye
      setUpdateProfile({ name: res.data.name, password: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const HandleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/ManageProfile/updateprofile`, updateprofile);
      console.log(res);
      setIsEditing(false); // Update ke baad form band karne ke liye
      GetProfile(); // Naya data dubara fetch karne ke liye
    } catch (error) {
      console.log(error);
    }
  };

  // Inputs ki value change handle karne ke liye
  const handleInputChange = (e) => {
    setUpdateProfile({ ...updateprofile, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    GetToken();
    GetProfile();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Profile Header / Avatar */}
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
          <span style={styles.roleBadge}>{profile.role || "User"}</span>
        </div>

        {/* Conditional Rendering: Agar Edit mode on hai to form dikhao, warna details */}
        {!isEditing ? (
          <div style={styles.detailsSection}>
            <h2 style={styles.name}>{profile.name}</h2>
            <p style={styles.email}>✉️ {profile.email}</p>

            <button style={styles.editBtn} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={HandleUpdateProfile} style={styles.form}>
            <h3 style={styles.formTitle}>Update Profile</h3>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                name="name"
                value={updateprofile.name}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                name="password"
                value={updateprofile.password}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Leave blank to keep unchanged"
              />
            </div>

            <div style={styles.btnGroup}>
              <button type="submit" style={styles.saveBtn}>Save Changes</button>
              <button type="button" style={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    );
};

// Inline CSS Styles (Aap isko apni CSS file mein bhi convert kar sakte hain)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    background: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  avatarSection: {
    position: 'relative',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: '90px',
    height: '90px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  roleBadge: {
    marginTop: '10px',
    backgroundColor: '#e0e7ff',
    color: '#4338ca',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  detailsSection: {
    marginTop: '10px',
  },
  name: {
    fontSize: '24px',
    margin: '10px 0 5px 0',
    color: '#1f2937',
  },
  email: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '25px',
  },
  editBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  form: {
    textAlign: 'left',
    marginTop: '10px',
  },
  formTitle: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#1f2937',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#4b5563',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  btnGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  saveBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#9ca3af',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
