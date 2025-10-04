'use client';

import React from "react";
import UserDashboardLayout from "@/components/User/UserDashboardLayout";

import FloatButtons from "@/components/FloatButton";

const UserDashboardPage: React.FC = () => {
  return(
    <>
<UserDashboardLayout />
<FloatButtons/>
</>
  ) ;
};

export default UserDashboardPage;
