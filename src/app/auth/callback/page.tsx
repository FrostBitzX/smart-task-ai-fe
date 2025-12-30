"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/auth/login");
        return;
      }

      const user = data.session.user;
      const token = data.session.access_token;

      // เช็คว่ามี account หรือยัง
      const { data: existingAccount } = await supabase
        .from("accounts")
        .select("id")
        .eq("id", user.id)
        .single();

      // ถ้ายังไม่มี ให้สร้าง
      if (!existingAccount) {
        const { error: insertError } = await supabase.from("accounts").insert({
          id: user.id,
          email: user.email,
          username: null,
          password: "",
          state: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("Error creating account:", insertError);
        }
      }

      // Save token to cookie
      document.cookie = `auth-token=${token}; path=/; max-age=86400`;

      router.replace("/app/home");
    };

    handleCallback();
  }, [router]);

  return <p>กำลังเข้าสู่ระบบ...</p>;
}
