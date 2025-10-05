"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/utils/FirebaseConfig";

const DoctorDashboard: React.FC = () => {
  const [name, setName] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (doctor) => {
      if (doctor) {
        try {
          const doctorRef = doc(db, "doctors", doctor.uid);
          const doctorSnap = await getDoc(doctorRef);
          if (doctorSnap.exists()) {
            const data = doctorSnap.data();
            setName(data.name || "doctor");
          } else {
            setName("Unknown doctor");
          }
        } catch (err) {
          console.error("Error fetching doctor:", err);
          setName("Error loading doctor");
        }
      } else {
        setName("Not Logged In");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-6 bg-white rounded-xl shadow">⏳ Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      🏢 Welcome, <span className="font-semibold text-blue-600">{name}</span>!
    </div>
  );
};

export default DoctorDashboard;
