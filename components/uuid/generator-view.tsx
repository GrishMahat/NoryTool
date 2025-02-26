"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { UUIDUtils } from "@/lib/uuidUtils"
import {
  Copy,
  RefreshCw,
  Trash2,
  Download,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneratorViewProps {
  onGenerate: (options: { count: number }) => void
}

type UUIDFormat = "standard" | "base64" | "short" | "url";

export function GeneratorView({ onGenerate }: GeneratorViewProps) {
  const [options, setOptions] = useState({
    count: 1,
    uppercase: false,
    noDashes: false,
    prefix: "",
    suffix: "",
    format: "standard" as UUIDFormat,
  });

  const [uuids, setUuids] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<Record<number, boolean>>({});
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<
    Record<number, boolean>
  >({});

  const handleGenerate = async () => {
    setGenerating(true);
    setProgress(0);
    try {
      const generated = UUIDUtils.generateMultiple(
        options.count,
        options,
        (progress) => {
          setProgress(progress);
        }
      );
      setUuids(generated);
      onGenerate({ count: options.count });

      // Validate all generated UUIDs
      const validations = generated.reduce((acc, uuid, index) => {
        acc[index] = UUIDUtils.validate(uuid).isValid;
        return acc;
      }, {} as Record<number, boolean>);
      setValidationResults(validations);

      toast({
        title: "UUIDs Generated Successfully",
        description: `Generated ${options.count} UUID${
          options.count > 1 ? "s" : ""
        } in ${options.format} format`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error ? error.message : "Failed to generate UUIDs",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
      setProgress(100);
    }
  };

  const handleCopy = async (uuid: string, index: number) => {
    try {
      await copyToClipboard(uuid);
      setCopyStatus({ ...copyStatus, [index]: true });
      toast({
        title: "UUID Copied",
        description: "UUID has been copied to clipboard",
        variant: "default",
      });
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [index]: false }));
      }, 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy UUID to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleCopyAll = async () => {
    try {
      await copyToClipboard(uuids.join("\n"));
      toast({
        title: "All UUIDs Copied",
        description: `${uuids.length} UUIDs copied to clipboard`,
        variant: "default",
      });
    } catch {
      toast({
        title: "Copy Failed",
        description: "Failed to copy UUIDs to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([uuids.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `uuids_${new Date().toISOString()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Download Started",
        description: `${uuids.length} UUIDs downloaded as text file`,
        variant: "default",
      });
    } catch {
      toast({
        title: "Download Failed",
        description: "Failed to download UUIDs",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setUuids([]);
    setCopyStatus({});
    setValidationResults({});
    toast({
      title: "Cleared",
      description: "Generated UUIDs have been cleared",
      variant: "default",
    });
  };

  const getUUIDInfo = (uuid: string) => {
    const info = UUIDUtils.getInfo(uuid);
    if (!info) return null;
    return (
      <div className='text-xs text-muted-foreground'>
        <p>Version: {info.version}</p>
        <p>Variant: {info.variant}</p>
        <p>Generated: {new Date(info.timestamp || "").toLocaleString()}</p>
      </div>
    );
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Generate UUIDs</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Tabs defaultValue='generate' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='generate'>Generate</TabsTrigger>
            <TabsTrigger value='results'>Results</TabsTrigger>
          </TabsList>
          <TabsContent value='generate' className='space-y-4'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Number of UUIDs ({options.count})</Label>
                <Slider
                  value={[options.count]}
                  onValueChange={([value]) =>
                    setOptions({ ...options, count: value })
                  }
                  min={1}
                  max={1000}
                  step={1}
                  className='w-full'
                />
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label>Format</Label>
                  <Select
                    value={options.format}
                    onValueChange={(
                      value: "standard" | "base64" | "short" | "url"
                    ) => setOptions({ ...options, format: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select format' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='standard'>Standard</SelectItem>
                      <SelectItem value='base64'>Base64</SelectItem>
                      <SelectItem value='short'>Short</SelectItem>
                      <SelectItem value='url'>URL Safe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label>Options</Label>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label htmlFor='uppercase'>Uppercase</Label>
                      <Switch
                        id='uppercase'
                        checked={options.uppercase}
                        onCheckedChange={(checked) =>
                          setOptions({ ...options, uppercase: checked })
                        }
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <Label htmlFor='noDashes'>Remove Dashes</Label>
                      <Switch
                        id='noDashes'
                        checked={options.noDashes}
                        onCheckedChange={(checked) =>
                          setOptions({ ...options, noDashes: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='prefix'>Prefix</Label>
                  <Input
                    id='prefix'
                    placeholder='e.g., user_, id:'
                    value={options.prefix}
                    onChange={(e) =>
                      setOptions({ ...options, prefix: e.target.value })
                    }
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='suffix'>Suffix</Label>
                  <Input
                    id='suffix'
                    placeholder='e.g., _test'
                    value={options.suffix}
                    onChange={(e) =>
                      setOptions({ ...options, suffix: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                className='w-full'
                onClick={handleGenerate}
                disabled={generating}>
                {generating ? (
                  <>
                    <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className='w-4 h-4 mr-2' />
                    Generate UUID{options.count > 1 ? "s" : ""}
                  </>
                )}
              </Button>

              {generating && <Progress value={progress} className='w-full' />}
            </div>
          </TabsContent>
          <TabsContent value='results' className='space-y-4'>
            {uuids.length > 0 ? (
              <>
                <div className='flex space-x-2'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='secondary'
                          className='w-full'
                          onClick={handleCopyAll}>
                          <Copy className='w-4 h-4 mr-2' />
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
                          variant='secondary'
                          className='w-full'
                          onClick={handleDownload}>
                          <Download className='w-4 h-4 mr-2' />
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
                          variant='secondary'
                          className='w-full'
                          onClick={handleClear}>
                          <Trash2 className='w-4 h-4 mr-2' />
                          Clear
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear all generated UUIDs</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <ScrollArea className='h-[300px] w-full rounded-md border p-4'>
                  <div className='space-y-2'>
                    {uuids.map((uuid, index) => (
                      <div key={index} className='space-y-1'>
                        <div className='flex items-center space-x-2'>
                          <Input value={uuid} readOnly className='font-mono' />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant='secondary'
                                  size='sm'
                                  onClick={() => handleCopy(uuid, index)}>
                                  {copyStatus[index] ? (
                                    <Check className='w-4 h-4 text-green-500' />
                                  ) : (
                                    <Copy className='w-4 h-4' />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy to clipboard</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  {validationResults[index] ? (
                                    <Badge
                                      variant='default'
                                      className='bg-green-500/10 text-green-500'>
                                      <Check className='w-3 h-3 mr-1' />
                                      Valid
                                    </Badge>
                                  ) : (
                                    <Badge variant='destructive'>
                                      <AlertCircle className='w-3 h-3 mr-1' />
                                      Invalid
                                    </Badge>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {getUUIDInfo(uuid)}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className='text-center text-muted-foreground'>
                No UUIDs generated yet. Switch to the Generate tab to create
                some!
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
