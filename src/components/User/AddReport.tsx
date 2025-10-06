'use client';

import React, { useEffect, useState } from "react";
import { Input, Select, Button, Upload, Spin } from "antd";
import { EnvironmentOutlined, UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { auth, db, storage } from "@/utils/FirebaseConfig";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

const { TextArea } = Input;
const { Option } = Select;

interface DoctorType {
  uid: string;
  name: string;
  location?: { lat: number; lng: number };
  address?: string;
}

const AddReport: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [animal, setAnimal] = useState("");
  const [breed, setBreed] = useState("");
  const [ageType, setAgeType] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [doctorList, setDoctorList] = useState<DoctorType[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [animalPhoto, setAnimalPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Get logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribe();
  }, []);

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorSnap = await getDocs(collection(db, "doctors"));

        const doctors: DoctorType[] = await Promise.all(
          doctorSnap.docs.map(async (docRef) => {
            const data = docRef.data();
            const doctor: DoctorType = {
              uid: docRef.id,
              name: data.name,
              location: data.location,
            };

            if (doctor.location) {
              const { lat, lng } = doctor.location;
            }

            return doctor;
          })
        );

        setDoctorList(doctors);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    fetchDoctors();
  }, []);






  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          setAddress(`${latitude}, ${longitude}`);
        },
        () =>
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "Unable to fetch location",
            showConfirmButton: false,
            timer: 2000,
          })
      );
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Geolocation not supported",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!animal || !breed || !ageType || !condition || !location || !selectedDoctor || !userId) return;

  setLoading(true);
  try {
    const user = auth.currentUser;

    const timestamp = new Date();
    const reportId = `report-${timestamp.getTime()}`;

    // Upload image if available
    let animalPhotoURL = "";
    if (animalPhoto) {
      const photoRef = ref(storage, `userReports/${userId}/${reportId}/${animalPhoto.name}`);
      await uploadBytes(photoRef, animalPhoto);
      animalPhotoURL = await getDownloadURL(photoRef);
    }

    // Save report to **flat reports collection**
    const reportRef = doc(collection(db, "reports"), reportId);
    await setDoc(reportRef, {
      reportId,
      userId,
      animal,
      breed,
      ageType,
      condition,
      location,
      address,
      description,
      doctorId: selectedDoctor,
      animalPhotoURL,
      status: "pending",
      createdAt: timestamp.toISOString(),
    });

    Swal.fire({ icon: "success", title: "Report added!" });

    // Reset form
    setAnimal(""); setBreed(""); setAgeType(""); setCondition("");
    setLocation(null); setAddress(""); setDescription(""); setSelectedDoctor(""); setAnimalPhoto(null);
  } catch (err) {
    console.error(err);
    Swal.fire({ icon: "error", title: "Error saving report" });
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <Spin size="large" tip="Submitting...">
            <div style={{ height: 80 }} />
          </Spin>
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">🐾 Add Animal Report</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Animal */}
        <div>
          <label className="block font-medium mb-2">Select Animal *</label>
          <Select placeholder="Choose animal" value={animal} onChange={setAnimal} className="w-full">
            <Option value="dog">Dog</Option>
            <Option value="cat">Cat</Option>
            <Option value="cow">Cow</Option>
            <Option value="monkey">Monkey</Option>
            <Option value="bird">Bird</Option>
            <Option value="other">Other</Option>
          </Select>
        </div>

        {/* Breed */}
        <div>
          <label className="block font-medium mb-2">Breed *</label>
          <Input placeholder="Enter breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
        </div>

        {/* Age type */}
        <div>
          <label className="block font-medium mb-2">Age Type *</label>
          <Select placeholder="Select age type" value={ageType} onChange={setAgeType} className="w-full">
            <Option value="baby">Baby</Option>
            <Option value="adult">Adult</Option>
          </Select>
        </div>

        {/* Status */}
        <div>
          <label className="block font-medium mb-2">Condition *</label>
          <Select placeholder="Select condition" value={condition} onChange={setCondition} className="w-full">
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
              placeholder="Search or enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
          <TextArea rows={4} placeholder="Describe the situation..." value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Animal Photo */}
        <div>
          <label className="block font-medium mb-2">Animal Photo</label>
          <Upload
            beforeUpload={(file) => {
              setAnimalPhoto(file);
              return false;
            }}
            maxCount={1}
            accept="image/*"
            showUploadList={animalPhoto ? { showRemoveIcon: true } : false}
          >
            <Button icon={<UploadOutlined />}>Upload Photo</Button>
          </Upload>
        </div>

        {/* Doctor selection */}
        <div>
          <label className="block font-medium mb-2">Select Doctor *</label>
          <Select
            placeholder="Choose nearest doctor"
            value={selectedDoctor}
            onChange={setSelectedDoctor}
            className="w-full"
          >
            {doctorList.map((doctor) => (
              <Option key={doctor.uid} value={doctor.uid}>
                {doctor.name} ({doctor.location?.lat}, {doctor.location?.lng})
              </Option>
            ))}
          </Select>


        </div>

        {/* Submit */}
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<SaveOutlined />}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg"
        >
          Submit Report
        </Button>
      </form>
    </div>
  );
};

export default AddReport;
