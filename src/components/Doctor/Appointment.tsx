'use client';

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import { auth, db } from "@/utils/FirebaseConfig";
import { Card, Button, Spin, Tag, Empty, Avatar } from "antd";
import Image from "antd/es/image";
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
    animalPhotoURL?: string;
    createdAt: string;
}

interface UserType {
    name: string;
    email: string;
    mobile: string;
    photoURL?: string;
}

interface ReportWithUser extends ReportType {
    user: UserType;
}

const AppointmentPage: React.FC = () => {
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [reports, setReports] = useState<ReportWithUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setDoctorId(user ? user.uid : null);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchReports = async () => {
            if (!doctorId) return;
            setLoading(true);
            try {
                const reportsSnap = await getDocs(collection(db, "reports"));
                const allReports: ReportWithUser[] = [];

                for (const reportDoc of reportsSnap.docs) {
                    const data = reportDoc.data() as ReportType;

                    if (data.doctorId === doctorId && data.status === "pending") {
                        // Fetch user info
                        const userSnap = await getDoc(doc(db, "users", data.userId));
                        const userData = userSnap.exists() ? (userSnap.data() as UserType) : { name: "Unknown", email: "", mobile: "", photoURL: "" };

                        allReports.push({ ...data, user: userData });
                    }
                }

                // Sort by createdAt descending
                allReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setReports(allReports);
            } catch (err) {
                console.error("Error fetching reports:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [doctorId]);

    const handleStatusUpdate = async (report: ReportWithUser, newStatus: string) => {
        try {
            const reportRef = doc(db, "reports", report.reportId);
            await updateDoc(reportRef, { status: newStatus });
            setReports((prev) => prev.filter((r) => r.reportId !== report.reportId));
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    if (loading) return <Spin tip="Loading reports..." size="large" className="mt-20" />;

    if (reports.length === 0) return <Empty description="No pending reports" className="mt-20" />;

    return (
        <div className="p-6">
            <h1 className="text-3xl mb-6">🩺 Pending Appointments</h1>
            <div className="grid gap-4">
                {reports.map((report) => (
                    <Card key={report.reportId} className="shadow-md rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Avatar src={report.user.photoURL || "/logo.jpg"} size={50} />
                            <div>
                                <p className="font-semibold">{report.user.name}</p>
                                <p className="text-sm text-gray-500">{report.user.email} | {report.user.mobile}</p>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold capitalize">{report.animal}</h3>
                        <p><b>Breed:</b> {report.breed}</p>
                        <p><b>Condition:</b> {report.condition}</p>
                        <p>
                            <b>Address:</b>{" "}
                            <a
                                target="_blank"
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(report.address)}`}
                                className="text-blue-600 underline"
                            >
                                {report.address}
                            </a>
                        </p>
                        {report.description && <p><b>Description:</b> {report.description}</p>}
                        {report.animalPhotoURL && (
                            <Image
                                src={report.animalPhotoURL}
                                alt="Animal"
                                className="w-48 max-h-48 object-cover rounded-lg my-2"
                                preview={{ mask: <span>View</span> }}
                            />
                        )}

                        <div className="flex gap-2 mt-2">
                            <Button type="primary" onClick={() => handleStatusUpdate(report, "taken")}>Take</Button>
                        </div>

                        <Tag color="orange" className="mt-2">{report.status.toUpperCase()}</Tag>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AppointmentPage;
