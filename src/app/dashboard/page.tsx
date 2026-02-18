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

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-gray-700 text-white rounded mb-4"
      >
        Logout
      </button>

      {user && <p className="mb-6">Welcome, {user.email}</p>}

      {/* Add Bookmark Form */}
      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleAddBookmark}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Bookmark"}
        </button>
      </div>

      {/* Bookmark List */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Your Bookmarks</h2>

        {bookmarks.length === 0 && <p>No bookmarks yet.</p>}

        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="p-3 border rounded mb-2 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{bookmark.title}</p>
              <a
                href={bookmark.url}
                target="_blank"
                className="text-blue-600 text-sm"
              >
                {bookmark.url}
              </a>
            </div>

            <button
              onClick={() => handleDeleteBookmark(bookmark.id)}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
