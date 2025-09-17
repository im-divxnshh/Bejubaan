'use client';

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layout, Menu, Button } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/FirebaseConfig";

const { Header, Sider, Content } = Layout;

const UserDashboardPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const params = useParams();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin-login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="bg-gradient-to-b from-blue-600 to-blue-400"
      >
        <div className="text-white text-center py-6 text-xl font-extrabold tracking-wide">
          {collapsed ? "U" : "User"}
        </div>
        <Menu theme="dark" mode="inline" className="bg-transparent">
          <Menu.Item key="1" icon={<HomeOutlined />}>Home</Menu.Item>
          <Menu.Item key="2" icon={<CalendarOutlined />}>Appointments</Menu.Item>
          <Menu.Item key="3" icon={<MessageOutlined />}>Messages</Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>Profile</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header className="bg-blue-500 text-white flex justify-between items-center px-6 shadow-md">
          <h1 className="font-semibold text-lg">🎉 Welcome Back</h1>
          <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>Logout</Button>
        </Header>
        <Content className="m-6 p-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Hello, User 🙋</h2>
          <p className="text-gray-700">Dashboard ID: <b>{params.code}</b></p>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDashboardPage;
