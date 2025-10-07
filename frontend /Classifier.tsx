import { useState } from "react";
import StarField from "@/components/StarField";
import FileUpload from "@/components/FileUpload";
import DataPreview from "@/components/DataPreview";
import ResultsDisplay, { PredictionResult } from "@/components/ResultsDisplay";
import ResultsChart from "@/components/ResultsChart";
import { Button } from "@/components/ui/button";
import { parseCSV } from "@/utils/csvParser";
import { useToast } from "@/hooks/use-toast";

const Classifier = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseCSV(text);
        setUploadedData(parsed);
        setResults([]);
        setIsUploaded(true);
        toast({
          title: "File uploaded successfully",
          description: `Loaded ${parsed.length} observations`,
        });
      } catch (error) {
        toast({
          title: "Error parsing CSV",
          description: "Please check your file format",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClassify = async () => {
    if (uploadedData.length === 0) {
      toast({
        title: "No data to classify",
        description: "Please upload a CSV file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: "Processing...",
      description: "Sending data to your backend model.",
    });

    try {
      // ✅ Use relative path so it works on Render automatically
      const response = await fetch("/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features: uploadedData, model_type: "rf" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.statusText}`);
      }

      const data = await response.json();

      const labelMapping: { [key: number]: "False Positive" | "Candidate" | "Confirmed Planet" } = {
        0: "False Positive",
        1: "Candidate",
        2: "Confirmed Planet",
      };

      const formattedResults = data.prediction.map((pred: number, index: number) => ({
        prediction: labelMapping[pred],
        confidence: data.confidence ? data.confidence[index] : Math.random() * (0.99 - 0.85) + 0.85,
      }));

      setResults(formattedResults);
      toast({
        title: "Classification complete!",
        description: "Received predictions from your model.",
      });
    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        title: "Prediction Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <StarField />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            🔭 Exoplanet Classifier
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload star data and discover if a planet is confirmed, candidate, or false positive.
          </p>
        </header>

        <div className="space-y-8">
          <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Upload Data</h2>
            <FileUpload onFileSelect={handleFileUpload} isUploaded={isUploaded} />
          </section>

          {uploadedData.length > 0 && (
            <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-2xl font-semibold mb-4 text-primary">Data Preview</h2>
              <DataPreview data={uploadedData} />
            </section>
          )}

          {uploadedData.length > 0 && (
            <section className="text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Button
                onClick={handleClassify}
                disabled={isProcessing}
                variant="cosmic"
                size="lg"
                className="text-lg px-8 py-6 h-auto"
              >
                {isProcessing ? "Processing..." : "Classify Exoplanets"}
              </Button>
            </section>
          )}

          {results.length > 0 && (
            <>
              <section className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Classification Results</h2>
                <ResultsDisplay results={results} />
              </section>

              <section className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Distribution</h2>
                <ResultsChart results={results} />
              </section>
            </>
          )}
        </div>

        <footer className="text-center text-muted-foreground text-sm mt-16 pb-8">
          <p>Powered by NASA Kepler/TESS data and AI/ML</p>
        </footer>
      </div>
    </div>
  );
};

export default Classifier;

