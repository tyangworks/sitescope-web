export { supabase } from "@/lib/supabase/client";

export const authProviders = [
  {
    id: 'google',
    name: 'Google',
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    bgColor: 'bg-[#00a4ef]',
    textColor: 'text-white',
    borderColor: 'border-[#00a4ef]',
  },
];
