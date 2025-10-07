export const parseCSV = (text: string): Record<string, string | number>[] => {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string | number> = {};

    headers.forEach((header, idx) => {
      const value = values[idx];
      row[header] = isNaN(Number(value)) ? value : Number(value);
    });

    return row;
  });
};
