import { Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploaded: boolean;
}

const FileUpload = ({ onFileSelect, isUploaded }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      onFileSelect(file);
    } else {
      alert("Please upload a valid CSV file");
    }
  };

  return (
    <Card className="p-8 border-2 border-dashed border-primary/30 bg-card/50 backdrop-blur-sm hover:border-primary/60 transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-primary/10 animate-float">
          <Upload className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Upload Star Data</h3>
          <p className="text-muted-foreground mb-4">
            Upload a CSV file with columns: koi_period, koi_duration, koi_prad, koi_model_snr, etc.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant={isUploaded ? "success" : "cosmic"}
          size="lg"
          className="min-w-[200px]"
        >
          {isUploaded ? "✓ File Uploaded" : "Select CSV File"}
        </Button>
      </div>
    </Card>
  );
};

export default FileUpload;
