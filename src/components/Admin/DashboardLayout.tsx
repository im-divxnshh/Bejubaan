'use client';

import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, Grid } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/FirebaseConfig";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();
  const router = useRouter();

  const toggle = () => setCollapsed(!collapsed);
  const handleDrawerToggle = () => setDrawerVisible(!drawerVisible);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin-login");
  };

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Dashboard" },
    { key: "2", icon: <UserOutlined />, label: "Users" },
    { key: "3", icon: <SettingOutlined />, label: "Settings" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      {screens.md && (
        <Sider collapsible collapsed={collapsed} trigger={null}>
          <div className="text-center text-white py-4 text-lg font-bold">
            {collapsed ? "ADM" : "Admin Panel"}
          </div>
          <Menu theme="dark" mode="inline" items={menuItems} />
        </Sider>
      )}

      {/* Drawer for Mobile */}
      {!screens.md && (
        <Drawer
          title="Menu"
          placement="left"
          onClose={handleDrawerToggle}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <Menu mode="inline" items={menuItems} />
        </Drawer>
      )}

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex items-center gap-2">
            {screens.md ? (
              <Button type="text" onClick={toggle} icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />
            ) : (
              <Button type="text" onClick={handleDrawerToggle} icon={<MenuUnfoldOutlined />} />
            )}
            <h1 className="font-bold text-lg m-0">Admin Dashboard</h1>
          </div>

          <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>

        <Content style={{ margin: "16px", padding: "16px", background: "#fff", borderRadius: "8px" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
