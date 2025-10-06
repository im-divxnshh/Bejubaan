'use client';

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/utils/FirebaseConfig";
import { Card, Button, Input, Spin, Tag, Empty, Image, Segmented } from "antd";
import Swal from "sweetalert2";

interface ReportType {
    reportId: string;
    userId: string;
    doctorId: string;
    animal: string;
    breed: string;
    ageType: string;
    condition: string;
    status: string;
    address: string;
    description?: string;
    doctorDescription?: string;
    animalPhotoURL?: string;
    createdAt: string;
}

interface UserType {
    name: string;
    email: string;
    mobile?: string;
    photoURL?: string;
}

const ManageAppointment: React.FC = () => {
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [reports, setReports] = useState<(ReportType & { user: UserType })[]>([]);
    const [filteredReports, setFilteredReports] = useState<(ReportType & { user: UserType })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "taken" | "completed">("all");

    // Detect logged-in doctor
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setDoctorId(user?.uid || null);
        });
        return () => unsubscribe();
    }, []);

    // Fetch reports assigned to this doctor
    useEffect(() => {
        const fetchReports = async () => {
            if (!doctorId) return;
            setLoading(true);

            try {
                const reportsSnap = await getDocs(collection(db, "reports"));
                const allReports: (ReportType & { user: UserType })[] = [];

                for (const reportDoc of reportsSnap.docs) {
                    const data = reportDoc.data() as ReportType;

                    // Fetch reports for this doctor only
                    if (data.doctorId === doctorId && ["taken", "completed"].includes(data.status)) {
                        // Fetch user info
                        const userSnap = await getDoc(doc(db, "users", data.userId));
                        const userData: UserType = userSnap.exists()
                            ? (userSnap.data() as UserType)
                            : { name: "Unknown", email: "" };

                        allReports.push({ ...data, user: userData });
                    }
                }

                // Sort newest first
                allReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                setReports(allReports);
                setFilteredReports(allReports);
            } catch (err) {
                console.error("Error fetching reports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [doctorId]);

    // Search + filter
    useEffect(() => {
        let filtered = reports;

        if (statusFilter !== "all") {
            filtered = filtered.filter((r) => r.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (r) =>
                    r.animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    r.user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredReports(filtered);
    }, [searchTerm, statusFilter, reports]);

    // Update status → completed
    const handleComplete = async (report: ReportType) => {
        const { value: doctorDescription } = await Swal.fire({
            title: "Add Description",
            input: "textarea",
            inputLabel: "Doctor's Notes",
            inputPlaceholder: "Type your notes...",
            showCancelButton: true,
        });

        if (!doctorDescription) return;

        try {
            const reportRef = doc(db, "reports", report.reportId);
            await updateDoc(reportRef, { status: "completed", doctorDescription });

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Report marked as completed!",
                showConfirmButton: false,
                timer: 2000,
            });

            setReports((prev) =>
                prev.map((r) =>
                    r.reportId === report.reportId ? { ...r, status: "completed", doctorDescription } : r
                )
            );
        } catch (err) {
            console.error("Error updating report:", err);
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "Failed to update report!",
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    if (loading) return <Spin tip="Loading..." size="large" className="mt-20" />;

    if (reports.length === 0)
        return <Empty description="No reports found" className="mt-20" />;

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-3xl font-semibold">🩺 Manage Appointments</h1>
                <Segmented
                    options={[
                        { label: "All", value: "all" },
                        { label: "Taken", value: "taken" },
                        { label: "Completed", value: "completed" },
                    ]}
                    value={statusFilter}
                    onChange={(v: string | number) => setStatusFilter(v as "all" | "taken" | "completed")}
                />
            </div>

            <Input
                placeholder="Search by animal, breed, or user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6 w-full sm:max-w-md"
            />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredReports.map((report) => (
                    <Card
                        key={report.reportId}
                        className="shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-all"
                        title={<span className="capitalize">{report.animal}</span>}
                        extra={<Tag color={report.status === "taken" ? "orange" : "green"}>{report.status}</Tag>}
                    >
                        <div className="flex flex-col gap-3">
                            {report.animalPhotoURL && (
                                <Image
                                    src={report.animalPhotoURL}
                                    alt={report.animal}
                                    height={160}
                                    className="rounded-lg object-cover"
                                    preview={{ mask: <span>View</span> }}
                                />
                            )}

                            <p><b>Breed:</b> {report.breed}</p>
                            <p><b>Condition:</b> {report.condition}</p>
                            <p><b>Age:</b> {report.ageType}</p>
                            <p><b>User:</b> {report.user.name} ({report.user.email})</p>
                            {report.user.mobile && <p><b>Mobile:</b> {report.user.mobile}</p>}
                            {report.description && <p><b>Issue:</b> {report.description}</p>}
                            {report.doctorDescription && <p><b>Doctor Notes:</b> {report.doctorDescription}</p>}

                            <p>
                                <b>Address:</b>{" "}
                                <a
                                    href={`https://www.google.com/maps?q=${report.address}`}
                                    target="_blank"
                                    className="text-blue-600 underline"
                                >
                                    View on Map
                                </a>
                            </p>

                            {report.status === "taken" && (
                                <Button
                                    type="primary"
                                    onClick={() => handleComplete(report)}
                                    className="mt-2 bg-blue-600"
                                >
                                    Mark as Completed
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ManageAppointment;
