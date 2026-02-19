"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let channel: any;

    const setupRealtime = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (!data.user) return;

      await fetchBookmarks(data.user.id);

      channel = supabase
        .channel("bookmarks-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
          },
          (payload) => {
            console.log("Realtime event:", payload);

            // Always re-fetch after any change
            fetchBookmarks(data.user.id);
          },
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookmarks(data);
    }
  };

  const handleAddBookmark = async () => {
    if (!title.trim() || !url.trim()) {
      alert("Title and URL are required");
      return;
    }

    // URL validation
    try {
      new URL(url.trim());
    } catch {
      alert("Please enter a valid URL");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("bookmarks").insert([
      {
        title: title.trim(),
        url: url.trim(),
        user_id: user.id,
      },
    ]);

    setLoading(false);

    if (!error) {
      setTitle("");
      setUrl("");
      fetchBookmarks(user.id);
    } else {
      console.error("Insert error:", error.message);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (!error) {
      fetchBookmarks(user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-12">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            Logout
          </button>
        </div>

        <p className="mb-6 text-gray-600">Welcome, {user.email}</p>

        {/* Add Bookmark */}
        <div className="mb-6 space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddBookmark}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Bookmark"}
          </button>
        </div>

        {/* Bookmark List */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Your Bookmarks</h2>

          {bookmarks.length === 0 && (
            <p className="text-gray-500 text-sm">No bookmarks yet.</p>
          )}

          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="p-4 border rounded-lg mb-3 flex justify-between items-center hover:shadow transition"
            >
              <div>
                <p className="font-medium">{bookmark.title}</p>
                <a
                  href={bookmark.url}
                  target="_blank"
                  className="text-blue-600 text-sm hover:underline"
                >
                  {bookmark.url}
                </a>
              </div>

              <button
                onClick={() => handleDeleteBookmark(bookmark.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}
