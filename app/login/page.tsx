"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, signIn } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Logging in...");
    const { error } = await signIn(formValues.email, formValues.password);
    if (error) {
      alert(error.message);
    }
    setStatus("");
  };

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Link href="/" style={{ alignSelf: "flex-start", margin: 16 }}>◄ Home</Link>
      <form style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }} onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        <input
          name="email"
          onChange={handleInputChange}
          type="email"
          placeholder="Email"
          required
        />
        <input
          name="password"
          onChange={handleInputChange}
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <Link href="/signup">Don't have an account? Sign Up</Link>
        {status && <p>{status}</p>}
      </form>
    </main>
  );
}
