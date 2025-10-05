'use client';

import React, { useState } from "react";
import { Input, Select, Button, message } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { auth, db } from "@/utils/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const { TextArea } = Input;
const { Option } = Select;

const AddReport: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [animal, setAnimal] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Get logged-in user
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animal || !status || !location) {
      message.warning("Please fill in all required fields.");
      return;
    }

    if (!userId) {
      message.error("User not logged in!");
      return;
    }

    setLoading(true);
    try {
      const timestamp = new Date();
      const reportRef = doc(db, `users/${userId}/reports/${timestamp.getTime()}`);

      await setDoc(reportRef, {
        animal,
        status,
        location,
        description,
        createdAt: timestamp.toISOString(),
      });

      message.success("Report added successfully!");
      setAnimal("");
      setStatus("");
      setLocation("");
      setDescription("");
    } catch (err) {
      console.error("Error saving report:", err);
      message.error("Error saving report.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        () => message.error("Unable to fetch location.")
      );
    } else {
      message.error("Geolocation not supported.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">🐾 Add Animal Report</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Animal Selector */}
        <div>
          <label className="block font-medium mb-2">Select Animal *</label>
          <Select
            placeholder="Choose animal"
            value={animal}
            onChange={setAnimal}
            className="w-full"
          >
            <Option value="dog">Dog</Option>
            <Option value="cat">Cat</Option>
            <Option value="cow">Cow</Option>
            <Option value="monkey">Monkey</Option>
            <Option value="bird">Bird</Option>
            <Option value="other">Other</Option>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-2">Condition *</label>
          <Select
            placeholder="Select condition"
            value={status}
            onChange={setStatus}
            className="w-full"
          >
            <Option value="injured">Injured</Option>
            <Option value="dead">Dead</Option>
          </Select>
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-2">Location *</label>
          <div className="flex gap-2">
            <Input
              prefix={<EnvironmentOutlined />}
              placeholder="Search or enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button type="primary" onClick={handleUseLocation}>
              Use My Location
            </Button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-2">Description</label>
          <TextArea
            rows={4}
            placeholder="Describe the situation..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Submit */}
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg"
        >
          Submit Report
        </Button>
      </form>
    </div>
  );
};

export default AddReport;
