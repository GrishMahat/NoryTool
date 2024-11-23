"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CopyIcon, ArrowRightIcon, AlertCircleIcon, RefreshCwIcon, XIcon } from 'lucide-react';
import { base64Utils } from "@/lib/base64";
import { motion, AnimatePresence } from "framer-motion";

export function TextConverter() {
  const [textInput, setTextInput] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);
  const [padding, setPadding] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleEncode = () => {
    try {
      setBase64Input(base64Utils.encode(textInput, urlSafe, padding));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleDecode = () => {
    try {
      setTextInput(base64Utils.decode(base64Input, urlSafe));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const copyToClipboard = (text: string, type: "text" | "base64") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
  };

  const clearInput = (type: "text" | "base64") => {
    if (type === "text") {
      setTextInput("");
    } else {
      setBase64Input("");
    }
  };

  return (
    <Card className="p-6 bg-background shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputSection
          label="Text Input"
          value={textInput}
          onChange={setTextInput}
          onEncode={handleEncode}
          onCopy={() => copyToClipboard(textInput, "text")}
          onClear={() => clearInput("text")}
          copied={copied === "text"}
          charCount={textInput.length}
        />
        <InputSection
          label="Base64 Output"
          value={base64Input}
          onChange={setBase64Input}
          onDecode={handleDecode}
          onCopy={() => copyToClipboard(base64Input, "base64")}
          onClear={() => clearInput("base64")}
          copied={copied === "base64"}
          charCount={base64Input.length}
          isBase64
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 mt-6">
        <ToggleSwitch
          checked={urlSafe}
          onCheckedChange={setUrlSafe}
          label="URL-safe Base64"
        />
        <ToggleSwitch
          checked={padding}
          onCheckedChange={setPadding}
          label="Include padding (=)"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="mt-4">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

interface InputSectionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onEncode?: () => void;
  onDecode?: () => void;
  onCopy: () => void;
  onClear: () => void;
  copied: boolean;
  charCount: number;
  isBase64?: boolean;
}

function InputSection({
  label,
  value,
  onChange,
  onEncode,
  onDecode,
  onCopy,
  onClear,
  copied,
  charCount,
  isBase64,
}: InputSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold">{label}</Label>
        <span className="text-muted-foreground text-sm">{charCount} characters</span>
      </div>
      <Textarea
        placeholder={isBase64 ? "Base64 encoded text..." : "Enter text to encode..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] resize-none font-mono text-sm bg-background border-input focus:ring-2 focus:ring-ring transition-all duration-300"
      />
      <div className="flex gap-2">
        <Button
          onClick={isBase64 ? onDecode : onEncode}
          className="flex-1"
          variant="secondary"
        >
          <ArrowRightIcon className={`w-4 h-4 mr-2 ${isBase64 ? "rotate-180" : ""}`} />
          {isBase64 ? "Decode" : "Encode"}
        </Button>
        <Button
          variant="secondary"
          onClick={onCopy}
        >
          {copied ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : <CopyIcon className="w-4 h-4" />}
        </Button>
        <Button
          variant="secondary"
          onClick={onClear}
        >
          <XIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

function ToggleSwitch({ checked, onCheckedChange, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label className="text-sm font-medium">{label}</Label>
    </div>
  );
}
