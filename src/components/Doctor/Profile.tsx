'use client';

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
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
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Image } from "antd";

interface DoctorProfileType {
    name: string;
    email: string;
    mobile: string;
    specialization?: string;
    qualification?: string;
    photoURL?: string | null;
    aadharCardPhoto?: string | null;
    panCardPhoto?: string | null;

}

const DoctorProfile: React.FC = () => {
    const [doctorData, setDoctorData] = useState<DoctorProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [newName, setNewName] = useState("");
    const [newMobile, setNewMobile] = useState("");
    const [newSpecialization, setNewSpecialization] = useState("");
    const [newQualification, setNewQualification] = useState("");
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [aadharCardPhoto, setAadharCardPhoto] = useState<string | null>(null);
    const [panCardPhoto, setPanCardPhoto] = useState<string | null>(null);

    const [uploading, setUploading] = useState(false);

    // Fetch doctor data
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) return;
            try {
                const docRef = doc(db, "doctors", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as DoctorProfileType;
                    setDoctorData(data);
                    setNewName(data.name || "");
                    setNewMobile(data.mobile || "");
                    setNewSpecialization(data.specialization || "");
                    setNewQualification(data.qualification || "");
                    setPhotoURL(data.photoURL || null);
                    setAadharCardPhoto(data.aadharCardPhoto || null);
                    setPanCardPhoto(data.panCardPhoto || null);

                }
            } catch (err) {
                console.error("Error fetching doctor data:", err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleEditToggle = () => setEditing(!editing);

    const handleSave = async () => {
        if (!auth.currentUser || !doctorData) return;
        const uid = auth.currentUser.uid;
        const docRef = doc(db, "doctors", uid);

        try {
            await updateDoc(docRef, {
                name: newName,
                mobile: newMobile,
                specialization: newSpecialization,
                qualification: newQualification,
                photoURL,
            });

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Profile updated successfully!",
                showConfirmButton: false,
                timer: 2000,
            });

            setDoctorData({
                ...doctorData,
                name: newName,
                mobile: newMobile,
                specialization: newSpecialization,
                qualification: newQualification,
                photoURL,
            });

            setEditing(false);
        } catch (error) {
            console.error(error);
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

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!auth.currentUser || !e.target.files?.[0]) return;

        const file = e.target.files[0];
        const uid = auth.currentUser.uid;
        const photoRef = ref(storage, `doctorsData/profilePhoto/${uid}.jpg`);

        try {
            setUploading(true);

            // Delete old photo if exists
            if (photoURL) {
                try {
                    const oldRef = ref(storage, photoURL);
                    await deleteObject(oldRef);
                } catch {
                    console.warn("Old photo deletion skipped");
                }
            }

            await uploadBytes(photoRef, file);
            const newPhotoURL = await getDownloadURL(photoRef);
            await updateDoc(doc(db, "doctors", uid), { photoURL: newPhotoURL });
            setPhotoURL(newPhotoURL);

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Profile photo updated!",
                showConfirmButton: false,
                timer: 2000,
            });
        } catch (err) {
            console.error(err);
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

    if (loading)
        return <div className="p-6 bg-white rounded-xl shadow">⏳ Loading profile...</div>;
    if (!doctorData)
        return <div className="p-6 bg-white rounded-xl shadow">❌ No doctor data found.</div>;

    return (
        <div className="p-6 bg-white rounded-xl shadow space-y-5">
            <h2 className="text-xl font-semibold text-green-600 flex items-center gap-2">
                <UserOutlined /> Doctor Profile
            </h2>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                {/* Left side - Profile Photo & Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <img
                        src={photoURL || "/logo.jpg"}
                        alt="Doctor"
                        className="w-28 h-28 rounded-full object-cover shadow"
                    />
                    <label
                        className={`cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition flex items-center gap-2 ${uploading && "opacity-50 cursor-not-allowed"
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

                {/* Right side - Two logos */}
                <div className="flex flex-row gap-4">
                    <Image.PreviewGroup>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg overflow-hidden shadow border border-gray-200 hover:shadow-md transition w-38">
                                <Image
                                    src={aadharCardPhoto || "/logo.jpg"}
                                    alt="Aadhaar Card"
                                    className="w-full h-24 object-cover"
                                    preview={{
                                        mask: <span className="text-white text-sm">View Aadhaar</span>,
                                    }}
                                />
                                <p className="text-center py-1 text-sm font-medium text-gray-700 bg-gray-50">
                                    Aadhaar
                                </p>
                            </div>

                            <div className="rounded-lg overflow-hidden shadow border border-gray-200 hover:shadow-md transition w-38">
                                <Image
                                    src={panCardPhoto || "/logo.jpg"}
                                    alt="PAN Card"
                                    className="w-full h-24 object-cover"
                                    preview={{
                                        mask: <span className="text-white text-sm">View PAN</span>,
                                    }}
                                />
                                <p className="text-center py-1 text-sm font-medium text-gray-700 bg-gray-50">
                                    PAN
                                </p>
                            </div>
                        </div>
                    </Image.PreviewGroup>
                </div>

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
                        className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${!editing ? "bg-gray-100" : ""
                            }`}
                    />
                </div>

                <div>
                    <label className="block text-gray-600 font-medium mb-1  items-center gap-1">
                        <MailOutlined /> Email
                    </label>
                    <input
                        type="email"
                        value={doctorData.email || ""}
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
                        className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${!editing ? "bg-gray-100" : ""
                            }`}
                    />
                </div>

                <div>
                    <label className="block text-gray-600 font-medium mb-1  items-center gap-1">
                        <SafetyCertificateOutlined /> Specialization
                    </label>
                    <input
                        type="text"
                        value={newSpecialization}
                        onChange={(e) => setNewSpecialization(e.target.value)}
                        disabled={!editing}
                        className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${!editing ? "bg-gray-100" : ""
                            }`}
                    />
                </div>

                <div>
                    <label className="block text-gray-600 font-medium mb-1  items-center gap-1">
                        <SafetyCertificateOutlined /> Qualification
                    </label>
                    <input
                        type="text"
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        disabled={!editing}
                        className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${!editing ? "bg-gray-100" : ""
                            }`}
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
                {!editing ? (
                    <button
                        onClick={handleEditToggle}
                        className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                    >
                        <EditOutlined /> Edit Profile
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
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
            </div>
        </div>
    );
};

export default DoctorProfile;
