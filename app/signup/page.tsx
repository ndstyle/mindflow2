"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { user, signUp } = useAuth();
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
    setStatus("Creating account...");
    
    try {
      const { error } = await signUp(formValues.email, formValues.password);
      
      if (error) {
        alert(error.message);
        setStatus("");
        return;
      }

      setStatus("Account created successfully! Check your email for confirmation.");
    } catch (error) {
      console.error("Signup error:", error);
      alert("An unexpected error occurred during signup.");
    }
    
    setStatus("");
  };

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <Link href="/" style={{ alignSelf: "flex-start", margin: 16 }}>◄ Home</Link>
      <form style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 300 }} onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#777" }}>
          Demo app, please don't use your real email or password
        </p>
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
        <button type="submit">Create Account</button>
        <Link href="/login">Already have an account? Sign In</Link>
        {status && <p>{status}</p>}
      </form>
    </main>
  );
}
