import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import {
  UserRound,
  Mail,
  Building2,
  BriefcaseBusiness,
  ShieldCheck,
  Save,
  RefreshCw,
  Pencil,
  Camera,
  Upload,
  X,
} from "lucide-react";

import api from "../../services/api";

const MyProfile = () => {
  const [employee, setEmployee] = useState(null);

  const [form, setForm] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  // IMAGE STATES
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  // FETCH PROFILE IMAGE WITH JWT
  const fetchProfileImage = async () => {
    try {
      const response = await api.get("/employee/me/image", {
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(response.data);

      setProfileImage((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return imageUrl;
      });
    } catch (err) {
      // 404 means employee has not uploaded a DP yet
      if (err.response?.status !== 404) {
        console.error("Profile image fetch failed:", err);
      }

      setProfileImage((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
    }
  };

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/employee/me");

      const profile = data.employee || data.user || data;

      setEmployee(profile);

      setForm({
        name: profile.name || "",
      });

      if (profile.profileImage?.filename) {
        await fetchProfileImage();
      } else {
        setProfileImage((previous) => {
          if (previous) URL.revokeObjectURL(previous);
          return null;
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    return () => {
      // Object URLs are released when images are replaced.
    };
  }, []);

  // SELECT IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must not exceed 2 MB");
      e.target.value = "";
      return;
    }

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setPreviewImage(previewUrl);
  };

  // CANCEL IMAGE SELECTION
  const cancelImageSelection = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setSelectedImage(null);
    setPreviewImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // UPLOAD / UPDATE PROFILE IMAGE
  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      // Must match backend upload.single("image")
      formData.append("image", selectedImage);

      await api.put("/employee/me/image", formData);

      toast.success("Profile photo updated successfully");

      cancelImageSelection();

      // Fetch newly uploaded image
      await fetchProfileImage();

      // Refresh employee data
      const { data } = await api.get("/employee/me");

      setEmployee(data.employee || data.user || data);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to upload profile photo"
      );
    } finally {
      setUploading(false);
    }
  };

  // UPDATE NAME
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      const { data } = await api.put("/employee/me", {
        name: form.name.trim(),
      });

      const updatedProfile =
        data.employee || data.user || data;

      setEmployee(updatedProfile);

      const storedUser = JSON.parse(
        sessionStorage.getItem("worknest_user") || "{}"
      );

      sessionStorage.setItem(
        "worknest_user",
        JSON.stringify({
          ...storedUser,
          name: updatedProfile.name || form.name.trim(),
        })
      );

      toast.success("Profile updated successfully");

      setEditing(false);

      await fetchProfile();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

        <p className="text-sm text-slate-500">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-700">{error}</p>

        <button
          onClick={fetchProfile}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-7">

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-indigo-600">
            MY WORKSPACE
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal details and profile photo.
          </p>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Pencil size={17} />
            Edit Profile
          </button>
        )}
      </div>

      {/* MAIN PROFILE CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* DARK PROFILE BANNER */}
        <div className="bg-[#101B3C] p-7 sm:p-9">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">

            {/* PROFILE IMAGE */}
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/20 bg-indigo-500 text-3xl font-bold text-white shadow-xl">

                {previewImage || profileImage ? (
                  <img
                    src={previewImage || profileImage}
                    alt="Employee profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  employee.name?.charAt(0)?.toUpperCase() || "E"
                )}

              </div>

              {/* CAMERA BUTTON */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#101B3C] bg-white text-indigo-600 shadow-lg transition hover:bg-indigo-50"
              >
                <Camera size={17} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* PROFILE DETAILS */}
            <div className="min-w-0">
              <h2 className="break-words text-2xl font-bold text-white">
                {employee.name}
              </h2>

              <p className="mt-2 break-all text-sm text-slate-300">
                {employee.email}
              </p>

              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                <ShieldCheck size={13} />
                Employee Account
              </span>
            </div>
          </div>
        </div>

        {/* IMAGE UPLOAD SECTION */}
        {selectedImage && (
          <div className="flex flex-col gap-4 border-b border-indigo-100 bg-indigo-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-indigo-900">
                New profile photo selected
              </p>

              <p className="mt-1 truncate text-xs text-indigo-600">
                {selectedImage.name}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelImageSelection}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleImageUpload}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                <Upload size={16} />
                {uploading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="p-6 sm:p-9">

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Edit Personal Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Update your name below.
                </p>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm({ name: employee.name || "" });
                  }}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="mb-6 text-lg font-bold text-slate-900">
                Account Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    label: "Full Name",
                    value: employee.name,
                    icon: UserRound,
                  },
                  {
                    label: "Email Address",
                    value: employee.email,
                    icon: Mail,
                  },
                  {
                    label: "Department",
                    value: employee.department,
                    icon: Building2,
                  },
                  {
                    label: "Designation",
                    value: employee.designation,
                    icon: BriefcaseBusiness,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-5"
                  >
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Icon size={17} />
                      {label}
                    </div>

                    <p className="mt-3 break-words text-sm font-semibold text-slate-900">
                      {value || "Not provided"}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;