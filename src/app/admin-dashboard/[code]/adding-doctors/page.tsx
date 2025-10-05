'use client';

import React from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/Admin/DashboardLayout";
import { Typography } from "antd";

const { Title } = Typography;

import AddingDoctor from "@/components/Admin/Dashboard/AddingDoctor";

const DoctorManagementPage: React.FC = () => {
  const params = useParams();

  return (
    <DashboardLayout>
      <AddingDoctor/>
    </DashboardLayout>
  );
};

export default DoctorManagementPage;
