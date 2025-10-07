import { PredictionResult } from "@/components/ResultsDisplay";

// Mock classifier that simulates ML predictions
// In production, this would call your actual ML backend API
export const classifyExoplanets = (
  data: Record<string, string | number>[]
): PredictionResult[] => {
  return data.map((row) => {
    // Simulate classification logic based on features
    const period = Number(row.koi_period) || Math.random() * 100;
    const duration = Number(row.koi_duration) || Math.random() * 10;
    const prad = Number(row.koi_prad) || Math.random() * 5;
    const snr = Number(row.koi_model_snr) || Math.random() * 50;

    // Simple heuristic for demonstration
    let score = 0;
    let confidence = 0.5;

    if (period > 5 && period < 300) score += 0.3;
    if (duration > 1 && duration < 15) score += 0.3;
    if (prad > 0.5 && prad < 20) score += 0.2;
    if (snr > 10) score += 0.2;

    confidence = Math.min(0.95, 0.6 + score + Math.random() * 0.2);

    let prediction: "Confirmed Planet" | "Candidate" | "False Positive";

    if (score > 0.7 && snr > 15) {
      prediction = "Confirmed Planet";
      confidence = Math.max(confidence, 0.85);
    } else if (score > 0.4) {
      prediction = "Candidate";
      confidence = Math.min(confidence, 0.8);
    } else {
      prediction = "False Positive";
      confidence = Math.max(0.6, confidence);
    }

    return { prediction, confidence };
  });
};
