/** @format */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FilterOptions } from "@/lib/jsonUtils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Filter as FilterIcon,
  Search,
  Plus,
  X,
  ArrowDownUp,
  Settings,
  Eye,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterViewProps {
  onFilter: (options: FilterOptions) => void;
}

export function FilterView({ onFilter }: FilterViewProps) {
  const [options, setOptions] = useState<FilterOptions>({
    path: "",
    query: "",
    caseSensitive: false,
    includeParents: true,
    maxDepth: undefined,
    conditions: [],
  });

  const [condition, setCondition] = useState({
    key: "",
    value: "",
    type: "string" as const,
    operator: "equals" as const,
  });

  const addCondition = () => {
    if (!condition.key || !condition.value) return;

    setOptions((prev) => ({
      ...prev,
      conditions: [...(prev.conditions || []), condition],
    }));
    setCondition({
      key: "",
      value: "",
      type: "string",
      operator: "equals",
    });
  };

  const removeCondition = (index: number) => {
    setOptions((prev) => ({
      ...prev,
      conditions: prev.conditions?.filter((_, i) => i !== index),
    }));
  };

  return (
    <Card className='border-none shadow-none'>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-2'>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <FilterIcon className='w-5 h-5 text-primary' />
          </div>
          <CardTitle>Filter JSON</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Basic Filters */}
        <div className='grid gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label className='flex items-center gap-2'>
                <ArrowDownUp className='w-4 h-4' />
                Path
              </Label>
              <Input
                placeholder='e.g., data.users[0].name'
                value={options.path}
                onChange={(e) =>
                  setOptions({ ...options, path: e.target.value })
                }
                className='bg-muted/50'
              />
            </div>

            <div className='space-y-2'>
              <Label className='flex items-center gap-2'>
                <Search className='w-4 h-4' />
                Search Query
              </Label>
              <Input
                placeholder='Search value...'
                value={options.query}
                onChange={(e) =>
                  setOptions({ ...options, query: e.target.value })
                }
                className='bg-muted/50'
              />
            </div>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label className='flex items-center gap-2'>
                <Settings className='w-4 h-4' />
                Options
              </Label>
              <Card className='bg-muted/30 pt-4'>
                <CardContent className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='cursor-pointer'>Case Sensitive</Label>
                    <Switch
                      checked={options.caseSensitive}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, caseSensitive: checked })
                      }
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <Label className='cursor-pointer'>
                      Include Parent Objects
                    </Label>
                    <Switch
                      checked={options.includeParents}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, includeParents: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    <Label className='text-sm'>Max Depth</Label>
                    <Input
                      type='number'
                      placeholder='No limit'
                      value={options.maxDepth || ""}
                      onChange={(e) =>
                        setOptions({
                          ...options,
                          maxDepth: parseInt(e.target.value) || undefined,
                        })
                      }
                      className='bg-muted/50'
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div className='space-y-4'>
          <Label className='flex items-center gap-2'>
            <Eye className='w-4 h-4' />
            Conditions
          </Label>

          <ScrollArea className='h-[200px] w-full rounded-lg border bg-muted/30 p-4'>
            <div className='space-y-2'>
              <AnimatePresence>
                {options.conditions?.map((cond, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='flex items-center justify-between p-2 rounded-md bg-background/50'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className='bg-muted/50'>
                        {cond.key}
                      </Badge>
                      <span className='text-sm text-muted-foreground'>
                        {cond.operator}
                      </span>
                      <Badge variant='secondary'>{cond.value}</Badge>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => removeCondition(index)}
                      className='h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive'>
                      <X className='h-4 w-4' />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <Card className='bg-muted/30'>
            <CardContent className='pt-4'>
              <div className='grid grid-cols-2 gap-2'>
                <Input
                  placeholder='Key'
                  value={condition.key}
                  onChange={(e) =>
                    setCondition({ ...condition, key: e.target.value })
                  }
                  className='bg-background/50'
                />
                <Input
                  placeholder='Value'
                  value={condition.value}
                  onChange={(e) =>
                    setCondition({ ...condition, value: e.target.value })
                  }
                  className='bg-background/50'
                />
              </div>
              <Button
                onClick={addCondition}
                disabled={!condition.key || !condition.value}
                variant='secondary'
                size='sm'
                className='mt-2 w-full hover:bg-primary hover:text-primary-foreground'>
                <Plus className='w-4 h-4 mr-2' />
                Add Condition
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className='flex gap-2'>
          <Button
            className='flex-1 bg-primary/90 hover:bg-primary'
            onClick={() => onFilter(options)}>
            Apply Filters
          </Button>
          <Button
            variant='secondary'
            className='hover:bg-destructive hover:text-destructive-foreground'
            onClick={() =>
              setOptions({
                path: "",
                query: "",
                caseSensitive: false,
                includeParents: true,
                maxDepth: undefined,
                conditions: [],
              })
            }>
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
