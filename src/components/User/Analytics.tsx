'use client';

import React, { useEffect, useState } from "react";
import { db, auth } from "@/utils/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { Button, Card, Spin } from "antd";

const ViewReports: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const reportsRef = collection(db, `users/${user.uid}/reports`);
        const snapshot = await getDocs(reportsRef);
        const data = snapshot.docs.map((doc) => doc.data());
        setReports(data.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <Spin className="block mx-auto mt-10" />;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">📋 My Reports</h2>

      {reports.length === 0 ? (
        <p className="text-gray-500">No reports found.</p>
      ) : (
        reports.map((r, idx) => {
          const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(r.location)}`;
          const whatsappUrl = `https://wa.me/?text=Animal%20Report%20(${r.status})%0AType:%20${r.animal}%0ALocation:%20${r.location}%0ADescription:%20${r.description}%0AView%20on%20Map:%20${mapUrl}`;

          return (
            <Card key={idx} title={`${r.animal.toUpperCase()} - ${r.status.toUpperCase()}`} className="mb-4 shadow">
              <p><strong>Location:</strong> {r.location}</p>
              <p><strong>Description:</strong> {r.description || "N/A"}</p>
              <div className="flex gap-3 mt-3">
                <Button type="primary" onClick={() => window.open(mapUrl, "_blank")}>
                  View on Map
                </Button>
                <Button onClick={() => window.open(whatsappUrl, "_blank")} className="bg-green-500 text-white">
                  Share via WhatsApp
                </Button>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default ViewReports;
