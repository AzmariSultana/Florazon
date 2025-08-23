import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // axios instance
  const api = axios.create({
    baseURL: import.meta?.env?.VITE_API_BASE_URL || "http://localhost:4000",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    timeout: 10000
  });

  const testConnection = async () => {
    try {
      await api.get("/");
      return true;
    } catch (error) {
      setMessage({
        type: "error",
        text: `Cannot connect to server at ${api.defaults.baseURL}. Make sure your backend server is running.`
      });
      return false;
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        setMessage(null);
        const serverRunning = await testConnection();
        if (!serverRunning) {
          setLoading(false);
          return;
        }
        const { data } = await api.get("/api/user/me");
        if (data?.success) {
          setForm({ name: data.user.name || "", email: data.user.email || "" });
        } else {
          throw new Error(data?.message || "Failed to load profile");
        }
      } catch (err) {
        if (err.code === "ECONNREFUSED" || err.message?.includes("Network Error")) {
          setMessage({ type: "error", text: "Cannot connect to server." });
        } else if (err.response?.status === 404) {
          setMessage({ type: "error", text: "API endpoint not found. Please check your server routes." });
        } else if (err.response?.status === 401) {
          setMessage({ type: "error", text: "Authentication failed. Please log in again." });
        } else {
          setMessage({ type: "error", text: `Error: ${err.response?.data?.message || err.message}` });
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMe();
    } else {
      setLoading(false);
      setMessage({ type: "error", text: "No authentication token found. Please log in." });
    }
  }, [token]);

  const onSave = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      setSaving(true);
      const { data } = await api.patch("/api/user/me", form);
      if (data?.success) {
        setForm({ name: data.user.name, email: data.user.email });
        setMessage({ type: "success", text: "Profile updated successfully." });
      } else {
        throw new Error(data?.message || "Update failed");
      }
    } catch (err) {
      setMessage({ type: "error", text: `Update error: ${err.response?.data?.message || err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword.length < 8) return setMessage({ type: "error", text: "Password must be at least 8 characters" });
    if (newPassword !== confirmPassword) return setMessage({ type: "error", text: "Passwords do not match" });
    try {
      setChangingPw(true);
      const { data } = await api.patch("/api/user/me/password", { newPassword });
      if (data?.success) {
        setNewPassword("");
        setConfirmPassword("");
        setMessage({ type: "success", text: "Password updated successfully." });
      } else {
        throw new Error(data?.message || "Password update failed");
      }
    } catch (err) {
      setMessage({ type: "error", text: `Password error: ${err.response?.data?.message || err.message}` });
    } finally {
      setChangingPw(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">Profile</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>
        <div className="w-full px-3 py-2 border border-gray-800">
          <p className="text-sm">You need to log in to view this page. No authentication token found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-6 text-gray-800">
      {/* Title */}
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Profile</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Message */}
      {message && (
        <div className={`w-full px-3 py-2 border ${message.type === "success" ? "border-green-700" : "border-red-700"}`}>
          <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>{message.text}</p>
        </div>
      )}

      {/* Account Form */}
      <form onSubmit={onSave} className="flex flex-col items-center w-full gap-4">
        <div className="w-full">
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Your name"
            required
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="you@example.com"
            required
          />
        </div>
        <button type="submit" disabled={saving} className="bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? "Saving..." : "Save changes"}
        </button>
        {loading && <p className="text-xs opacity-70 mt-[-4px]">Loading profile...</p>}
      </form>

      {/* Divider */}
      <div className="w-full h-px bg-gray-800" />

      {/* Change Password */}
      <form onSubmit={onChangePassword} className="flex flex-col items-center w-full gap-4">
        <div className="w-full">
          <label className="block text-sm mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Minimum 8 characters"
            required
          />
        </div>
        <div className="w-full">
          <label className="block text-sm mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Re-enter new password"
            required
          />
        </div>
        <button type="submit" disabled={changingPw} className="bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {changingPw ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}