import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { NumerologyPDFReport } from "./pdf-report";
import type { NumerologyResult, CompatibilityResult } from "@shared/schema";
import { pdf } from '@react-pdf/renderer';
import { useToast } from "@/hooks/use-toast";

interface Props {
  result: NumerologyResult;
  compatibility?: CompatibilityResult;
}

export function DownloadReportButton({ result, compatibility }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // Generate the PDF blob
      const blob = await pdf(
        <NumerologyPDFReport result={result} compatibility={compatibility} />
      ).toBlob();

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create an invisible anchor element
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;

      // Set filename with date
      const date = new Date().toISOString().split('T')[0];
      link.download = `numerology-report-${result.name.toLowerCase().replace(/\s+/g, '-')}-${date}.pdf`;

      // Append to document, click, and cleanup
      document.body.appendChild(link);

      // For mobile devices, we need to use a different approach
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        window.open(url, '_blank');
      } else {
        link.click();
      }

      // Cleanup
      document.body.removeChild(link);
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

      toast({
        title: "Report Generated",
        description: "Your numerology report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="w-full max-w-md flex items-center justify-center gap-2"
      disabled={isGenerating}
    >
      <Download className={`h-4 w-4 ${isGenerating ? 'animate-bounce' : ''}`} />
      {isGenerating ? 'Generating Report...' : 'Download Detailed Report'}
    </Button>
  );
}