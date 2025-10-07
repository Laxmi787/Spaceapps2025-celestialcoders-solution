import { useState } from "react";
import { Telescope } from "lucide-react";
import StarField from "@/components/StarField";
import FileUpload from "@/components/FileUpload";
import DataPreview from "@/components/DataPreview";
import ResultsDisplay, { PredictionResult } from "@/components/ResultsDisplay";
import ResultsChart from "@/components/ResultsChart";
import { Button } from "@/components/ui/button";
import { parseCSV } from "@/utils/csvParser";
import { classifyExoplanets } from "@/utils/classifier";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [uploadedData, setUploadedData] = useState<Record<string, string | number>[]>([]);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      setUploadedData(parsed);
      setResults([]);
      toast({
        title: "✓ File uploaded successfully",
        description: `Loaded ${parsed.length} rows of data`,
      });
    } catch (error) {
      toast({
        title: "Error parsing CSV",
        description: "Please check your file format",
        variant: "destructive",
      });
    }
  };

  const handleClassify = () => {
    if (uploadedData.length === 0) {
      toast({
        title: "No data to classify",
        description: "Please upload a CSV file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      const predictions = classifyExoplanets(uploadedData);
      setResults(predictions);
      setIsProcessing(false);
      
      toast({
        title: "🪐 Classification complete!",
        description: `Processed ${predictions.length} exoplanet candidates`,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Telescope className="w-12 h-12 text-primary animate-float" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Exoplanet Classifier
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload star data and discover if a planet is confirmed, candidate, or false positive
          </p>
        </header>

        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload
            onFileSelect={handleFileSelect}
            isUploaded={uploadedData.length > 0}
          />
        </div>

        {/* Data Preview */}
        {uploadedData.length > 0 && (
          <div className="mb-8">
            <DataPreview data={uploadedData} />
          </div>
        )}

        {/* Classify Button */}
        {uploadedData.length > 0 && (
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleClassify}
              disabled={isProcessing}
              variant="cosmic"
              size="lg"
              className="text-lg px-12"
            >
              {isProcessing ? "🔄 Processing..." : "🚀 Classify Exoplanets"}
            </Button>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-8">
            <ResultsDisplay results={results} />
            <ResultsChart results={results} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-primary/20">
          <p className="text-muted-foreground">
            ✨ Powered by NASA Kepler/TESS data and AI/ML
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Exploring the cosmos, one exoplanet at a time
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
