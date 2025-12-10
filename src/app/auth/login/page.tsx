"use client";
import { useState } from "react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-4 max-h-[95vh] overflow-y-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-linear-to-r from-blue-500 to-indigo-600 px-8 py-8 text-white">
            <div className="flex flex-col items-center">
              <div
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 shadow-sm
              m"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold bg-linear-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    IT
                  </span>
                </div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                SMART TASK AI
              </h1>
              <p className="text-blue-100 text-xs mt-1">ยินดีต้อนรับกลับมา</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6">
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                อีเมลหรือชื่อผู้ใช้
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-gray-50 border-2 border-gray-100 outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200 text-gray-700 placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                รหัสผ่าน
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-12 rounded-xl bg-gray-50 border-2 border-gray-100 outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200 text-gray-700 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-5">
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
            <button className="login-button w-full h-12 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group">
              เข้าสู่ระบบ
              <svg
                className="w-4 h-4 ml-2 arrow-icon transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500">หรือ</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button className="h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group">
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
                <span className="ml-2 text-xs font-medium text-gray-700">
                  Google
                </span>
              </button>
              <button className="h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group">
                <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2 text-xs font-medium text-gray-700">
                  Facebook
                </span>
              </button>
            </div>

            {/* Registration Link */}
            <p className="text-center text-xs text-gray-600">
              ยังไม่มีบัญชี?{" "}
              <a
                href="/registration"
                className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
              >
                สมัครสมาชิก
              </a>
            </p>
          </div>
        </div>

        {/* Help Link */}
        <p className="text-center text-xs text-gray-600 mt-4 hover:text-gray-800 cursor-pointer transition-colors">
          ต้องการความช่วยเหลือ?{" "}
          <span className="text-indigo-600 hover:underline">ติดต่อเรา</span>
        </p>
      </div>

      <style jsx>{`
        .blob {
          position: absolute;
          width: 20rem;
          height: 20rem;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.7;
          mix-blend-mode: multiply;
        }

        .blob-1 {
          background: rgb(196, 181, 253);
          top: -10rem;
          right: -10rem;
          animation: blob 7s infinite;
        }

        .blob-2 {
          background: rgb(147, 197, 253);
          bottom: -10rem;
          left: -10rem;
          animation: blob 7s infinite 2s;
        }

        .blob-3 {
          background: rgb(165, 180, 252);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: blob 7s infinite 4s;
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .login-button:hover .arrow-icon {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
