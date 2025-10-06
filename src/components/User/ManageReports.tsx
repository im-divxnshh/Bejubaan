'use client';

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "@/utils/FirebaseConfig";
import { Input, Select, Modal, Spin, Button, Tag, Empty, Card } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";

const { Option } = Select;

interface ReportType {
  reportId: string;
  userId: string;
  animal: string;
  breed: string;
  ageType: string;
  condition: string;
  status: string;
  address: string;
  doctorId: string;
  animalPhotoURL?: string;
  createdAt: string;
  description?: string;
}

const ManageReports: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportType[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [doctorsMap, setDoctorsMap] = useState<Record<string, string>>({});

  // ✅ Get logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "doctors"));
        const map: Record<string, string> = {};
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          map[doc.id] = data.name || "Unknown Doctor";
        });
        setDoctorsMap(map);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // ✅ Fetch reports without query (getDocs only)
  useEffect(() => {
    const fetchReports = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "reports")); // get all reports
        let allReports: ReportType[] = snapshot.docs
          .map(doc => doc.data() as ReportType)
          .filter(report => report.userId === userId); // filter by logged-in user

        // Sort by createdAt descending
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
  }, [userId]);


  useEffect(() => {
    let updated = [...reports];

    if (filterStatus !== "all") {
      updated = updated.filter(r => r.status === filterStatus);
    }

    if (searchTerm.trim()) {
      updated = updated.filter(
        r =>
          r.animal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(updated);
  }, [searchTerm, filterStatus, reports]);

  const handleView = (report: ReportType) => {
    setSelectedReport(report);
    setIsModalVisible(true);
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">🧾 Manage Reports</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 justify-between">
        <Input
          placeholder="Search by animal, breed or address"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          className="w-full md:w-1/4"
        >
          <Option value="all">All</Option>
          <Option value="pending">Pending</Option>
          <Option value="completed">Completed</Option>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" tip="Loading reports..." />
        </div>
      ) : filteredReports.length === 0 ? (
        <Empty description="No reports found" />
      ) : (
        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <Card key={report.reportId} className="shadow-md rounded-xl hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-lg font-semibold capitalize">{report.animal}</h3>
                  <p className="text-gray-600 text-sm">{report.breed} • {report.ageType}</p>
                  <p className="text-gray-500 text-sm">{report.address}</p>
                  <p className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-3 items-center mt-3 md:mt-0">
                  <Tag color={report.status === "pending" ? "orange" : report.status === "completed" ? "green" : "blue"}>
                    {report.status.toUpperCase()}
                  </Tag>
                  <Button type="primary" icon={<EyeOutlined />} onClick={() => handleView(report)}>
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Modal */}
      {/* View Modal */}
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={600}
      >
        {selectedReport && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-2 capitalize">{selectedReport.animal}</h3>
            {selectedReport.animalPhotoURL && (
              <img src={selectedReport.animalPhotoURL} alt="Animal" className="w-full h-60 object-cover rounded-lg shadow-sm" />
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p><b>Breed:</b> {selectedReport.breed}</p>
              <p><b>Age:</b> {selectedReport.ageType}</p>
              <p><b>Condition:</b> {selectedReport.condition}</p>
              <p><b>Status:</b> {selectedReport.status}</p>
              <p className="col-span-2">
                <b>Address:</b>{" "}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedReport.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {selectedReport.address}
                </a>
              </p>
              {selectedReport.description && (
                <p className="col-span-2"><b>Description:</b> {selectedReport.description}</p>
              )}
              <p><b>Doctor:</b> {doctorsMap[selectedReport.doctorId] || "Unknown Doctor"}</p>
              <p className="col-span-2 text-xs text-gray-500"><b>Reported At:</b> {new Date(selectedReport.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default ManageReports;
