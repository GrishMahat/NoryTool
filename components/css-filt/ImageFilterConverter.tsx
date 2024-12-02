/** @format */

"use client";

import React, { useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Copy,
  Download,
  RotateCcw,
  Upload,
  ContrastIcon as Compare,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { FilterPresets } from "@/lib/FilterPresets";
import Image from "next/image";

const ImageFilterConverter = () => {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
    hueRotate: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
  });
  const [showComparison, setShowComparison] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const filteredImageRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setOriginalImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFilterString = () => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) blur(${filters.blur}px) hue-rotate(${filters.hueRotate}deg) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) invert(${filters.invert}%)`;
  };

  const copyFilterString = () => {
    const filterString = `filter: ${getFilterString()};`;
    navigator.clipboard.writeText(filterString);
    toast({
      title: "Copied!",
      description: "Filter string copied to clipboard",
    });
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturate: 100,
      blur: 0,
      hueRotate: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0,
    });
  };

  const applyPreset = (presetName: string) => {
    const preset = FilterPresets[presetName];
    if (preset) {
      setFilters(preset);
    }
  };

  const downloadFilteredImage = () => {
    if (filteredImageRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = filteredImageRef.current.naturalWidth;
      canvas.height = filteredImageRef.current.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.filter = getFilterString();
        ctx.drawImage(filteredImageRef.current, 0, 0);
        const link = document.createElement("a");
        link.download = "filtered-image.png";
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  const filterControls = [
    { name: "brightness", label: "Brightness", min: 0, max: 200, step: 1 },
    { name: "contrast", label: "Contrast", min: 0, max: 200, step: 1 },
    { name: "saturate", label: "Saturation", min: 0, max: 200, step: 1 },
    { name: "blur", label: "Blur", min: 0, max: 10, step: 0.1 },
    { name: "hueRotate", label: "Hue Rotate", min: 0, max: 360, step: 1 },
    { name: "grayscale", label: "Grayscale", min: 0, max: 100, step: 1 },
    { name: "sepia", label: "Sepia", min: 0, max: 100, step: 1 },
    { name: "invert", label: "Invert", min: 0, max: 100, step: 1 },
  ];

  return (
    <Card className='w-full max-w-6xl mx-auto bg-background shadow-lg rounded-lg overflow-hidden'>
      <CardContent className='p-6'>
        <div className='flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6'>
          <div className='lg:w-2/3 space-y-6'>
            {image ? (
              <div className='relative aspect-video bg-gray-100 rounded-lg overflow-hidden'>
                {showComparison ? (
                  <BeforeAfterSlider
                    before={originalImage!}
                    after={image}
                    afterStyle={{ filter: getFilterString() }}
                    className='w-full h-full'
                  />
                ) : (
                  <div className='relative w-full h-full'>
                    <Image
                      ref={
                        filteredImageRef as React.LegacyRef<HTMLImageElement>
                      }
                      src={image}
                      alt='Preview'
                      fill
                      className='object-cover'
                      style={{ filter: getFilterString() }}
                    />
                  </div>
                )}
                <div className='absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded'>
                  <code>{`filter: ${getFilterString()};`}</code>
                </div>
              </div>
            ) : (
              <div className='aspect-video flex items-center justify-center bg-gray-100 rounded-lg'>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant='primary'
                  className='flex items-center'>
                  <Upload className='w-4 h-4 mr-2' />
                  Upload Image
                </Button>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept='image/*'
                  className='hidden'
                />
              </div>
            )}

            <div className='flex flex-wrap items-center justify-between gap-4'>
              <Button
                onClick={() => setShowComparison(!showComparison)}
                variant={showComparison ? "primary" : "ghost"}
                className='flex items-center'>
                <Compare className='w-4 h-4 mr-2' />
                {showComparison ? "Hide" : "Show"} Comparison
              </Button>
              <div className='flex space-x-2'>
                <Button onClick={copyFilterString} size='sm' variant='primary'>
                  <Copy className='w-4 h-4 mr-2' />
                  Copy CSS
                </Button>
                <Button
                  onClick={downloadFilteredImage}
                  size='sm'
                  variant='primary'>
                  <Download className='w-4 h-4 mr-2' />
                  Download
                </Button>
              </div>
            </div>
          </div>

          <div className='lg:w-1/3 space-y-6'>
            <div className='flex space-x-2'>
              <Select onValueChange={applyPreset}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select a preset' />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(FilterPresets).map((presetName) => (
                    <SelectItem key={presetName} value={presetName}>
                      {presetName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={resetFilters} variant='primary'>
                <RotateCcw className='w-4 h-4 mr-2' />
                Reset
              </Button>
            </div>

            <div className='space-y-4'>
              {filterControls.map((control) => (
                <div key={control.name} className='space-y-2'>
                  <div className='flex justify-between'>
                    <Label
                      htmlFor={control.name}
                      className='text-sm font-medium'>
                      {control.label}
                    </Label>
                    <span className='text-sm text-gray-500'>
                      {filters[control.name as keyof typeof filters]}
                      {control.name === "blur"
                        ? "px"
                        : control.name === "hueRotate"
                        ? "°"
                        : "%"}
                    </span>
                  </div>
                  <Slider
                    id={control.name}
                    value={[filters[control.name as keyof typeof filters]]}
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        [control.name]: value[0],
                      }))
                    }
                    className='w-full'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageFilterConverter;
