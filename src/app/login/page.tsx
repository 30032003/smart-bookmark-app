"use client";

import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error(error.message);
    }
  };

return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-xl shadow-xl text-center w-80">
      <h1 className="text-xl font-bold mb-6">Smart Bookmark App</h1>

      <button
        onClick={handleLogin}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </div>
  </div>
);

}
