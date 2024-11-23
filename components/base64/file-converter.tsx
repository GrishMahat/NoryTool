"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DownloadIcon, CopyIcon, AlertCircleIcon, CheckCircleIcon, UploadIcon, XIcon } from 'lucide-react';
import { base64Utils } from "@/lib/base64";
import { motion, AnimatePresence } from "framer-motion";

export function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setSelectedFile(file);
        setIsLoading(true);
        setProgress(0);
        const base64 = await base64Utils.fileToBase64(file);
        setFileBase64(base64);
        setMimeType(file.type);
        setError("");
      } catch (err) {
        setError("Error processing file: " + (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const downloadBase64AsFile = () => {
    try {
      const blob = base64Utils.base64ToFile(fileBase64, mimeType);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedFile?.name || "decoded-file";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setError("");
    } catch (err) {
      setError("Error downloading file: " + (err as Error).message);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileBase64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileBase64("");
    setMimeType("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">File to Base64 Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="file-input">File Input</Label>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Input
                id="file-input"
                type="file"
                onChange={handleFileSelect}
                className="cursor-pointer opacity-0 absolute inset-0 w-full h-full"
                ref={fileInputRef}
              />
              <Button variant="secondary" className="w-full">
                <UploadIcon className="w-4 h-4 mr-2" />
                {selectedFile ? selectedFile.name : "Choose a file"}
              </Button>
            </div>
            {selectedFile && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={clearFile}>
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear selected file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {selectedFile && (
            <div className="text-sm text-muted-foreground">
              Size: {(selectedFile.size / 1024).toFixed(2)} KB
            </div>
          )}
        </div>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Progress value={progress} className="w-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {fileBase64 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Base64 Output</Label>
              <span className="text-sm text-muted-foreground">
                MIME: {mimeType || "application/octet-stream"}
              </span>
            </div>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                {fileBase64}
              </pre>
            </ScrollArea>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={copyToClipboard} className="flex-1">
                      {copied ? (
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                      ) : (
                        <CopyIcon className="w-4 h-4 mr-2" />
                      )}
                      {copied ? "Copied!" : "Copy Base64"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copied to clipboard" : "Copy Base64 to clipboard"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={downloadBase64AsFile} variant="secondary">
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download File
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download decoded file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
