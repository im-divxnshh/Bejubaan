'use client'

import React, { useState } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Card,
  Statistic,
  Table,
  Avatar,
  Dropdown,
  Tabs,
} from "antd";
import {
  MenuOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  BellOutlined,
  SettingOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Header, Content, Sider } = Layout;

// --- Dummy data ---
const userColumns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "Address", dataIndex: "address", key: "address" },
];

const userData = Array.from({ length: 5 }).map((_, i) => ({
  key: i,
  name: `User ${i + 1}`,
  age: 20 + i,
  address: `Street No. ${i + 1}`,
}));

const appointmentColumns = [
  { title: "Patient", dataIndex: "patient", key: "patient" },
  { title: "Doctor", dataIndex: "doctor", key: "doctor" },
  { title: "Date", dataIndex: "date", key: "date" },
];

const appointmentData = Array.from({ length: 5 }).map((_, i) => ({
  key: i,
  patient: `Patient ${i + 1}`,
  doctor: `Dr. Smith ${i + 1}`,
  date: `2025-09-${10 + i}`,
}));

// --- Component ---
const Dashboard: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const sidebarMenu = (
    <Menu mode="inline" defaultSelectedKeys={["1"]} className="h-full border-r-0">
      <Menu.Item key="1" icon={<BarChartOutlined />}>Analytics</Menu.Item>
      <Menu.Item key="2" icon={<ShoppingCartOutlined />}>E-Commerce</Menu.Item>
      <Menu.Item key="3" icon={<HeartOutlined />}>Doctors</Menu.Item>
      <Menu.Item key="4" icon={<DollarOutlined />}>Finance</Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>Profile</Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>Settings</Menu.Item>
      <Menu.Item key="3">Logout</Menu.Item>
    </Menu>
  );

  // Analytics tab content
  const analyticsContent = (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <motion.div whileHover={{ scale: 1.03 }}>
        <Card className="rounded-2xl shadow bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 text-white">
          <Statistic title={<span className="text-white">Users</span>} value={1128} />
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.03 }}>
        <Card className="rounded-2xl shadow bg-gradient-to-r from-rose-500 to-rose-400 text-white">
          <Statistic title={<span className="text-white">Orders</span>} value={93} suffix="/ 100" />
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.03 }}>
        <Card className="rounded-2xl shadow bg-gradient-to-r from-emerald-500 to-teal-400 text-white">
          <Statistic title={<span className="text-white">Revenue</span>} prefix="$" value={5230} />
        </Card>
      </motion.div>

      <Card className="rounded-2xl shadow md:col-span-2 lg:col-span-3">
        <h2 className="font-semibold text-lg mb-2">Latest Users</h2>
        <Table columns={userColumns} dataSource={userData} pagination={false} />
      </Card>
    </div>
  );

  // Doctors tab content
  const doctorsContent = (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <motion.div whileHover={{ scale: 1.03 }}>
        <Card className="rounded-2xl shadow bg-gradient-to-r from-sky-600 to-sky-400 text-white">
          <Statistic title={<span className="text-white">Appointments</span>} value={45} suffix=" Today" />
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.03 }}>
        <Card className="rounded-2xl shadow bg-gradient-to-r from-violet-600 to-violet-400 text-white">
          <Statistic title={<span className="text-white">Patients</span>} value={230} />
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.03 }}>
        <Card className="rounded-2xl shadow bg-gradient-to-r from-teal-600 to-teal-400 text-white">
          <Statistic title={<span className="text-white">Revenue</span>} prefix="$" value={12600} />
        </Card>
      </motion.div>

      <Card className="rounded-2xl shadow md:col-span-2 lg:col-span-3">
        <h2 className="font-semibold text-lg mb-2">Upcoming Appointments</h2>
        <Table columns={appointmentColumns} dataSource={appointmentData} pagination={false} />
      </Card>
    </div>
  );

  return (
    <Layout className="min-h-screen bg-slate-50">
      {/* Mobile Drawer (updated to use `styles.body` instead of deprecated `bodyStyle`) */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        styles={{ body: { padding: 0 } }}
      >
        {sidebarMenu}
      </Drawer>

      {/* Desktop Sidebar */}
      <Sider
        className="hidden md:block bg-white shadow-md"
        breakpoint="lg"
        collapsedWidth={0}
        width={220}
      >
        <div className="h-16 flex items-center justify-center font-bold text-indigo-600 text-lg border-b">
          MyDash
        </div>
        {sidebarMenu}
      </Sider>

      <Layout>
        {/* Navbar */}
        <Header className="bg-white shadow px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Drawer toggle only visible on mobile */}
            <Button
              className="block md:hidden"
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setVisible(true)}
              aria-label="Open navigation"
            />
            <h1 className="font-bold text-xl text-indigo-600">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button type="text" icon={<BellOutlined />} aria-label="Notifications" />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Avatar className="cursor-pointer bg-indigo-500" icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>

        {/* Content with modern color palette */}
        <Content className="p-4">
          <Tabs
            defaultActiveKey="1"
            items={[
              { key: "1", label: "Analytics", children: analyticsContent },
              { key: "2", label: "Doctors", children: doctorsContent },
            ]}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
