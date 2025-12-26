"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/auth/login");
        return;
      }

      // ✅ login สำเร็จ
      router.replace("/app/home");
    };

    handleCallback();
  }, [router]);

  return <p>กำลังเข้าสู่ระบบ...</p>;
}
