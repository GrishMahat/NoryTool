"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { UUIDUtils } from "@/lib/uuidUtils"
import { Copy, RefreshCw, Trash2, Download } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { copyToClipboard } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GeneratorViewProps {
  onGenerate: (options: { count: number }) => void
}

export function GeneratorView({ onGenerate }: GeneratorViewProps) {
  const [options, setOptions] = useState({
    count: 1,
    uppercase: false,
    noDashes: false,
    prefix: "",
  })

  const [uuids, setUuids] = useState<string[]>([])
  const [copyStatus, setCopyStatus] = useState<Record<number, boolean>>({})

  const handleGenerate = () => {
    const generated = UUIDUtils.generateMultiple(options.count, options)
    setUuids(generated)
    onGenerate({ count: options.count })
  }

  const handleCopy = async (uuid: string, index: number) => {
    const success = await copyToClipboard(uuid)
    if (success) {
      setCopyStatus({ ...copyStatus, [index]: true })
      toast({
        title: "UUID copied to clipboard",
        variant: "default",
      })
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [index]: false }))
      }, 2000)
    }
  }

  const handleCopyAll = async () => {
    const success = await copyToClipboard(uuids.join("\n"))
    if (success) {
      toast({
        title: "All UUIDs copied to clipboard",
        variant: "default",
      })
    }
  }

  const handleDownload = () => {
    const blob = new Blob([uuids.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "uuids.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "UUIDs downloaded successfully",
      variant: "default",
    })
  }

  const handleClear = () => {
    setUuids([])
    setCopyStatus({})
    toast({
      title: "Generated UUIDs cleared",
      variant: "default",
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate UUIDs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Number of UUIDs ({options.count})</Label>
                <Slider
                  value={[options.count]}
                  onValueChange={([value]) =>
                    setOptions({ ...options, count: value })
                  }
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="uppercase"
                    checked={options.uppercase}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, uppercase: checked })
                    }
                  />
                  <Label htmlFor="uppercase">Uppercase</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="noDashes"
                    checked={options.noDashes}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, noDashes: checked })
                    }
                  />
                  <Label htmlFor="noDashes">Remove Dashes</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prefix">Prefix (optional)</Label>
                <Input
                  id="prefix"
                  placeholder="e.g., user_, id:"
                  value={options.prefix}
                  onChange={(e) =>
                    setOptions({ ...options, prefix: e.target.value })
                  }
                />
              </div>

              <Button className="w-full" onClick={handleGenerate}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate UUID{options.count > 1 ? "s" : ""}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="results" className="space-y-4">
            {uuids.length > 0 ? (
              <>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={handleCopyAll}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy All
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy all UUIDs to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={handleDownload}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download UUIDs as a text file</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={handleClear}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear all generated UUIDs</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="space-y-2">
                    {uuids.map((uuid, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input value={uuid} readOnly className="font-mono" />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleCopy(uuid, index)}
                              >
                                {copyStatus[index] ? (
                                  <span className="text-green-500">✓</span>
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy to clipboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                No UUIDs generated yet. Switch to the Generate tab to create some!
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
