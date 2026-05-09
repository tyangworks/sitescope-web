// lib/auth.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authProviders = [
  {
    id: 'google',
    name: 'Google',
    icon: '🔵',
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: '🟦',
    bgColor: 'bg-[#00a4ef]',
    textColor: 'text-white',
    borderColor: 'border-[#00a4ef]',
  },
];