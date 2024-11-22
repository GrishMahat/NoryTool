"use client";

import { useState, useCallback } from "react";
import { KeyRound, AlertCircle } from "lucide-react";
import { GeneratorView } from "@/components/uuid/generator-view";
import { toast } from "@/hooks/use-toast";
import { UUIDUtils } from "@/lib/uuidUtils";

export default function UUIDPage() {
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(({ count }: { count: number }) => {
    try {
      UUIDUtils.generateMultiple(count);
      toast({
        title: `Generated ${count} UUID${count > 1 ? 's' : ''} successfully`,
        variant: "default"
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      toast({
        title: "Error generating UUIDs",
        description: err instanceof Error ? err.message : "Generation failed",
        variant: "destructive"
      });
    }
  }, []);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-3">
        <KeyRound className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">UUID Generator</h1>
          <p className="text-muted-foreground">
            Generate v4 UUIDs with ease
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/15 text-destructive rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <p>{error}</p>
        </div>
      )}

      <GeneratorView onGenerate={handleGenerate} />
    </div>
  );
}
