/** @format */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { UUIDUtils } from "@/lib/uuidUtils";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils";

interface GeneratorViewProps {
  onGenerate: (options: { count: number }) => void;
}

export function GeneratorView({ onGenerate }: GeneratorViewProps) {
  const [options, setOptions] = useState({
    count: 1,
    uppercase: false,
    noDashes: false,
    prefix: "",
  });

  const [uuids, setUuids] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<Record<number, boolean>>({});

  const handleGenerate = () => {
    const generated = UUIDUtils.generateMultiple(options.count, options);
    setUuids(generated);
    onGenerate({ count: options.count });
  };

  const handleCopy = async (uuid: string, index: number) => {
    const success = await copyToClipboard(uuid);
    if (success) {
      setCopyStatus({ ...copyStatus, [index]: true });
      toast({
        title: "UUID copied to clipboard",
        variant: "default",
      });
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [index]: false }));
      }, 2000);
    }
  };

  const handleCopyAll = async () => {
    const success = await copyToClipboard(uuids.join("\n"));
    if (success) {
      toast({
        title: "All UUIDs copied to clipboard",
        variant: "default",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate UUIDs</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Number of UUIDs ({options.count})</Label>
            <Slider
              value={[options.count]}
              onValueChange={([value]) =>
                setOptions({ ...options, count: value })
              }
              min={1}
              max={100}
              step={1}
              className='w-full'
            />
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Switch
                checked={options.uppercase}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, uppercase: checked })
                }
              />
              <Label>Uppercase</Label>
            </div>

            <div className='flex items-center space-x-2'>
              <Switch
                checked={options.noDashes}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, noDashes: checked })
                }
              />
              <Label>Remove Dashes</Label>
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Prefix (optional)</Label>
            <Input
              placeholder='e.g., user_, id:'
              value={options.prefix}
              onChange={(e) =>
                setOptions({ ...options, prefix: e.target.value })
              }
            />
          </div>

          <Button className='w-full' onClick={handleGenerate}>
            <RefreshCw className='w-4 h-4 mr-2' />
            Generate UUID{options.count > 1 ? "s" : ""}
          </Button>
        </div>

        {uuids.length > 0 && (
          <div className='space-y-4'>
            {uuids.length > 1 && (
              <Button
                variant='primary'
                className='w-full'
                onClick={handleCopyAll}>
                <Copy className='w-4 h-4 mr-2' />
                Copy All UUIDs
              </Button>
            )}

            <div className='space-y-2'>
              {uuids.map((uuid, index) => (
                <div key={index} className='flex items-center space-x-2'>
                  <Input value={uuid} readOnly className='font-mono' />
                  <Button
                    variant='primary'
                    size='md'
                    onClick={() => handleCopy(uuid, index)}>
                    {copyStatus[index] ? (
                      <span className='text-green-500'>✓</span>
                    ) : (
                      <Copy className='w-4 h-4' />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
