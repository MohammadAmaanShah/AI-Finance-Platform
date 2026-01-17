"use client";

import { scanReceipt } from "@/actions/transaction";
import useFetch from "@/hooks/useFetch";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ReceiptScanner = ({ onScanComplete }) => {
  const {
    loading: scanReceiptLoading,
    fn: scanReciptFn,
    data: scannedData,
  } = useFetch(scanReceipt);
  const fileInputRef = useRef();

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    await scanReciptFn(file);
  };

  useEffect(() => {
    if (!scanReceiptLoading && scannedData) {
      onScanComplete(scannedData);
      toast.success("reciept Scanned Succesfully");
    }
  }, [scanReceiptLoading, scannedData]);
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        capture="environment"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-linear-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
      >
        {" "}
        {scanReceiptLoading ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            <span>Scanning Receipt ...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ReceiptScanner;
