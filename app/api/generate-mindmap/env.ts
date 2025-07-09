// pages/api/env.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("API route: NEXT_PUBLIC_SUPABASE_URL =", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("API route: NEXT_PUBLIC_SUPABASE_ANON_KEY =", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    res.status(200).json({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  }
