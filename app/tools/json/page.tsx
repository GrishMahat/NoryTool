"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils";
import {
  FileCode,
  Minimize2,
  Filter,
  Trash2,
  Search,
  Copy,
  AlertCircle,
  Download,
  Upload,
  Code2,
  FileJson,
  Braces
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JSONUtils, JSONAnalysis, FilterOptions } from "@/lib/jsonUtils";
import { AnalysisView } from '@/components/json/analysis-view';
import { FilterView } from '@/components/json/filter-view';
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";

const sampleJson = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
  address: {
    street: "123 Main St",
    city: "Boston",
    country: "USA"
  },
  hobbies: ["reading", "gaming", "coding"]
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};




export default function JSONToolPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [activeTab, setActiveTab] = useState<"beautify" | "minify" | "filter" | "analyze">("beautify");
  const [analysis, setAnalysis] = useState<JSONAnalysis | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  
  // Keep track of whether input is valid JSON
  const isValidJSON = useRef(false);

  // Add constants for file size limits
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const LARGE_FILE_SIZE = 1 * 1024 * 1024; // 1MB - threshold for lazy loading

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      isValidJSON.current = true;
      const formatted = JSON.stringify(parsed, null, activeTab === "beautify" ? 2 : 0);
      setOutput(formatted);
      setError(null);
      toast({
        title: "JSON formatted successfully",
        variant: "default"
      });
    } catch (err) {
      isValidJSON.current = false;
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput(input);
      toast({
        title: "Error formatting JSON",
        description: err instanceof Error ? err.message : "Invalid JSON",
        variant: "destructive"
      });
    }
  }, [input, activeTab]);

  const handleFilter = useCallback((options: FilterOptions) => {
    if (!isValidJSON.current) return;
    try {
      const filtered = JSONUtils.filter(input, options);
      setOutput(filtered);
      setError(null);
      toast({
        title: "JSON filtered successfully",
        variant: "default"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Filtering failed");
      toast({
        title: "Error filtering JSON",
        description: err instanceof Error ? err.message : "Filtering failed",
        variant: "destructive"
      });
    }
  }, [input]);

  const handleAnalyze = useCallback(() => {
    if (!isValidJSON.current) return;
    try {
      const result = JSONUtils.analyze(input);
      setAnalysis(result);
      setError(null);
      toast({
        title: "JSON analyzed successfully",
        variant: "default"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      toast({
        title: "Error analyzing JSON",
        description: err instanceof Error ? err.message : "Analysis failed",
        variant: "destructive"
      });
    }
  }, [input]);

  const handleCopy = async () => {
    try {
      await copyToClipboard(output);
      setCopyStatus("copied");
      toast({
        title: "Copied to clipboard",
        variant: "default"
      });
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("failed");
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive"
      });
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    JSONUtils.downloadJSON(output, "formatted.json");
    toast({
      title: "JSON downloaded successfully",
      variant: "default"
    });
  };

  // Debounced handlers
  const debouncedFormat = useCallback(
    debounce(() => {
      if (!input) return;
      handleFormat();
    }, 500),
    [handleFormat]
  );

  const debouncedFilter = useCallback(
    debounce((options: FilterOptions) => {
      if (!input) return;
      handleFilter(options);
    }, 500),
    [handleFilter]
  );

  const debouncedAnalyze = useCallback(
    debounce(() => {
      if (!input) return;
      handleAnalyze();
    }, 500),
    [handleAnalyze]
  );

  useEffect(() => {
    if (!input) return;
    
    // First validate JSON
    try {
      JSON.parse(input);
      isValidJSON.current = true;
    } catch {
      isValidJSON.current = false;
      return;
    }

    // Only process if JSON is valid
    if (activeTab === "beautify" || activeTab === "minify") {
      debouncedFormat();
    } else if (activeTab === "filter") {
      debouncedFilter({ path: "" });
    } else if (activeTab === "analyze") {
      debouncedAnalyze();
    }
  }, [input, activeTab, debouncedFormat, debouncedFilter, debouncedAnalyze]);

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError(null);
    isValidJSON.current = false;
    toast({
      title: "Reset successful",
      variant: "default"
    });
  };

  const handleTabChange = (value: string) => {
    if (value === activePanel) {
      setActivePanel(null);
    } else {
      setActivePanel(value);
      if (value === "analyze" && isValidJSON.current) {
        handleAnalyze();
      }
    }
    setActiveTab(value as "beautify" | "minify" | "filter" | "analyze");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }

    setFileSize(file.size);
    setIsLoading(true);

    try {
      const text = await (file.size > LARGE_FILE_SIZE 
        ? await readLargeFile(file)
        : await file.text());

      // Validate JSON
      try {
        JSON.parse(text); // Test if valid JSON
        setInput(text);
        toast({
          title: file.size > LARGE_FILE_SIZE 
            ? "Large file loaded successfully"
            : "File loaded successfully",
          variant: "default"
        });
      } catch {
        throw new Error("Invalid JSON file");
      }
    } catch (err) {
      toast({
        title: "Error loading file",
        description: err instanceof Error ? err.message : "Failed to load file",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to read large files
  const readLargeFile = async (file: File): Promise<string> => {
    const reader = new ReadableStreamDefaultReader(file.stream());
    const chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }

    const blob = new Blob(chunks, { type: 'application/json' });
    return blob.text();
  };

  const handleEditorChange = (value: string | undefined) => {
    setInput(value || "");
  };

  // Add loading indicator component
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">
          Loading {(fileSize / 1024 / 1024).toFixed(2)}MB file...
        </p>
      </div>
    </div>
  );

  return (
    <div className='container mx-auto py-4 px-2 sm:px-4 space-y-4 max-w-7xl'>
      <div className='flex items-center gap-3'>
        <FileCode className='w-6 h-6 sm:w-8 sm:h-8 text-primary' />
        <div>
          <h1 className='text-xl sm:text-2xl font-bold'>JSON Formatter</h1>
          <p className='text-sm sm:text-base text-muted-foreground'>
            Professional JSON tools for developers
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 sm:p-4 bg-destructive/15 text-destructive rounded-lg text-sm sm:text-base">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className='flex flex-col space-y-4'>
        <div className='flex flex-col gap-4'>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className='w-full'>
            <TabsList className="w-full grid grid-cols-2 sm:flex sm:flex-wrap bg-transparent p-0 gap-2">
              <TabsTrigger value='beautify' className="sm:flex-1 min-w-[100px]">
                <Code2 className="w-4 h-4 mr-2" />
                Beautify
              </TabsTrigger>
              <TabsTrigger value='minify' className="sm:flex-1 min-w-[100px]">
                <Minimize2 className="w-4 h-4 mr-2" />
                Minify
              </TabsTrigger>
              <TabsTrigger value='filter' className="sm:flex-1 min-w-[100px]">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </TabsTrigger>
              <TabsTrigger value='analyze' className="sm:flex-1 min-w-[100px]">
                <Search className="w-4 h-4 mr-2" />
                Analyze
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className='grid grid-cols-2 gap-2 w-full sm:grid-cols-4'>
            <Button
              onClick={handleReset}
              variant='secondary'
              size="sm"
              className='w-full sm:text-base'>
              <Trash2 className='w-4 h-4 mr-2' />
              Reset
            </Button>
            <Button
              onClick={handleFormat}
              size="sm"
              className='w-full sm:text-base'>
              <Braces className='w-4 h-4 mr-2' />
              Format
            </Button>
            <Button
              onClick={handleDownload}
              variant="secondary"
              size="sm"
              className="w-full sm:text-base"
              disabled={!output}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleCopy}
              variant="secondary"
              size="sm"
              className="w-full sm:text-base"
              disabled={!output}>
              <Copy className="w-4 h-4 mr-2" />
              {copyStatus === "copied" ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setInput(JSON.stringify(sampleJson, null, 2))}
                className="w-full sm:text-base"
              >
                <FileJson className="w-4 h-4 mr-2" />
                Load Sample
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="json-upload"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById('json-upload')?.click()}
                  className="w-full sm:text-base"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="relative h-[500px] rounded-md border overflow-hidden">
              {isLoading && <LoadingOverlay />}
              <Suspense fallback={<LoadingOverlay />}>
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  value={input}
                  onChange={handleEditorChange}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    wrappingIndent: "same",
                    formatOnPaste: true,
                    formatOnType: true,
                    automaticLayout: true,
                    tabSize: 2,
                    renderWhitespace: "selection",
                    maxTokenizationLineLength: 20000,
                    largeFileOptimizations: true,
                    renderValidationDecorations: "on",
                    folding: true,
                    foldingStrategy: "indentation",
                    scrollbar: {
                      vertical: 'visible',
                      horizontal: 'visible'
                    }
                  }}
                  onValidate={(markers) => {
                    if (markers.length > 0) {
                      setError(markers[0].message);
                    } else {
                      setError(null);
                    }
                  }}
                />
              </Suspense>
            </div>
          </div>

          <div className="h-[500px] rounded-md border overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={output}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                wrappingIndent: "same",
                automaticLayout: true,
                tabSize: 2,
                renderWhitespace: "selection",
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible'
                }
              }}
            />
          </div>
        </div>

        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden w-full"
            >
              <div className="p-4 bg-card rounded-lg border">
                {activePanel === "filter" && <FilterView onFilter={handleFilter} />}
                {activePanel === "analyze" && analysis && <AnalysisView analysis={analysis} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};