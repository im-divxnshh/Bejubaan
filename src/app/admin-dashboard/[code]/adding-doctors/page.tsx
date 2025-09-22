'use client';

import React from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/Admin/DashboardLayout";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const UserSectionPage: React.FC = () => {
  const params = useParams();
  const code = params.code;

  return (
    <DashboardLayout>
      <Title level={2}>Doctor  Management 👥</Title>
     

      <div className="mt-6">
        <div className="p-6 bg-white rounded-lg shadow">
          {/* Replace with your real content */}
          <p>Doctor</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserSectionPage;
