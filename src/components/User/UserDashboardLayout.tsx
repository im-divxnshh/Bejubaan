'use client';

import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, Grid, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  CalendarOutlined,
  ProfileOutlined,
  BarChartOutlined,
  DashboardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/utils/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import UserDashboard from "./Dashboard";
import AddReport from "./AddReport";
import ManageReports from "./ManageReports";
import Analytics from "./Analytics";
import Profile from "./Profile";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const UserDashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("1"); // Default to Add Report
  const screens = useBreakpoint();
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  const toggle = () => setCollapsed(!collapsed);
  const handleDrawerToggle = () => setDrawerVisible(!drawerVisible);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/bejuwaan-user-login";
  };

  const menuItems = [
    { key: "1", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "2", icon: <CalendarOutlined />, label: "Add Report" },
    { key: "3", icon: <MedicineBoxOutlined />, label: "Manage Reports" },
    { key: "4", icon: <BarChartOutlined />, label: "Analytics" },
    { key: "5", icon: <ProfileOutlined />, label: "Profile" },
  ];

  // Map menu key to components
  const renderContent = () => {
    switch (activeKey) {
      case "1":
        return <UserDashboard />;
      case "2":
        return <AddReport />;
      case "3":
        return <ManageReports />;
      case "4":
        return <Analytics />;
      case "5":
        return <Profile />;
      default:
        return <AddReport />;
    }
  };

  const handleMenuClick = (e: { key: string }) => {
    setActiveKey(e.key);
    if (!screens.md) setDrawerVisible(false); // close drawer on mobile
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setPhotoURL(data.photoURL || null);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>

      {/* Sidebar (desktop) */}
      {screens.md && (
        <Sider collapsible collapsed={collapsed} trigger={null} theme="light">
          <div className="flex items-center justify-center py-4">
            <Avatar
              size={collapsed ? 40 : 64}
              src={photoURL || "/default-avatar.png"}
              icon={!photoURL && <UserOutlined />}
              style={{ border: "2px solid #2563eb" }}
            />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </Sider>
      )}

      {/* Drawer (mobile) */}
      {!screens.md && (
        <Drawer
          title="User Menu"
          placement="left"
          onClose={handleDrawerToggle}
          open={drawerVisible}
          styles={{ body: { padding: 0 } }}        >
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            items={menuItems}
            onClick={handleMenuClick}
          />
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
            <h1 className="flex items-center gap-2 font-bold text-lg m-0 text-blue-600">
              <img
                src="/logo.jpg"
                alt="Bejuwaan Logo"
                className="w-8 h-8 object-contain rounded-full"
              />
              Bejuwaan User Dashboard
            </h1>
          </div>

          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}
          >
            Logout
          </Button>
        </Header>

        {/* Dynamic Content */}
        <Content
          style={{
            margin: "16px",
            padding: "16px",
            background: "#f9fafb",
            borderRadius: "12px",
            minHeight: "calc(100vh - 112px)",
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDashboardLayout;
