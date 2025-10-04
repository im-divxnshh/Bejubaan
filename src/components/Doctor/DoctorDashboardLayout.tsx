'use client';

import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, Grid, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/FirebaseConfig";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const DoctorDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();
  const router = useRouter();

  const toggle = () => setCollapsed(!collapsed);
  const handleDrawerToggle = () => setDrawerVisible(!drawerVisible);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/bejuwaan-doctor-login");
  };

  const menuItems = [
    { key: "1", icon: <CalendarOutlined />, label: "Appointments" },
    { key: "2", icon: <TeamOutlined />, label: "Patients" },
    { key: "3", icon: <FileTextOutlined />, label: "Prescriptions" },
    { key: "4", icon: <BarChartOutlined />, label: "Analytics" },
    { key: "5", icon: <SettingOutlined />, label: "Settings" },
  ];

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "1") router.push("/doctor-dashboard/appointments");
    if (e.key === "2") router.push("/doctor-dashboard/patients");
    if (e.key === "3") router.push("/doctor-dashboard/prescriptions");
    if (e.key === "4") router.push("/doctor-dashboard/analytics");
    if (e.key === "5") router.push("/doctor-dashboard/settings");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar (desktop) */}
      {screens.md && (
        <Sider collapsible collapsed={collapsed} trigger={null} theme="light">
          <div className="flex items-center justify-center py-4">
            <Avatar size={collapsed ? 40 : 64} icon={<UserOutlined />} />
          </div>
          <Menu
            mode="inline"
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </Sider>
      )}

      {/* Drawer (mobile) */}
      {!screens.md && (
        <Drawer
          title="Doctor Menu"
          placement="left"
          onClose={handleDrawerToggle}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <Menu mode="inline" items={menuItems} onClick={handleMenuClick} />
        </Drawer>
      )}

      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-center gap-3">
            {screens.md ? (
              <Button
                type="text"
                onClick={toggle}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              />
            ) : (
              <Button type="text" onClick={handleDrawerToggle} icon={<MenuUnfoldOutlined />} />
            )}
            <h1 className="font-bold text-lg m-0 text-blue-600">Doctor Dashboard</h1>
          </div>

          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "16px",
            padding: "16px",
            background: "#f9fafb",
            borderRadius: "12px",
            minHeight: "calc(100vh - 112px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorDashboardLayout;
