"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/utils/FirebaseConfig";

const DoctorDashboard: React.FC = () => {
  const [name, setName] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);
  const [profileComplete, setProfileComplete] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (doctor) => {
      if (doctor) {
        try {
          const doctorRef = doc(db, "doctors", doctor.uid);
          const doctorSnap = await getDoc(doctorRef);
          if (doctorSnap.exists()) {
            const data = doctorSnap.data() as {
              name?: string;
              location?: { lat: number; lng: number };
              qualification?: string;
              specialization?: string;
            };

            setName(data.name || "doctor");

            // Check if essential fields are filled
            if (
              data.location?.lat &&
              data.location?.lng &&
              data.qualification &&
              data.specialization
            ) {
              setProfileComplete(true);
            } else {
              setProfileComplete(false);
            }
          } else {
            setName("Unknown doctor");
            setProfileComplete(false);
          }
        } catch (err) {
          console.error("Error fetching doctor:", err);
          setName("Error loading doctor");
          setProfileComplete(false);
        }
      } else {
        setName("Not Logged In");
        setProfileComplete(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-6 bg-white rounded-xl shadow">⏳ Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-4">
      <div>
        🏢 Welcome, <span className="font-semibold text-blue-600">{name}</span>!
      </div>

      {profileComplete ? (
        <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md">
          ✅ Your profile is complete.
        </div>
      ) : (
        <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
          ⚠️ Your profile is incomplete. Please complete your profile with:
          <ul className="list-disc ml-6 mt-2">
            <li>Location (latitude & longitude)</li>
            <li>Qualification</li>
            <li>Specialization</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
