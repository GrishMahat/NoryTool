/** @format */

"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RefreshCwIcon,
  CopyIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  RotateCcwIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Formatter() {
  const [base64Input, setBase64Input] = useState("");
  const [formattedOutput, setFormattedOutput] = useState("");
  const [lineBreaks, setLineBreaks] = useState(false);
  const [lineLength, setLineLength] = useState(64);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [formatApplied, setFormatApplied] = useState(false);

  useEffect(() => {
    if (formatApplied) {
      const timer = setTimeout(() => setFormatApplied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [formatApplied]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const formatBase64 = () => {
    try {
      let formatted = base64Input.replace(/\s/g, ""); // Remove all whitespace
      if (lineBreaks) {
        formatted =
          formatted.match(new RegExp(`.{1,${lineLength}}`, "g"))?.join("\n") ||
          formatted;
      }
      setFormattedOutput(formatted);
      setError("");
      setFormatApplied(true);
    } catch  {
      setError("Error formatting Base64 string");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
  };

  const resetForm = () => {
    setBase64Input("");
    setFormattedOutput("");
    setLineBreaks(false);
    setLineLength(64);
    setError("");
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-center'>
          Base64 Formatter
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex items-center space-x-2'>
            <Switch
              id='line-breaks'
              checked={lineBreaks}
              onCheckedChange={setLineBreaks}
            />
            <Label htmlFor='line-breaks'>Add line breaks</Label>
          </div>
          <AnimatePresence>
            {lineBreaks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className='w-full sm:w-auto'>
                <div className='flex items-center space-x-4'>
                  <Label htmlFor='line-length'>
                    Characters per line: {lineLength}
                  </Label>
                  <Slider
                    id='line-length'
                    min={16}
                    max={128}
                    step={4}
                    value={[lineLength]}
                    onValueChange={(value) => setLineLength(value[0])}
                    className='w-[200px]'
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className='space-y-4'>
          <Label htmlFor='base64-input'>Base64 Input</Label>
          <Textarea
            id='base64-input'
            placeholder='Enter Base64 string to format...'
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            className='min-h-[100px] font-mono text-sm'
          />
        </div>

        <div className='space-y-4'>
          <Label htmlFor='formatted-output'>Formatted Output</Label>
          <Textarea
            id='formatted-output'
            value={formattedOutput}
            readOnly
            className='min-h-[100px] font-mono text-sm bg-muted'
          />
        </div>

        <div className='flex gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={formatBase64} className='flex-1'>
                  <RefreshCwIcon className='w-4 h-4 mr-2' />
                  Format
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {formatApplied ? "Formatting applied!" : "Apply formatting"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='secondary' onClick={copyToClipboard}>
                  {copied ? (
                    <CheckCircleIcon className='w-4 h-4' />
                  ) : (
                    <CopyIcon className='w-4 h-4' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={resetForm}>
                  <RotateCcwIcon className='w-4 h-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset form</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}>
              <Alert variant='destructive'>
                <AlertCircleIcon className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
