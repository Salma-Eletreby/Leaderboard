// pages/leaderboard/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getLeaderboardById, updateLeaderboard } from "@/utils/storage";
import { exportToExcel } from "@/utils/excel";

export default function LeaderboardPage() {
  const router = useRouter();
  const { id } = router.query;
  const [board, setBoard] = useState<any>(null);
  const [newStudents, setNewStudents] = useState("");
  const [showAddStudents, setShowAddStudents] = useState(false);
  const [scoreChangeId, setScoreChangeId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      const data = getLeaderboardById(id);
      if (data) setBoard(data);
    }
  }, [id]);

  const handleAddStudents = () => {
    if (!board) return;
    const names = newStudents
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);
    const updated = {
      ...board,
      students: [
        ...board.students,
        ...names.map((name) => ({ name, score: 0 })),
      ],
    };
    setBoard(updated);
    updateLeaderboard(updated);
    setNewStudents("");
    setShowAddStudents(false);
  };

  const updateScore = (name: string, delta: number) => {
    if (!board) return;
    const updated = {
      ...board,
      students: board.students.map((student: any) =>
        student.name === name
          ? { ...student, score: student.score + delta }
          : student
      ),
    };
    setBoard(updated);
    setScoreChangeId(name); // trigger animation
    updateLeaderboard(updated);
    setTimeout(() => setScoreChangeId(null), 300); // reset animation ID
  };

  const sortedStudents = board?.students
    ?.slice()
    ?.sort((a: any, b: any) => b.score - a.score);

  const handleDone = () => router.push(`/done/${id}`);
  const handleExport = () => exportToExcel(sortedStudents);

  return (
    <div className="min-h-screen bg-white text-black p-6">
      {board && (
        <>
          <h1 className="text-3xl font-bold text-center mb-6">🏆 {board.name} 🏆</h1>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowAddStudents(!showAddStudents)}
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/80 transition"
            >
              {showAddStudents ? "Hide Add Students" : "Show Add Students"}
            </button>
          </div>

          {showAddStudents && (
            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start">
              <textarea
                placeholder="Add student names, one per line"
                className="w-full md:w-1/2 h-40 p-4 border rounded-lg"
                value={newStudents}
                onChange={(e) => setNewStudents(e.target.value)}
              />
              <button
                className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/80 transition"
                onClick={handleAddStudents}
              >
                Add Students
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
            {sortedStudents.map((s: any, i: number) => {
              let bgColor = "bg-primary";
              if (i === 0) bgColor = "bg-darkblue text-white";
              else if (i === 1) bgColor = "bg-secondary text-black";
              else if (i === 2) bgColor = "bg-accent text-white";

              return (
                <div
                  key={s.name}
                  className={`flex justify-between items-center shadow-md p-4 rounded-xl transition ${bgColor}`}
                >
                  <span className="text-lg font-semibold">
                    {i + 1}. {s.name}
                    {i === 0 && " 🥇"}
                    {i === 1 && " 🥈"}
                    {i === 2 && " 🥉"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateScore(s.name, -1)}
                      className="w-8 h-8 rounded-full bg-accent text-white hover:bg-accent/80 transition flex items-center justify-center shadow-md border border-white"
                    >
                      -
                    </button>
                    <span
                      className={`text-xl font-bold inline-block ${
                        scoreChangeId === s.name ? "animate-slide" : ""
                      }`}
                    >
                      {s.score}
                    </span>
                    <button
                      onClick={() => updateScore(s.name, 1)}
                      className="w-8 h-8 rounded-full bg-secondary text-black hover:bg-secondary/80 transition flex items-center justify-center shadow-md border border-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleExport}
              className="bg-secondary text-white px-4 py-2 rounded-full hover:bg-secondary/80 transition"
            >
              📤 Export to Excel
            </button>
            <button
              onClick={handleDone}
              className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/80 transition"
            >
              ✅ Done
            </button>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes slide {
          0% {
            transform: translateY(10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide {
          animation: slide 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
