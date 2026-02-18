"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser } from "@/lib/auth";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [passwordSectionOpen, setPasswordSectionOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    login: "",
    email: "",
    phone: "",
    profileImage: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    setFormData({
      name: currentUser.name || "",
      surname: currentUser.surname || "",
      login: currentUser.login || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      profileImage: currentUser.profileImage || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    if (currentUser.profileImage) {
      setPreview(currentUser.profileImage);
    }

    setLoading(false);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          profileImage: base64String,
        }));
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      profileImage: "",
    }));
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    // Validate passwords match if changing password
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match");
        setSaving(false);
        return;
      }
      if (!formData.currentPassword) {
        setError("Current password required to change password");
        setSaving(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        setSaving(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": getCurrentUser().id,
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          login: formData.login,
          email: formData.email,
          phone: formData.phone,
          profileImage: formData.profileImage,
          ...(formData.newPassword && {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      const updatedUser = await response.json();

      // Update context with new user data
      updateUser({
        ...user,
        ...updatedUser,
      } as any);

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setPasswordSectionOpen(false);

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">{t("profile", "loadingProfile")}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">{t("profile", "pleaseLogin")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text gradient-text mb-2">
            {t("profile", "title")}
          </h1>
          <p className="text-slate-400">{t("profile", "subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="card-base p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-900/30 border border-green-700/50 rounded-lg text-green-300 text-sm">
              {success}
            </div>
          )}

          {/* Profile Image Section */}
          <div className="border-b border-slate-700 pb-6">
            <h2 className="text-xl font-semibold text-white mb-4">{t("profile", "profileImage")}</h2>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-24 h-24 rounded-lg object-cover border-2 border-slate-600"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                    {user.name?.charAt(0)}{user.surname?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition cursor-pointer"
                />
                <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                {preview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-red-400 hover:text-red-300 transition"
                  >
                    {t("profile", "removeImage")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="border-b border-slate-700 pb-6">
            <h2 className="text-xl font-semibold text-white mb-4">{ t("profile", "name") }</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  {t("profile", "name")} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  {t("profile", "surname")} *
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-b border-slate-700 pb-6">
            <h2 className="text-xl font-semibold text-white mb-4">{t("profile", "email")}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  {t("profile", "login")} *
                </label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  {t("profile", "email")} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  {t("profile", "phone")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="border-b border-slate-700 pb-6">
            <button
              type="button"
              onClick={() => setPasswordSectionOpen(!passwordSectionOpen)}
              className="flex items-center gap-2 text-white font-semibold mb-4 hover:text-blue-400 transition"
            >
              <span className="text-xl">{passwordSectionOpen ? "▼" : "▶"}</span>
              {t("profile", "changePassword")}
            </button>

            {passwordSectionOpen && (
              <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    {t("profile", "currentPassword")} *
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter your current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    {t("profile", "newPassword")} *
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    {t("profile", "confirmPassword")} *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t("profile", "saving") : t("profile", "saveChanges")}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-2 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition font-medium"
            >
              {t("common", "cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
