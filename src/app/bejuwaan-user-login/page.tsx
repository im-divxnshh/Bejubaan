'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Card, Tabs } from "antd";
import { 
  MailOutlined, 
  LockOutlined, 
  LoginOutlined, 
  UserOutlined, 
  PhoneOutlined 
} from "@ant-design/icons";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { auth, db } from "../../utils/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// ✅ Firebase error friendly messages
const getFriendlyError = (code: string): string => {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Try again.";
    case "auth/email-already-in-use":
      return "Email is already registered.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
};

const UserAuth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        router.push(`/bejuwaan-user-dashboard`);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // ✅ Login handler
  const onLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      Swal.fire({
        icon: "success",
        title: "Welcome back! 🎉",
        text: "You are now logged in.",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
      router.push(`/bejuwaan-user-dashboard`);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: getFriendlyError(error.code),
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register handler
  const onRegister = async (values: { name: string; mobile: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCred.user;

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        mobile: values.mobile,
        email: values.email,
        createdAt: new Date(),
      });

      Swal.fire({
        icon: "success",
        title: "Account Created 🎉",
        text: "You can now log in with your credentials.",
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });

      router.push(`/bejuwaan-user-dashboard`);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Registration failed",
        text: getFriendlyError(error.code),
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 px-4">
      <Card
        className="shadow-2xl rounded-2xl border-0 w-full max-w-md"
        style={{ background: "white" }}
      >
         <div className="flex items-center justify-center mb-6 space-x-4">
          {/* Logo */}
          <img
            src="/logo.jpg"   
            alt="Bejuwaan Logo"
            className="w-12 h-12 rounded-full"
          />

          {/* Text */}
          <div className="text-left">
            <Title level={2} style={{ marginBottom: 0, color: "#1e40af" }}>
              Bejuwaan Valunteer 
            </Title>
            <Text type="secondary">Enter your credentials to continue</Text>
          </div>
        </div>
        <Tabs defaultActiveKey="login" centered>
          {/* Login Tab */}
          <TabPane tab="Login" key="login">
            <Form name="login" layout="vertical" onFinish={onLogin} autoComplete="off">
              <Form.Item
                name="email"
                label={<span className="font-semibold">Email</span>}
                rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Enter a valid email" }]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined style={{ color: "#1e40af" }} />}
                  placeholder="Enter your email"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="font-semibold">Password</span>}
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined style={{ color: "#1e40af" }} />}
                  placeholder="Enter your password"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<LoginOutlined />}
                  block
                  loading={loading}
                  className="rounded-lg shadow-md"
                  style={{
                    background: "linear-gradient(to right, #2563eb, #1e40af)",
                    border: "none",
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Register Tab */}
          <TabPane tab="Register" key="register">
            <Form name="register" layout="vertical" onFinish={onRegister} autoComplete="off">
              <Form.Item
                name="name"
                label={<span className="font-semibold">Full Name</span>}
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined style={{ color: "#1e40af" }} />}
                  placeholder="Enter your full name"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="mobile"
                label={<span className="font-semibold">Mobile No.</span>}
                rules={[{ required: true, message: "Please enter your mobile number" }]}
              >
                <Input
                  size="large"
                  prefix={<PhoneOutlined style={{ color: "#1e40af" }} />}
                  placeholder="Enter your mobile number"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="font-semibold">Email</span>}
                rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Enter a valid email" }]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined style={{ color: "#1e40af" }} />}
                  placeholder="Enter your email"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="font-semibold">Password</span>}
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined style={{ color: "#1e40af" }} />}
                  placeholder="Enter your password"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<LoginOutlined />}
                  block
                  loading={loading}
                  className="rounded-lg shadow-md"
                  style={{
                    background: "linear-gradient(to right, #2563eb, #1e40af)",
                    border: "none",
                  }}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserAuth;
