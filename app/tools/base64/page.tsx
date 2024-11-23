/** @format */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextConverter } from "@/components/base64/text-converter";
import { FileConverter } from "@/components/base64/file-converter";
import { Validator } from "@/components/base64/validator";
import { Formatter } from "@/components/base64/formatter";
import {
  BookOpenIcon,
  FileIcon,
  CheckCircleIcon,
  WrapTextIcon,
} from "lucide-react";

export default function Base64Tool() {
  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-4xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
          Base64 Tools
        </h1>
        <p className='text-center text-muted-foreground mb-8'>
          A comprehensive suite of Base64 encoding and decoding tools
        </p>

        <Tabs defaultValue='text' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 lg:grid-cols-4 mb-8'>
            <TabsTrigger value='text' className='flex items-center gap-2'>
              <BookOpenIcon className='w-4 h-4' />
              <span>Text</span>
            </TabsTrigger>
            <TabsTrigger value='file' className='flex items-center gap-2'>
              <FileIcon className='w-4 h-4' />
              <span>Files</span>
            </TabsTrigger>
            <TabsTrigger value='validator' className='flex items-center gap-2'>
              <CheckCircleIcon className='w-4 h-4' />
              <span>Validator</span>
            </TabsTrigger>
            <TabsTrigger value='formatter' className='flex items-center gap-2'>
              <WrapTextIcon className='w-4 h-4' />
              <span>Formatter</span>
            </TabsTrigger>
          </TabsList>

          <div className='mt-4'>
            <TabsContent value='text'>
              <TextConverter />
            </TabsContent>

            <TabsContent value='file'>
              <FileConverter />
            </TabsContent>

            <TabsContent value='validator'>
              <Validator />
            </TabsContent>

            <TabsContent value='formatter'>
              <Formatter />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
