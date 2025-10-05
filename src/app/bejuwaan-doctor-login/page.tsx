'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Card } from "antd";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../utils/FirebaseConfig";
import Swal from "sweetalert2";

const { Title, Text } = Typography;

const DoctorLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        router.push(`/bejuwaan-doctor-dashboard`);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const onFinish = async (values: { email: string; password: string }) => {
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

      router.push(`/bejuwaan-doctor-dashboard/`);
    } catch (error: unknown) {
      let userFriendlyMessage = "Login failed. Please check your credentials.";

      // Custom handling for common Firebase Auth errors
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("wrong-password")) userFriendlyMessage = "Incorrect password. Please try again.";
        else if (msg.includes("user-not-found")) userFriendlyMessage = "No account found with this email.";
        else if (msg.includes("invalid-email")) userFriendlyMessage = "The email address is invalid.";
        else if (msg.includes("too-many-requests")) userFriendlyMessage = "Too many failed attempts. Try again later.";
      }

      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: userFriendlyMessage,
        position: "top-end",
        toast: true,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-200 via-green-300 to-green-400">
      <Card
        className="shadow-2xl rounded-2xl border-0"
        style={{ width: 420, background: "white" }}
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
            <Title level={2} style={{ marginBottom: 0, color: "#16a34a" }}>
              Bejuwaan Doctor Login
            </Title>
            <Text type="secondary">Enter your credentials to continue</Text>
          </div>
        </div>


        <Form name="login" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            label={<span className="font-semibold">Email</span>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined style={{ color: "#16a34a" }} />}
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
              prefix={<LockOutlined style={{ color: "#16a34a" }} />}
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
                background: "linear-gradient(to right, #22c55e, #16a34a)",
                border: "none",
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DoctorLogin;
