import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export interface PredictionResult {
  prediction: "Confirmed Planet" | "Candidate" | "False Positive";
  confidence: number;
}

interface ResultsDisplayProps {
  results: PredictionResult[];
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  if (results.length === 0) return null;

  const getVariant = (prediction: string) => {
    if (prediction === "Confirmed Planet") return "success";
    if (prediction === "Candidate") return "warning";
    return "rejected";
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 animate-slide-up">
      <h3 className="text-2xl font-bold mb-6 text-primary">🪐 Classification Results</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-primary/20">
              <TableHead className="text-primary font-semibold">#</TableHead>
              <TableHead className="text-primary font-semibold">Prediction</TableHead>
              <TableHead className="text-primary font-semibold">Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, idx) => (
              <TableRow key={idx} className="border-primary/10 hover:bg-primary/5">
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>
                  <Badge variant={getVariant(result.prediction)} className="text-sm">
                    {result.prediction}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  {(result.confidence * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ResultsDisplay;
