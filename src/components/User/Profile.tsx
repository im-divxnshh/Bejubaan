"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, db, storage } from "@/utils/FirebaseConfig";
import Swal from "sweetalert2";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  LockOutlined,
} from "@ant-design/icons";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // 🧩 Fetch User Data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);
            setNewName(data.name || "");
            setNewMobile(data.mobile || "");
            setPhotoURL(data.photoURL || null);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🖋️ Toggle edit mode
  const handleEditToggle = () => setEditing(!editing);

  // 💾 Save profile changes
  const handleSave = async () => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const userRef = doc(db, "users", uid);

    try {
      await updateDoc(userRef, {
        name: newName,
        mobile: newMobile,
        photoURL,
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile updated successfully!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setUserData({ ...userData, name: newName, mobile: newMobile, photoURL });
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to update profile!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // 📸 Upload profile photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!auth.currentUser || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    const uid = auth.currentUser.uid;
    const photoRef = ref(storage, `usersData/profilePhoto/${uid}.jpg`);

    try {
      setUploading(true);

      // Delete old photo if exists
      if (photoURL) {
        try {
          const oldRef = ref(storage, photoURL);
          await deleteObject(oldRef);
        } catch {
          console.warn("Previous photo deletion skipped.");
        }
      }

      // Upload new photo
      await uploadBytes(photoRef, file);
      const newPhotoURL = await getDownloadURL(photoRef);

      await updateDoc(doc(db, "users", uid), { photoURL: newPhotoURL });
      setPhotoURL(newPhotoURL);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Profile photo updated!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Photo upload failed!",
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setUploading(false);
    }
  };

  // 🔐 Forgot password
  const handleForgotPassword = async () => {
    if (!auth.currentUser?.email) return;

    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Password reset email sent!",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Password reset error:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Failed to send reset email!",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  if (loading)
    return <div className="p-6 bg-white rounded-xl shadow">⏳ Loading profile...</div>;

  if (!userData)
    return <div className="p-6 bg-white rounded-xl shadow">❌ No user data found.</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-5">
      <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
        <UserOutlined /> User Profile
      </h2>

      {/* Profile Photo */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <img
          src={photoURL || "/default-avatar.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover shadow"
        />
        <label
          className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition flex items-center gap-2 ${
            uploading && "opacity-50 cursor-not-allowed"
          }`}
        >
          <UploadOutlined />
          {uploading ? "Uploading..." : "Change Photo"}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Info Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-gray-600 font-medium mb-1  items-center gap-1">
            <UserOutlined /> Name
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={!editing}
            className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !editing ? "bg-gray-100" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1  items-center gap-1">
            <MailOutlined /> Email
          </label>
          <input
            type="email"
            value={userData.email || ""}
            disabled
            className="w-full border rounded-lg p-2 bg-gray-100 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1  items-center gap-1">
            <PhoneOutlined /> Mobile No.
          </label>
          <input
            type="tel"
            value={newMobile}
            onChange={(e) => setNewMobile(e.target.value)}
            disabled={!editing}
            className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !editing ? "bg-gray-100" : ""
            }`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        {!editing ? (
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <EditOutlined /> Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              <SaveOutlined /> Save
            </button>
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 px-5 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
            >
              <CloseOutlined /> Cancel
            </button>
          </>
        )}

        <button
          onClick={handleForgotPassword}
          className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
        >
          <LockOutlined /> Forgot Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
