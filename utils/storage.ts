// utils/storage.ts
type Student = {
  name: string;
  score: number;
};

type Leaderboard = {
  id: string;
  name: string;
  students: Student[];
  createdAt?: string; 
};


export const getLeaderboards = (): Leaderboard[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("leaderboards") || "[]");
};

export const saveLeaderboards = (data: Leaderboard[]) => {
  localStorage.setItem("leaderboards", JSON.stringify(data));
};

export const getLeaderboardById = (id: string): Leaderboard | undefined => {
  const boards = getLeaderboards();
  return boards.find((b: Leaderboard) => b.id === id);
};

export const updateLeaderboard = (updated: Leaderboard) => {
  let boards = getLeaderboards();
  boards = boards.map((b: Leaderboard) => (b.id === updated.id ? updated : b));
  saveLeaderboards(boards);
};
