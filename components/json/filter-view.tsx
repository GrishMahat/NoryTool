/** @format */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FilterOptions } from "@/lib/jsonUtils";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter JSON</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label>Path</Label>
          <Input
            placeholder='e.g., data.users[0].name'
            value={options.path}
            onChange={(e) => setOptions({ ...options, path: e.target.value })}
          />
        </div>

        <div className='space-y-2'>
          <Label>Search Query</Label>
          <Input
            placeholder='Search value...'
            value={options.query}
            onChange={(e) => setOptions({ ...options, query: e.target.value })}
          />
        </div>

        <div className='flex items-center space-x-2'>
          <Switch
            checked={options.caseSensitive}
            onCheckedChange={(checked) =>
              setOptions({ ...options, caseSensitive: checked })
            }
          />
          <Label>Case Sensitive</Label>
        </div>

        <div className='flex items-center space-x-2'>
          <Switch
            checked={options.includeParents}
            onCheckedChange={(checked) =>
              setOptions({ ...options, includeParents: checked })
            }
          />
          <Label>Include Parent Objects</Label>
        </div>

        <div className='space-y-2'>
          <Label>Max Depth</Label>
          <Input
            type='number'
            placeholder='Maximum depth to search'
            value={options.maxDepth || ""}
            onChange={(e) =>
              setOptions({
                ...options,
                maxDepth: parseInt(e.target.value) || undefined,
              })
            }
          />
        </div>

        <div className='space-y-4'>
          <Label>Conditions</Label>
          {options.conditions?.map((cond, index) => (
            <div key={index} className='flex items-center space-x-2'>
              <span className='text-sm'>
                {cond.key} {cond.operator} {cond.value}
              </span>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    conditions: prev.conditions?.filter((_, i) => i !== index),
                  }))
                }>
                Remove
              </Button>
            </div>
          ))}

          <div className='grid grid-cols-2 gap-2'>
            <Input
              placeholder='Key'
              value={condition.key}
              onChange={(e) =>
                setCondition({ ...condition, key: e.target.value })
              }
            />
            <Input
              placeholder='Value'
              value={condition.value}
              onChange={(e) =>
                setCondition({ ...condition, value: e.target.value })
              }
            />
          </div>
          <Button onClick={addCondition}>Add Condition</Button>
        </div>

        <Button className='w-full' onClick={() => onFilter(options)}>
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}
