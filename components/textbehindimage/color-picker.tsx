/** @format */

"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChromePicker } from "react-color";
import { Input } from "@/components/ui/input";
import { Paintbrush, Zap, Check, X } from "lucide-react";
import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  attribute: string;
  label: string;
  currentColor: string;
  handleAttributeChange: (attribute: string, value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  attribute,
  label,
  currentColor,
  handleAttributeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputColor, setInputColor] = useState(currentColor);
  const [tempColor, setTempColor] = useState(currentColor);

  const handleColorChange = (color: string) => {
    setTempColor(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputColor(e.target.value);
    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
      setTempColor(e.target.value);
    }
  };

  const applyColor = () => {
    handleAttributeChange(attribute, tempColor);
    setInputColor(tempColor);
    setIsOpen(false);
  };

  const cancelColorChange = () => {
    setTempColor(currentColor);
    setInputColor(currentColor);
    setIsOpen(false);
  };

  return (
    <div className='flex flex-col gap-2'>
      <Label htmlFor={attribute}>{label}</Label>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='primary'
            className='w-full justify-start text-left font-normal'>
            <div
              className='mr-2 h-5 w-5 rounded-full border border-gray-200 shadow-sm'
              style={{ backgroundColor: currentColor }}
            />
            <span className='flex-1'>{currentColor}</span>
            <Paintbrush className='ml-2 h-4 w-4 text-gray-400' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-[320px] p-0' align='start'>
          <Tabs defaultValue='picker' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='picker' className='text-xs'>
                <Paintbrush className='mr-2 h-4 w-4' />
                Color Picker
              </TabsTrigger>
              <TabsTrigger value='suggestions' className='text-xs'>
                <Zap className='mr-2 h-4 w-4' />
                Suggestions
              </TabsTrigger>
            </TabsList>
            <TabsContent value='picker' className='space-y-4 p-4'>
              <ChromePicker
                color={tempColor}
                onChange={(color) => handleColorChange(color.hex)}
                disableAlpha
              />
              <div className='flex items-center space-x-2'>
                <Input
                  id={attribute}
                  value={inputColor}
                  onChange={handleInputChange}
                  className='flex-1'
                  placeholder='#RRGGBB'
                />
                <Button
                  onClick={() => handleColorChange(inputColor)}
                  disabled={!/^#[0-9A-F]{6}$/i.test(inputColor)}
                  size='sm'>
                  Preview
                </Button>
              </div>
            </TabsContent>
            <TabsContent value='suggestions' className='p-4'>
              <div className='grid grid-cols-5 gap-2'>
                {colors.map((color) => (
                  <Button
                    key={color}
                    className={cn(
                      "h-10 w-10 rounded-full p-0 transition-transform hover:scale-110",
                      tempColor === color && "ring-2 ring-offset-2 ring-primary"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}>
                    <span className='sr-only'>Select color: {color}</span>
                    {tempColor === color && (
                      <Check className='h-4 w-4 text-white drop-shadow-md' />
                    )}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <div className='flex justify-end gap-2 p-4 pt-0'>
            <Button onClick={cancelColorChange} variant='primary' size='sm'>
              <X className='mr-2 h-4 w-4' />
              Cancel
            </Button>
            <Button onClick={applyColor} size='sm'>
              <Check className='mr-2 h-4 w-4' />
              Apply
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ColorPicker;
