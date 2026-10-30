import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

export default function ProfilePage() {
  const { backendUrl, token, logout, navigate } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  // axios instance
  const api = useMemo(() => axios.create({
    baseURL: backendUrl,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    timeout: 10000
  }), [backendUrl, token]);

  const describeError = (err, prefix) => {
    if (err.code === "ECONNREFUSED" || err.message?.includes("Network Error")) {
      return "Cannot connect to server. Make sure your backend server is running.";
    }
    return `${prefix}: ${err.response?.data?.message || err.message}`;
  };

  const handleUnauthorized = (err) => {
    if (err.response?.status === 401) {
      logout();
      navigate("/login");
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchMe = async () => {
      try {
        setLoading(true);
        setMessage(null);
        const { data } = await api.get("/api/user/me");
        if (data?.success) {
          setForm({ name: data.user.name || "", email: data.user.email || "" });
        } else {
          throw new Error(data?.message || "Failed to load profile");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        setMessage({ type: "error", text: describeError(err, "Error") });
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [api, token, logout, navigate]);

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
      if (handleUnauthorized(err)) return;
      setMessage({ type: "error", text: describeError(err, "Update error") });
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
      const { data } = await api.patch("/api/user/me/password", { currentPassword, newPassword });
      if (data?.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setMessage({ type: "success", text: "Password updated successfully." });
      } else {
        throw new Error(data?.message || "Password update failed");
      }
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setMessage({ type: "error", text: describeError(err, "Password error") });
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
          <p className="text-sm">You need to <Link to="/login" className="underline">log in</Link> to view this page.</p>
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
        <div role="status" className={`w-full px-3 py-2 border ${message.type === "success" ? "border-green-700" : "border-red-700"}`}>
          <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>{message.text}</p>
        </div>
      )}

      {/* Account Form */}
      <form onSubmit={onSave} className="flex flex-col items-center w-full gap-4">
        <div className="w-full">
          <label htmlFor="profile-name" className="block text-sm mb-1">Name</label>
          <input
            id="profile-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="profile-email" className="block text-sm mb-1">Email</label>
          <input
            id="profile-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
        <button type="submit" disabled={saving || loading} className="bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? "Saving..." : "Save changes"}
        </button>
        {loading && <p className="text-xs opacity-70 mt-[-4px]">Loading profile...</p>}
      </form>

      {/* Divider */}
      <div className="w-full h-px bg-gray-800" />

      {/* Change Password */}
      <form onSubmit={onChangePassword} className="flex flex-col items-center w-full gap-4">
        <div className="w-full">
          <label htmlFor="current-password" className="block text-sm mb-1">Current Password</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Your current password"
            autoComplete="current-password"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="new-password" className="block text-sm mb-1">New Password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="confirm-password" className="block text-sm mb-1">Confirm New Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Re-enter new password"
            autoComplete="new-password"
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
