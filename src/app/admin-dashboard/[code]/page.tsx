'use client';

import React from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/Admin/DashboardLayout";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const params = useParams();
  const code = params.code; // dynamic random string

  return (
    <DashboardLayout>
      <Title level={2}>Welcome to your Dashboard 🎉</Title>
      <Paragraph type="secondary">
        You are inside: <b>{code}</b>
      </Paragraph>
      <div className="mt-6">
        {/* Example dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-blue-100 rounded-lg shadow">📊 Analytics</div>
          <div className="p-6 bg-green-100 rounded-lg shadow">👤 Users</div>
          <div className="p-6 bg-purple-100 rounded-lg shadow">⚙️ Settings</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
