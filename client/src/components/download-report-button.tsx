import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { NumerologyPDFReport } from "./pdf-report";
import type { NumerologyResult, CompatibilityResult } from "@shared/schema";
import { pdf } from '@react-pdf/renderer';

interface Props {
  result: NumerologyResult;
  compatibility?: CompatibilityResult;
}

export function DownloadReportButton({ result, compatibility }: Props) {
  const handleDownload = async () => {
    try {
      const blob = await pdf(
        <NumerologyPDFReport result={result} compatibility={compatibility} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `numerology-report-${result.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="w-full max-w-md flex items-center justify-center gap-2"
    >
      <Download className="h-4 w-4" />
      Download Detailed Report
    </Button>
  );
}
