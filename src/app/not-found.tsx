import { redirect } from "next/navigation";

export default function NotFound() {
  redirect("/auth/login"); // หรือ /app/home ตาม logic
}
