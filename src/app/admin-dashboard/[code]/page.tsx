'use client';

import React from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/Admin/DashboardLayout";
import { Typography } from "antd";

const { Title, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const code = params.code;

  return (
    <DashboardLayout>
      <Title level={2}>Welcome to your Dashboard 🎉</Title>
     

     
    </DashboardLayout>
  );
};

export default DashboardPage;
