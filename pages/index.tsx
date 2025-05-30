// pages/index.tsx
import { useState, useEffect } from "react";
import { getLeaderboards, saveLeaderboards } from "@/utils/storage";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [boards, setBoards] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    setBoards(getLeaderboards());
  }, []);

const createBoard = () => {
  const name = prompt("Enter leaderboard name:");
  if (!name) return;

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // e.g., 3 May 2025

  const newBoard = {
    id: uuid(),
    name,
    students: [],
    createdAt: formattedDate,
  };

  const updated = [...boards, newBoard];
  saveLeaderboards(updated);
  setBoards(updated);
};


  const deleteBoard = (id: string) => {
    if (!confirm("Are you sure you want to delete this leaderboard?")) return;
    const updated = boards.filter((b) => b.id !== id);
    saveLeaderboards(updated);
    setBoards(updated);
  };

  return (
<div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-primary">
        🎉 Welcome to Quiz Leaderboards! 🏆
      </h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={createBoard}
          className="bg-secondary text-black font-bold px-6 py-3 rounded-full shadow-md hover:bg-yellow-500 hover:scale-105 transition"
        >
          ➕ Create New Leaderboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {boards.map((b) => (
          <div
            key={b.id}
            className="bg-white text-dark rounded-2xl p-6 shadow-xl border-2 border-primary hover:scale-105 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-4 text-primary">{b.name}</h2>
             {b.createdAt && (
      <p className="text-sm text-gray-600 mb-4">📅 Created on {b.createdAt}</p>
    )}
            <div className="space-x-4">
              <button
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                onClick={() => router.push(`/leaderboard/${b.id}`)}
              >
                🚀 Open
              </button>
              <button
                className="bg-accent text-white px-4 py-2 rounded-full hover:bg-pink-700 transition"
                onClick={() => deleteBoard(b.id)}
              >
                ❌ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
