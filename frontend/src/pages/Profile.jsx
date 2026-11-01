import React, { useContext, useEffect, useMemo, useState } from "react";
import Title from "../components/Title";
import EmptyState from "../components/EmptyState";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import useDocumentTitle from "../utils/useDocumentTitle";

export default function Profile() {
  const { backendUrl, token, logout, navigate } = useContext(ShopContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  useDocumentTitle("My Profile");

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
      <div className="pt-6 sm:pt-10">
        <Title as="h1" eyebrow="Your account" text1={"MY"} text2={"PROFILE"} size="text-4xl sm:text-5xl" />
        <EmptyState
          title="Sign in to manage your profile"
          text="Update your details and password in one place."
          action={{ to: "/login", state: { from: "/user-profile" }, label: "Log in" }}
        />
      </div>
    );
  }

  return (
    <div className="card flex flex-col items-center w-full max-w-md m-auto mt-10 sm:mt-16 gap-6 p-6 sm:p-10 text-gray-800 animate-fade-up">
      {/* Title */}
      <div className="text-center">
        <p className="eyebrow">Your account</p>
        <h1 className="mt-2 font-display text-4xl text-ink">My <span className="text-brand">Profile</span></h1>
      </div>

      {/* Message */}
      {message && (
        <div role="status" className={`w-full rounded-2xl px-4 py-3 border ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>{message.text}</p>
        </div>
      )}

      {/* Account Form */}
      <form onSubmit={onSave} className="flex flex-col items-center w-full gap-4">
        <p className="eyebrow self-start">Account details</p>
        <div className="w-full">
          <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
          <input
            id="profile-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="field"
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            id="profile-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="field"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
        <button type="submit" disabled={saving || loading} className="btn-primary w-full mt-1">
          {saving ? "Saving..." : "Save changes"}
        </button>
        {loading && <p className="text-xs opacity-70 mt-[-4px]">Loading profile...</p>}
      </form>

      {/* Divider */}
      <div className="w-full h-px bg-line" />

      {/* Change Password */}
      <form onSubmit={onChangePassword} className="flex flex-col items-center w-full gap-4">
        <p className="eyebrow self-start">Change password</p>
        <div className="w-full">
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
          <input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="field"
            placeholder="Your current password"
            autoComplete="current-password"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="field"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="w-full">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="field"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" disabled={changingPw} className="btn-primary w-full mt-1">
          {changingPw ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
