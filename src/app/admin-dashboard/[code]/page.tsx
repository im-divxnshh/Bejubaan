'use client';

import React from "react";
import DashboardLayout from "@/components/Admin/DashboardLayout";
import { Typography } from "antd";

import FloatButtons from "@/components/FloatButton";

const { Title } = Typography;

const DashboardPage: React.FC = () => {

  return (
    <DashboardLayout>
      <div className="p-6">
        <Title level={3}>Welcome to the Dashboard 🎉</Title>
        <FloatButtons />
      </div>
    </DashboardLayout>
    
  );
};

export default DashboardPage;
