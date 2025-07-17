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
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <Link href="/" className="self-start mb-4 ml-4 text-blue-400 hover:underline">◄ Home</Link>
      <form className="flex flex-col gap-3 min-w-[300px] bg-gray-900/80 p-8 rounded-xl shadow-lg border border-gray-800" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-2 text-white">Sign Up</h1>
        <p className="text-center text-xs text-gray-400 mb-2">
          Demo app, please don't use your real email or password
        </p>
        <input
          name="email"
          onChange={handleInputChange}
          type="email"
          placeholder="Email"
          required
          className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          onChange={handleInputChange}
          type="password"
          placeholder="Password"
          required
          className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition">Create Account</button>
        <Link href="/login" className="text-blue-400 hover:underline text-sm">Already have an account? Sign In</Link>
        {status && <p className="text-gray-400 text-sm mt-2">{status}</p>}
      </form>
    </main>
  );
}
