/** @format */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils";
import {
  FileCode,
  Maximize2,
  Minimize2,
  Filter,
  Trash2,
  Search,
  Copy,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JSONUtils, JSONAnalysis, FilterOptions } from "@/lib/jsonUtils";
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/show-invisibles/prism-show-invisibles';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import { AnalysisView } from '@/components/json/analysis-view';
import { FilterView } from '@/components/json/filter-view';
import { motion, AnimatePresence } from "framer-motion";

export default function JSONToolPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const [activeTab, setActiveTab] = useState<
    "beautify" | "minify" | "filter" | "analyze"
  >("beautify");
  const [analysis, setAnalysis] = useState<JSONAnalysis | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);

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

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, activeTab === "beautify" ? 2 : 0);
      const highlighted = Prism.highlight(formatted, Prism.languages.json, 'json');
      setOutput(formatted);
      
      const outputElement = document.querySelector('pre.language-json code');
      if (outputElement) {
        outputElement.innerHTML = highlighted;
      }

      setError(null);
      toast({
        title: "JSON formatted successfully",
        variant: "default"
      });
    } catch (err) {
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

  useEffect(() => {
    if (!input) return;
    
    if (activeTab === "beautify" || activeTab === "minify") {
      handleFormat();
    } else if (activeTab === "filter") {
      handleFilter({ path: "" });
    } else if (activeTab === "analyze") {
      handleAnalyze();
    }
  }, [input, activeTab, handleFormat, handleFilter, handleAnalyze]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Prism.highlightAll();
    }, 0);
    return () => clearTimeout(timer);
  }, [output]);

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError(null);
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
      if (value === "analyze") {
        handleAnalyze();
      }
    }
    setActiveTab(value as "beautify" | "minify" | "filter" | "analyze");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInput(text);
        toast({
          title: "File uploaded successfully",
          variant: "default"
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className='container py-8 space-y-6'>
      <div className='flex items-center gap-3'>
        <FileCode className='w-8 h-8 text-primary' />
        <div>
          <h1 className='text-2xl font-bold'>JSON Formatter</h1>
          <p className='text-muted-foreground'>
            Beautify, minify, and analyze JSON with syntax highlighting
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/15 text-destructive rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <p>{error}</p>
        </div>
      )}

      <div className='flex flex-col space-y-4'>
        <div className='flex flex-col sm:flex-row gap-4 justify-between items-start'>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className='w-full sm:w-auto'>
            <TabsList className='grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto'>
              <TabsTrigger value='beautify'>Beautify</TabsTrigger>
              <TabsTrigger value='minify'>Minify</TabsTrigger>
              <TabsTrigger value='filter'>Filter</TabsTrigger>
              <TabsTrigger value='analyze'>Analyze</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className='flex gap-4 w-full sm:w-auto'>
            <Button 
              onClick={handleReset} 
              variant='secondary'
              className='flex-1 sm:flex-none'>
              <Trash2 className='w-4 h-4 mr-2' />
              Reset
            </Button>
            <Button 
              onClick={handleFormat}
              className='flex-1 sm:flex-none'>
              {activeTab === "beautify" ? (
                <Maximize2 className='w-4 h-4 mr-2' />
              ) : activeTab === "minify" ? (
                <Minimize2 className='w-4 h-4 mr-2' />
              ) : activeTab === "filter" ? (
                <Filter className='w-4 h-4 mr-2' />
              ) : (
                <Search className='w-4 h-4 mr-2' />
              )}
              {activeTab === "beautify"
                ? "Beautify"
                : activeTab === "minify"
                ? "Minify"
                : activeTab === "filter"
                ? "Filter"
                : "Analyze"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button 
                variant="secondary"
                onClick={() => setInput(JSON.stringify(sampleJson, null, 2))}
              >
                Load Sample JSON
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
                  onClick={() => document.getElementById('json-upload')?.click()}
                >
                  Upload JSON
                </Button>
              </div>
            </div>
            <Textarea
              placeholder={`Paste your JSON here...\n\nExample:\n{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com"\n}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>
          <div className="space-y-4">
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="w-full"
              disabled={!output}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copyStatus === "copied" ? "Copied!" : copyStatus === "failed" ? "Failed to copy" : "Copy to Clipboard"}
            </Button>
            <div 
              className="min-h-[300px] p-4 bg-card rounded-lg border font-mono overflow-auto"
            >
              <pre className="language-json">
                <code>{output}</code>
              </pre>
            </div>
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
}
