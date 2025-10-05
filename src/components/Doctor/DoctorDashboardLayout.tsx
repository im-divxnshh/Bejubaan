'use client';

import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Drawer, Grid, Avatar, Spin } from "antd";
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
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/utils/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import DoctorDashboard from "./Dashboard";
import DoctorProfile from "./Profile";


const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

// Components for each page
const DashboardPage = () => <div><DoctorDashboard/></div>;
const AppointmentsPage = () => <div>Appointments Content</div>;
const PrescriptionsPage = () => <div>Manage Appointments Content</div>;
const AnalyticsPage = () => <div>Analytics Content</div>;
const ProfilePage = () => <div><DoctorProfile/></div>;

const DoctorDashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);
  const [activePage, setActivePage] = useState<string>("1");
  const screens = useBreakpoint();
  const router = useRouter();

  // Toggle sidebar collapse
  const toggle = () => setCollapsed(!collapsed);
  const handleDrawerToggle = () => setDrawerVisible(!drawerVisible);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/bejuwaan-doctor-login");
  };

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/bejuwaan-doctor-login");
        return;
      }
      setUser(u);

      // Fetch doctor photo from Firestore
      try {
        const docRef = doc(db, "doctors", u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPhotoURL(data.photoURL);
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const menuItems = [
    { key: "1", icon: <CalendarOutlined />, label: "Dashboard" },
    { key: "2", icon: <TeamOutlined />, label: "Appointments" },
    { key: "3", icon: <FileTextOutlined />, label: "Manage Appointments" },
    { key: "4", icon: <BarChartOutlined />, label: "Analytics" },
    { key: "5", icon: <SettingOutlined />, label: "Profile" },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "1":
        return <DashboardPage />;
      case "2":
        return <AppointmentsPage />;
      case "3":
        return <PrescriptionsPage />;
      case "4":
        return <AnalyticsPage />;
      case "5":
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  const handleMenuClick = (e: { key: string }) => {
    setActivePage(e.key);
    if (!screens.md) setDrawerVisible(false); // close drawer on mobile
  };

  if (!user) return <Spin size="large" className="m-auto mt-20" />;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for desktop */}
      {screens.md && (
        <Sider collapsible collapsed={collapsed} trigger={null} theme="light">
          <div className="flex flex-col items-center py-4">
            <Avatar
              size={collapsed ? 40 : 64}
              src={photoURL}
              icon={<UserOutlined />}
            />
            {!collapsed && <span className="mt-2 text-center">{user.displayName}</span>}
          </div>
          <Menu
            mode="inline"
            items={menuItems}
            selectedKeys={[activePage]}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          />
        </Sider>
      )}

      {/* Drawer for mobile */}
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
            <h1 className="font-bold text-lg m-0 text-blue-600">
              Doctor Dashboard
            </h1>
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
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorDashboardLayout;
