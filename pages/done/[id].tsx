// pages/done/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getLeaderboardById } from "@/utils/storage";

export default function DonePage() {
  const router = useRouter();
  const { id } = router.query;
  const [top3, setTop3] = useState<any[]>([]);
  const [others, setOthers] = useState<any[]>([]);

  useEffect(() => {
    if (typeof id === "string") {
      const board = getLeaderboardById(id);
      if (board) {
        const sorted = board.students.sort((a: any, b: any) => b.score - a.score);
        setTop3(sorted.slice(0, 3));
        setOthers(sorted.slice(3));
      }
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary text-white p-6 font-sans">
      <h1 className="text-5xl text-center font-bold mb-10 drop-shadow-lg pb-8">🎉 Final Results</h1>

      {/* Grid: Podium + Others side by side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Podium */}
        <div className="flex justify-center items-end gap-4">
          <PodiumPlayer player={top3[1]} height="h-48" medal="🥈" color="bg-secondary" />
          <PodiumPlayer player={top3[0]} height="h-64" medal="🥇" color="bg-primary" />
          <PodiumPlayer player={top3[2]} height="h-40" medal="🥉" color="bg-accent" />
        </div>

        {/* Other Players */}
        <div className="bg-white/80 backdrop-blur-md text-black rounded-2xl shadow-2xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-center text-darkblue underline underline-offset-4 mb-2">🎮 Other Players</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {others.map((s, i) => (
              <div key={i} className="bg-primary/10 p-4 rounded-xl flex flex-col items-center shadow hover:scale-105 transition-transform duration-300 border border-primary">
                <div className="text-xl font-bold text-darkblue">{s.name}</div>
                <div className="text-lg text-black font-semibold">{s.score} pts</div>
                <div className="mt-1 text-xs bg-accent text-white px-3 py-1 rounded-full">🏅 Participant</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PodiumPlayer({ player, height, medal, color }: { player: any; height: string; medal: string; color: string }) {
  if (!player) return <div className={`w-24 ${height}`}></div>;
  return (
    <div className="flex flex-col items-center">
      <div className={`w-24 ${height} ${color} text-white rounded-t-xl rounded-b-md flex items-end justify-center font-bold text-sm shadow-lg p-2`}>
        <span className="text-center">{player.name}</span>
      </div>
      <div className="mt-2 text-xl font-semibold text-white text-center drop-shadow-md">
        {medal}
        <br />
        {player.score} pts
      </div>
    </div>
  );
}
