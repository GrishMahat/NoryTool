/** @format */

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  CopyIcon,
  RefreshCwIcon,
} from "lucide-react";
import { base64Utils } from "@/lib/base64";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

export function Validator() {
  const [input, setInput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [size, setSize] = useState<{ encoded: number; decoded: number } | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  const validationResult = useMemo(() => {
    if (!input.trim()) return null;
    const valid = base64Utils.validate(input);
    return {
      isValid: valid,
      size: valid ? base64Utils.calculateSize(input) : null,
    };
  }, [input]);

  useEffect(() => {
    setIsValid(validationResult?.isValid ?? null);
    setSize(validationResult?.size ?? null);
  }, [validationResult]);

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
  };

  const encodingEfficiency = useMemo(() => {
    if (!size) return null;
    return ((size.decoded / size.encoded) * 100).toFixed(2);
  }, [size]);

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold text-center'>
          Base64 Validator
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='base64-input' className='text-sm font-medium'>
            Base64 String to Validate
          </Label>
          <div className='relative'>
            <Textarea
              id='base64-input'
              placeholder='Enter Base64 string to validate...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='min-h-[200px] font-mono text-sm pr-20'
            />
            <div className='absolute bottom-2 right-2 flex space-x-2'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='primary'
                      size='lg'
                      onClick={handleCopy}
                      className='h-8 w-8'>
                      {copied ? (
                        <RefreshCwIcon className='h-4 w-4 animate-spin' />
                      ) : (
                        <CopyIcon className='h-4 w-4' />
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
                    <Button
                      variant='primary'
                      size='md'
                      onClick={handleClear}
                      className='h-8 w-8'>
                      <RefreshCwIcon className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear input</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isValid !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}>
              <Alert variant={isValid ? "default" : "destructive"}>
                {isValid ? (
                  <CheckCircleIcon className='h-4 w-4' />
                ) : (
                  <AlertCircleIcon className='h-4 w-4' />
                )}
                <AlertDescription>
                  {isValid ? "Valid Base64 string" : "Invalid Base64 string"}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {size && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='text-sm text-muted-foreground'>
                    Encoded Size
                  </Label>
                  <p className='text-lg font-mono'>{size.encoded} bytes</p>
                </div>
                <div className='space-y-2'>
                  <Label className='text-sm text-muted-foreground'>
                    Decoded Size
                  </Label>
                  <p className='text-lg font-mono'>{size.decoded} bytes</p>
                </div>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm text-muted-foreground'>
                  Encoding Efficiency
                </Label>
                <div className='flex items-center space-x-2'>
                  <Progress
                    value={parseFloat(encodingEfficiency!)}
                    className='flex-grow'
                  />
                  <span className='text-sm font-mono'>
                    {encodingEfficiency}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
