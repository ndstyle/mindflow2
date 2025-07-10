"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };
  return (
    <button onClick={handleSignOut} style={{ margin: 8, padding: 8 }}>
      Sign Out
    </button>
  );
} 