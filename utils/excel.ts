import * as XLSX from "xlsx";

export const exportToExcel = (data: any[], fileName = "leaderboard.xlsx") => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leaderboard");
  XLSX.writeFile(wb, fileName);
};
