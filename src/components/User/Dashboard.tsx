"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/utils/FirebaseConfig";

const UserDashboard: React.FC = () => {
  const [name, setName] = useState<string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setName(data.name || "User");
          } else {
            setName("Unknown User");
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          setName("Error loading user");
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

export default UserDashboard;
