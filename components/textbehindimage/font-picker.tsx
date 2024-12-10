/** @format */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { ALL_FONTS } from "@/constants/fonts";

interface FontFamilyPickerProps {
  attribute: string;
  currentFont: string;
  handleAttributeChange: (attribute: string, value: string) => void;
}

const FontFamilyPicker: React.FC<FontFamilyPickerProps> = ({
  attribute,
  currentFont,
  handleAttributeChange,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentFont);

  return (
    <div className='flex flex-col space-y-2'>
      <Label htmlFor='font-family'>Font Family</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='secondary'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
            style={{ fontFamily: value }}>
            <span className='truncate'>{value || "Select font family"}</span>
            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[300px] p-0'>
          <Command>
            <CommandInput placeholder='Search font family...' className='h-9' />
            <CommandList>
              <CommandEmpty>No font family found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className='h-[200px]'>
                  {ALL_FONTS.map((font) => (
                    <CommandItem
                      key={font}
                      value={font}
                      onSelect={() => {
                        setValue(font);
                        handleAttributeChange(attribute, font);
                        setOpen(false);
                      }}>
                      <div className='flex items-center justify-between w-full'>
                        <span style={{ fontFamily: font }}>{font}</span>
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === font ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <div className='mt-2 p-4 border rounded-md'>
          <p className='text-sm text-muted-foreground mb-2'>Preview:</p>
          <p style={{ fontFamily: value }} className='text-lg'>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      )}
    </div>
  );
};

export default FontFamilyPicker;
