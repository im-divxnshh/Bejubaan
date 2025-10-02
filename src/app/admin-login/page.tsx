'use client'

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Card } from "antd";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../utils/FirebaseConfig";
import Swal from "sweetalert2";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Function to generate random code string
  const generateCode = () => {
    return Math.random().toString(36).substring(2, 10); // e.g. "a9x8p3kl"
  };

  // ✅ Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const code = generateCode();
        router.push(`/admin-dashboard/${code}`); // dynamic string route
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
      });
      const code = generateCode();
      router.push(`/admin-dashboard/${code}`);
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (error instanceof Error) {
        message = error.message;
      }
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Card
        className="shadow-2xl rounded-2xl"
        style={{ width: 400, background: "rgba(255, 255, 255, 0.9)" }}
      >
        <div className="text-center mb-6">
          <Title level={2}>Bejuwan Admin Login</Title>
          <Text type="secondary">Sign in with your account</Text>
        </div>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<LoginOutlined />}
              block
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
