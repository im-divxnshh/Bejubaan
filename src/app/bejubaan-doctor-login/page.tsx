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

  // ✅ Generate random dashboard code
  const generateCode = () => Math.random().toString(36).substring(2, 10);

  // ✅ Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const code = generateCode();
        router.push(`/bejubaan-doctor-dashboard`);
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
      router.push(`/bejubaan-doctor-dashboard/`);
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (error instanceof Error) message = error.message;
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
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200">
      <Card
        className="shadow-2xl rounded-2xl border-0"
        style={{ width: 420, background: "white" }}
      >
        <div className="text-center mb-6">
          <Title level={2} style={{ marginBottom: 0, color: "#3b82f6" }}>
            Bejubaan Doctor Login
          </Title>
          <Text type="secondary">Enter your credentials to continue</Text>
        </div>

        <Form name="login" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            label={<span className="font-semibold">Email</span>}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined style={{ color: "#3b82f6" }} />}
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
              prefix={<LockOutlined style={{ color: "#3b82f6" }} />}
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
                background: "linear-gradient(to right, #6366f1, #3b82f6)",
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

export default Login;
