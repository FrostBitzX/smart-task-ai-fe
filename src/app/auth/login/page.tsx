"use client";
import { supabase } from "@/lib/supabase/client";
import { signin } from "@/services/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const signInWithFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const signIn = async () => {
    try {
      const res = await signin({ username: email, password });
      if (res.status === 200) {
        const token = res.data.token;
        document.cookie = `auth-token=${token}; path=/; max-age=86400`;
        window.location.href = "/app/home";
      }
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-80 h-80 rounded-full blur-[60px] opacity-70 mix-blend-multiply bg-purple-300 -top-40 -right-40 animate-pulse" />
        <div className="absolute w-80 h-80 rounded-full blur-[60px] opacity-70 mix-blend-multiply bg-blue-300 -bottom-40 -left-40 animate-pulse" />
        <div className="absolute w-80 h-80 rounded-full blur-[60px] opacity-70 mix-blend-multiply bg-indigo-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="bg-white/80 backdrop-blur-lg border-white/20 shadow-2xl rounded-3xl overflow-hidden p-0 gap-0">
          {/* Header with gradient */}
          <CardHeader className="bg-linear-to-r from-blue-500 to-indigo-600 px-6 py-6 text-white">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2 shadow-sm">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-base font-bold bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    IT
                  </span>
                </div>
              </div>
              <h1 className="text-xl font-bold tracking-tight">
                SMART TASK AI
              </h1>
              <p className="text-blue-100 text-xs">ยินดีต้อนรับกลับมา</p>
            </div>
          </CardHeader>

          {/* Form */}
          <CardContent className="px-6 py-5">
            {/* Email Input */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                อีเมลหรือชื่อผู้ใช้
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-700 placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 pl-10 pr-10 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-700 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="ml-2 text-xs text-gray-600 group-hover:text-gray-800">
                  จดจำฉันไว้
                </span>
              </label>
              <a
                href="#"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
              >
                ลืมรหัสผ่าน?
              </a>
            </div>

            {/* Login Button */}
            <Button
              onClick={signIn}
              className="w-full h-10 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all group"
            >
              เข้าสู่ระบบ
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500">หรือ</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                variant="outline"
                onClick={signInWithGoogle}
                className="h-9 rounded-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-700">
                  Google
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={signInWithFacebook}
                className="h-9 rounded-lg"
              >
                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-xs font-medium text-gray-700">
                  Facebook
                </span>
              </Button>
            </div>

            {/* Registration Link */}
            <p className="text-center text-xs text-gray-600">
              ยังไม่มีบัญชี?{" "}
              <a
                href="/auth/signup"
                className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
              >
                สมัครสมาชิก
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Help Link */}
        <p className="text-center text-xs text-gray-600 mt-3 hover:text-gray-800 cursor-pointer transition-colors">
          ต้องการความช่วยเหลือ?{" "}
          <span className="text-indigo-600 hover:underline">ติดต่อเรา</span>
        </p>
      </div>
    </div>
  );
}
