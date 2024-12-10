/** @format */

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo } from "react";
import InputField from "./input-field";
import SliderField from "./slider-field";
import ColorPicker from "./color-picker";
import FontFamilyPicker from "./font-picker";
import { Button } from "@/components/ui/button";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Move,
  Text,
  Bold,
  RotateCw,
  Palette,
  LightbulbIcon,
  CaseSensitive,
  TypeIcon as TypeOutline,
  Copy,
  Trash2,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TextCustomizerProps {
  textSet: {
    id: number;
    text: string;
    fontFamily: string;
    top: number;
    left: number;
    color: string;
    fontSize: number;
    fontWeight: number;
    opacity: number;
    rotation: number;
    shadowColor: string;
    shadowSize: number;
  };
  handleAttributeChange: (
    id: number,
    attribute: string,
    value: unknown
  ) => void;
  removeTextSet: (id: number) => void;
  duplicateTextSet: (textSet: TextCustomizerProps["textSet"]) => void;
}

const TextCustomizer: React.FC<TextCustomizerProps> = ({
  textSet,
  handleAttributeChange,
  removeTextSet,
  duplicateTextSet,
}) => {
  const [activeControl, setActiveControl] = useState<string>("text");

  const controls = useMemo(
    () => [
      { id: "text", icon: <CaseSensitive size={20} />, label: "Text" },
      { id: "fontFamily", icon: <TypeOutline size={20} />, label: "Font" },
      { id: "color", icon: <Palette size={20} />, label: "Color" },
      { id: "position", icon: <Move size={20} />, label: "Position" },
      { id: "fontSize", icon: <Text size={20} />, label: "Size" },
      { id: "fontWeight", icon: <Bold size={20} />, label: "Weight" },
      { id: "opacity", icon: <LightbulbIcon size={20} />, label: "Opacity" },
      { id: "rotation", icon: <RotateCw size={20} />, label: "Rotate" },
    ],
    []
  );

  const handleChange = (attribute: string, value: unknown) => {
    handleAttributeChange(textSet.id, attribute, value);
  };

  const renderControl = (controlId: string) => {
    switch (controlId) {
      case "text":
        return (
          <InputField
            attribute='text'
            label='Text'
            currentValue={textSet.text}
            handleAttributeChange={handleChange}
          />
        );
      case "fontFamily":
        return (
          <FontFamilyPicker
            attribute='fontFamily'
            currentFont={textSet.fontFamily}
            handleAttributeChange={handleChange}
          />
        );
      case "color":
        return (
          <ColorPicker
            attribute='color'
            label='Text Color'
            currentColor={textSet.color}
            handleAttributeChange={handleChange}
          />
        );
      case "position":
        return (
          <div className='space-y-4'>
            <SliderField
              attribute='left'
              label='X Position'
              min={-200}
              max={200}
              step={1}
              currentValue={textSet.left}
              handleAttributeChange={handleChange}
            />
            <SliderField
              attribute='top'
              label='Y Position'
              min={-100}
              max={100}
              step={1}
              currentValue={textSet.top}
              handleAttributeChange={handleChange}
            />
          </div>
        );
      case "fontSize":
        return (
          <SliderField
            attribute='fontSize'
            label='Text Size'
            min={10}
            max={800}
            step={1}
            currentValue={textSet.fontSize}
            handleAttributeChange={handleChange}
          />
        );
      case "fontWeight":
        return (
          <SliderField
            attribute='fontWeight'
            label='Font Weight'
            min={100}
            max={900}
            step={100}
            currentValue={textSet.fontWeight}
            handleAttributeChange={handleChange}
          />
        );
      case "opacity":
        return (
          <SliderField
            attribute='opacity'
            label='Text Opacity'
            min={0}
            max={1}
            step={0.01}
            currentValue={textSet.opacity}
            handleAttributeChange={handleChange}
          />
        );
      case "rotation":
        return (
          <SliderField
            attribute='rotation'
            label='Rotation'
            min={-360}
            max={360}
            step={1}
            currentValue={textSet.rotation}
            handleAttributeChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AccordionItem value={`item-${textSet.id}`}>
      <AccordionTrigger>{textSet.text}</AccordionTrigger>
      <AccordionContent>
        <Tabs defaultValue='mobile' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='mobile'>Mobile</TabsTrigger>
            <TabsTrigger value='desktop'>Desktop</TabsTrigger>
          </TabsList>
          <TabsContent value='mobile'>
            <ScrollArea className='w-full'>
              <div className='flex w-max gap-1 mb-2 p-1'>
                {controls.map((control) => (
                  <button
                    key={control.id}
                    onClick={() => setActiveControl(control.id)}
                    className={`flex flex-col items-center justify-center min-w-[4.2rem] h-[4.2rem] rounded-lg ${
                      activeControl === control.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}>
                    {control.icon}
                    <span className='text-xs mt-1'>{control.label}</span>
                  </button>
                ))}
              </div>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>
            <div className='mt-4'>{renderControl(activeControl)}</div>
          </TabsContent>
          <TabsContent value='desktop'>
            <div className='space-y-6'>
              {controls.map((control) => (
                <div key={control.id}>{renderControl(control.id)}</div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className='flex flex-row gap-2 mt-8'>
          <Button onClick={() => duplicateTextSet(textSet)} variant='secondary'>
            <Copy className='w-4 h-4 mr-2' />
            Duplicate
          </Button>
          <Button
            onClick={() => removeTextSet(textSet.id)}
            variant='primary'>
            <Trash2 className='w-4 h-4 mr-2' />
            Remove
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TextCustomizer;
