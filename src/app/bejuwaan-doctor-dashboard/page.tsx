'use client';

import React from "react";
import DoctorDashboardLayout from "@/components/Doctor/DoctorDashboardLayout";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const DoctorDashboardPage: React.FC = () => {
  return (
    <DoctorDashboardLayout>
      <Title level={2}>Welcome, Dr. John 👨‍⚕️</Title>
      <Paragraph type="secondary">
        Here’s today’s overview of your practice.
      </Paragraph>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-blue-100 rounded-xl shadow">📅 12 Appointments Today</div>
        <div className="p-6 bg-green-100 rounded-xl shadow">👥 48 Patients</div>
        <div className="p-6 bg-purple-100 rounded-xl shadow">💊 20 Prescriptions</div>
        <div className="p-6 bg-yellow-100 rounded-xl shadow">📈 Analytics Report</div>
      </div>
    </DoctorDashboardLayout>
  );
};

export default DoctorDashboardPage;
