import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface DataPreviewProps {
  data: Record<string, string | number>[];
}

const DataPreview = ({ data }: DataPreviewProps) => {
  if (data.length === 0) return null;

  const columns = Object.keys(data[0]);
  const previewData = data.slice(0, 5);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 animate-slide-up">
      <h3 className="text-xl font-semibold mb-4 text-primary">Data Preview (First 5 Rows)</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-primary/20">
              {columns.map((col) => (
                <TableHead key={col} className="text-primary font-semibold">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row, idx) => (
              <TableRow key={idx} className="border-primary/10 hover:bg-primary/5">
                {columns.map((col) => (
                  <TableCell key={col} className="text-foreground">
                    {typeof row[col] === "number" ? row[col].toFixed(4) : row[col]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default DataPreview;
