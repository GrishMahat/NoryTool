/** @format */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils";
import {
  FileCode,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Search,
  Filter,
  Trash2,
  EyeOff,
  Eye,
  Download,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JSONUtils } from "@/lib/jsonUtils";

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
  const [filterPath, setFilterPath] = useState("");
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const handleFormat = useCallback(() => {
    try {
      const formatted = JSONUtils.format(
        input,
        activeTab === "beautify" ? 2 : 0
      );
      setOutput(formatted);
      setError(null);
    } catch {
      setError("Invalid JSON format");
      setOutput("");
    }
  }, [input, activeTab]);

  const handleFilter = useCallback(() => {
    try {
      const filtered = JSONUtils.filterByPath(input, filterPath);
      setOutput(filtered);
      setError(null);
    } catch {
      setError("Invalid JSON or filter path");
      setOutput("");
    }
  }, [input, filterPath]);

  const handleAnalyze = useCallback(() => {
    try {
      const analysis = JSONUtils.analyze(input);
      setOutput(JSON.stringify(analysis, null, 2));
      setError(null);
    } catch {
      setError("Invalid JSON format");
      setOutput("");
    }
  }, [input]);

  useEffect(() => {
    if (!input) return;
    
    if (activeTab === "beautify" || activeTab === "minify") {
      handleFormat();
    } else if (activeTab === "filter") {
      handleFilter();
    } else if (activeTab === "analyze") {
      handleAnalyze();
    }
  }, [input, activeTab, filterPath, handleFormat, handleFilter, handleAnalyze]);

  const handleCopy = async () => {
    if (!output) return;

    const success = await copyToClipboard(output);

    if (success) {
      setCopyStatus("copied");
      toast({
        title: "Copied to clipboard",
        description: "The formatted JSON has been copied to your clipboard.",
      });
    } else {
      setCopyStatus("failed");
      toast({
        title: "Failed to copy",
        description: "There was an error copying to the clipboard.",
        variant: "destructive",
      });
    }

    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError(null);
    setFilterPath("");
  };

  const handleDownload = () => {
    if (!output) return;

    try {
      JSONUtils.downloadJSON(output);
      toast({
        title: "JSON Downloaded",
        description: "The formatted JSON has been downloaded.",
      });
    } catch {
      toast({
        title: "Download Failed",
        description: "Failed to download the JSON file.",
        variant: "destructive",
      });
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

      <div className='grid md:grid-cols-2 gap-6'>
        <Card className='dark:bg-background'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Input JSON</CardTitle>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              title={
                showLineNumbers ? "Hide line numbers" : "Show line numbers"
              }>
              {showLineNumbers ? (
                <EyeOff className='w-4 h-4' />
              ) : (
                <Eye className='w-4 h-4' />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className='relative'>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Paste your JSON here...'
                className='w-full h-[400px] font-mono text-sm resize-none dark:bg-background/50 dark:text-foreground'
                style={{
                  lineHeight: "1.5",
                  tabSize: 2,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className='dark:bg-background'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle>Output</CardTitle>
            <div className='flex gap-2'>
              {output && !error && (
                <>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={handleCopy}
                    title={
                      copyStatus === "copied" ? "Copied!" : "Copy to clipboard"
                    }>
                    {copyStatus === "copied" ? (
                      <Check className='w-4 h-4 text-green-500' />
                    ) : (
                      <Copy className='w-4 h-4' />
                    )}
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={handleDownload}
                    title='Download JSON'>
                    <Download className='w-4 h-4' />
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className='relative'>
              <Textarea
                value={error ? error : output}
                readOnly
                className={`w-full h-[400px] font-mono text-sm resize-none dark:bg-background/50 dark:text-foreground ${
                  error ? "text-destructive" : ""
                }`}
                style={{
                  lineHeight: "1.5",
                  tabSize: 2,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 justify-between items-start'>
        <div className='w-full sm:w-auto'>
          <Tabs
            value={activeTab}
            onValueChange={(value: string) => {
              if (value === "beautify" || value === "minify" || value === "filter" || value === "analyze") {
                setActiveTab(value);
              }
            }}
            className='w-full sm:w-auto'>
            <TabsList className='grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto'>
              <TabsTrigger value='beautify'>Beautify</TabsTrigger>
              <TabsTrigger value='minify'>Minify</TabsTrigger>
              <TabsTrigger value='filter'>Filter</TabsTrigger>
              <TabsTrigger value='analyze'>Analyze</TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "filter" && (
            <div className='mt-4'>
              <Label htmlFor='filterPath'>
                Filter Path (e.g., &quot;data.users.0&quot;)
              </Label>
              <Input
                id='filterPath'
                value={filterPath}
                onChange={(e) => setFilterPath(e.target.value)}
                placeholder='Enter path to filter'
                className='mt-1'
              />
            </div>
          )}
        </div>

        <div className='flex gap-4'>
          <Button onClick={handleReset} variant='secondary'>
            <Trash2 className='w-4 h-4 mr-2' />
            Reset
          </Button>
          <Button onClick={handleFormat}>
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
    </div>
  );
}
