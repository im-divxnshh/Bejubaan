'use client';

import React from "react";
import DoctorDashboardLayout from "@/components/Doctor/DoctorDashboardLayout";
import { Typography } from "antd";

import FloatButtons from "@/components/FloatButton";

const { Title, Paragraph } = Typography;

const DoctorDashboardPage: React.FC = () => {
  return (
    <>
      <DoctorDashboardLayout />
      <FloatButtons />
    </>
  );
};

export default DoctorDashboardPage;
