"use client"

import { useState, useCallback } from "react"
import { KeyRound, AlertCircle, Info } from 'lucide-react'
import { GeneratorView } from "@/components/uuid/generator-view"
import { toast } from "@/hooks/use-toast"
import { UUIDUtils } from "@/lib/uuidUtils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function UUIDPage() {
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = useCallback(({ count }: { count: number }) => {
    try {
      UUIDUtils.generateMultiple(count)
      toast({
        title: `Generated ${count} UUID${count > 1 ? 's' : ''} successfully`,
        variant: "default"
      })
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed")
      toast({
        title: "Error generating UUIDs",
        description: err instanceof Error ? err.message : "Generation failed",
        variant: "destructive"
      })
    }
  }, [])

  return (
    <div className="container py-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <KeyRound className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">UUID Generator</h1>
            <p className="text-muted-foreground">
              Generate v4 UUIDs with ease
            </p>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary">
              <Info className="w-4 h-4 mr-2" />
              About UUIDs
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About UUIDs</DialogTitle>
              <DialogDescription>
                UUID stands for Universally Unique Identifier. It s a 128-bit number used to identify information in computer systems. UUIDs are standardized by the Open Software Foundation (OSF) as part of the Distributed Computing Environment (DCE).
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Key features of UUIDs:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Uniqueness: The probability of duplicate UUIDs is extremely low</li>
                <li>No central authority is required to administer them</li>
                <li>They can be generated at a very high rate: 10 million per second per machine</li>
                <li>They are useful for creating unique identifiers in distributed systems</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/15 text-destructive rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <GeneratorView onGenerate={handleGenerate} />
    </div>
  )
}
