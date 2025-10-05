"use client";

import React, { useState, useEffect } from "react";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
    getDownloadURL,
    ref,
    uploadBytes,
    deleteObject,
} from "firebase/storage";
import { Modal, Image } from "antd";
import Swal from "sweetalert2";
import { auth, db, storage } from "@/utils/FirebaseConfig";
import { Button, Input } from "antd";
import {
    DeleteOutlined,
    EyeOutlined,
    UploadOutlined,
} from "@ant-design/icons";

interface Doctor {
    id: string;
    name: string;
    email: string;
    mobile: string;
    createdAt: string;
    photoURL: string;
    aadharCardPhoto?: string;
    panCardPhoto?: string;
}

const AddingDoctor: React.FC = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        aadharCardPhoto: null as File | null,
        panCardPhoto: null as File | null,
        photoURL: null as File | null,
    });
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [previewAadhar, setPreviewAadhar] = useState<string | null>(null);
    const [previewPan, setPreviewPan] = useState<string | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [search, setSearch] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    // ✅ Real-time listener for doctors
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "doctors"), (snapshot) => {
            const docs = snapshot.docs.map(
                (d) => ({ id: d.id, ...d.data() } as Doctor)
            );
            setDoctors(docs);
        });
        return () => unsub();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setForm((prev) => ({ ...prev, [name]: file }));
            const reader = new FileReader();
            reader.onload = () => {
                if (name === "photoURL") setPreviewPhoto(reader.result as string);
                if (name === "aadharCardPhoto") setPreviewAadhar(reader.result as string);
                if (name === "panCardPhoto") setPreviewPan(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const uploadFile = async (file: File, path: string) => {
        const fileRef = ref(storage, path);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    };

    const handleAddDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCred = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );
            const uid = userCred.user.uid;

            const photoURL = form.photoURL
                ? await uploadFile(form.photoURL, `doctorsData/profilePhoto/${uid}`)
                : "";
            const aadharURL = form.aadharCardPhoto
                ? await uploadFile(form.aadharCardPhoto, `doctorsData/aadhar/${uid}`)
                : "";
            const panURL = form.panCardPhoto
                ? await uploadFile(form.panCardPhoto, `doctorsData/pan/${uid}`)
                : "";

            await setDoc(doc(db, "doctors", uid), {
                name: form.name,
                email: form.email,
                mobile: form.mobile,
                createdAt: new Date().toISOString(),
                photoURL,
                aadharCardPhoto: aadharURL,
                panCardPhoto: panURL,
            });

            Swal.fire({
                icon: "success",
                title: "Doctor Added Successfully!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
            });

            setForm({
                name: "",
                email: "",
                mobile: "",
                password: "",
                aadharCardPhoto: null,
                panCardPhoto: null,
                photoURL: null,
            });
            setPreviewPhoto(null);
            setPreviewAadhar(null);
            setPreviewPan(null);
        } catch (error: unknown) {
            let message = "Unknown error";
            if (error instanceof Error) message = error.message;
            Swal.fire({ icon: "error", title: "Error", text: message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the doctor profile, their documents, and account!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!confirm.isConfirmed) return;

        try {
            setLoadingDelete(true); // start spinner

            const res = await fetch("/api/doctors/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid: id }),
            });

            if (!res.ok) throw new Error("Failed to delete doctor");

            Swal.fire({
                icon: "success",
                title: "Doctor Deleted!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1500,
            });

            setViewOpen(false);
        } catch (error: unknown) {
            let message = "Unknown error";
            if (error instanceof Error) message = error.message;
            Swal.fire({ icon: "error", title: "Error", text: message });
        } finally {
            setLoadingDelete(false); // stop spinner
        }
    };



    const filteredDoctors = doctors.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 min-h-screen">
            {/* Left Section */}
            <div className="bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Add New Doctor</h2>
                <form onSubmit={handleAddDoctor} className="space-y-5">
                    <div>
                        <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="py-2" />
                        <Input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                        <Input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} required />
                        <Input.Password name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                    </div>
                    {/* Upload Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-3">
                        {[{ label: "Profile", preview: previewPhoto, name: "photoURL" },
                        { label: "Aadhar", preview: previewAadhar, name: "aadharCardPhoto" },
                        { label: "PAN", preview: previewPan, name: "panCardPhoto" }].map(({ label, preview, name }) => (
                            <div key={name} className="flex flex-col items-center">
                                {preview ? (
                                    <div className="relative group">
                                        <img src={preview} alt={label} className="w-24 h-24 rounded-lg object-cover border" />
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => selectedDoctor && handleDelete(selectedDoctor.id)}
                                            className="rounded-lg px-5 py-2 font-semibold shadow hover:scale-105 transition-transform"
                                            loading={loadingDelete} // this will show spinner automatically
                                        >
                                            Delete Doctor
                                        </Button>

                                    </div>
                                ) : (
                                    <label className="w-24 h-24 border rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                        <UploadOutlined className="text-2xl text-gray-500" />
                                        <input type="file" name={name} className="hidden" onChange={handleChange} accept="image/*" />
                                    </label>
                                )}
                                <span className="text-xs mt-2 text-gray-500">{label}</span>
                            </div>
                        ))}
                    </div>

                    <Button
                        htmlType="submit"
                        type="primary"
                        loading={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-4"
                    >
                        {loading ? "Adding..." : "Add Doctor"}
                    </Button>
                </form>
            </div>

            {/* Right Section */}
            <div className="bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-semibold mb-6">Manage Doctors</h2>
                <Input
                    placeholder="Search Doctor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-5"
                />
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {filteredDoctors.length === 0 ? (
                        <p className="text-gray-400 text-center">No doctors found</p>
                    ) : (
                        filteredDoctors.map((d) => (
                            <div
                                key={d.id}
                                className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={d.photoURL}
                                        alt={d.name}
                                        className="w-10 h-10 rounded-full object-cover border"
                                    />
                                    <div>
                                        <p className="font-semibold">{d.name}</p>
                                        <p className="text-sm text-gray-500">{d.email}</p>
                                    </div>
                                </div>
                                <Button
                                    icon={<EyeOutlined />}
                                    type="primary"
                                    onClick={() => {
                                        setSelectedDoctor(d);
                                        setViewOpen(true);
                                    }}
                                >
                                    View
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal
                open={viewOpen}
                onCancel={() => setViewOpen(false)}
                footer={null}
                title={null}
                centered
                className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white/70 to-gray-100/60 backdrop-blur-md"
            >
                {selectedDoctor && (
                    <div className="space-y-5 p-2 sm:p-4 md:p-6">
                        {/* Header Section */}
                        <div className="flex flex-col items-center text-center">
                            <Image
                                src={selectedDoctor.photoURL}
                                alt="Doctor"
                                width={100}
                                height={100}
                                className="rounded-full object-cover shadow-lg border border-gray-300"
                                preview={{
                                    mask: <span className="text-white text-sm">View Photo</span>,
                                }}
                            />
                            <h2 className="text-2xl font-bold text-gray-800 mt-3">{selectedDoctor.name}</h2>
                            <p className="text-gray-500 text-sm">Doctor Profile</p>
                        </div>

                        {/* Info Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                            <p><b>Email:</b> {selectedDoctor.email}</p>
                            <p><b>Mobile:</b> {selectedDoctor.mobile}</p>
                            <p><b>Created:</b> {new Date(selectedDoctor.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Aadhaar & PAN Photos with Preview Group */}
                        <div className="mt-5">
                            <p className="text-lg font-semibold mb-3 text-gray-700">Documents</p>
                            <Image.PreviewGroup>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition">
                                        <Image
                                            src={selectedDoctor.aadharCardPhoto}
                                            alt="Aadhaar Card"
                                            className="w-full h-40 object-cover"
                                            preview={{
                                                mask: <span className="text-white">View Aadhaar</span>,
                                            }}
                                        />
                                        <p className="text-center py-2 font-medium text-gray-700 bg-gray-50">Aadhaar Card</p>
                                    </div>
                                    <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition">
                                        <Image
                                            src={selectedDoctor.panCardPhoto}
                                            alt="PAN Card"
                                            className="w-full h-40 object-cover"
                                            preview={{
                                                mask: <span className="text-white">View PAN</span>,
                                            }}
                                        />
                                        <p className="text-center py-2 font-medium text-gray-700 bg-gray-50">PAN Card</p>
                                    </div>
                                </div>
                            </Image.PreviewGroup>
                        </div>

                        {/* Delete Button */}
                        <div className="flex justify-end mt-6">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(selectedDoctor.id)}
                                className="rounded-lg px-5 py-2 font-semibold shadow hover:scale-105 transition-transform"
                            >
                                Delete Doctor
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default AddingDoctor;
