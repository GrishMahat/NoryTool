/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, KeyRound, FileJson, Search } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const tools = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "Beautify and minify JSON with syntax highlighting",
    icon: FileJson,
    color: "text-primary",
    bgColor: "bg-primary/10",
    href: "/tools/json",
    badge: "Popular",
  },
  {
    id: "uuid",
    name: "UUID Generator",
    description: "Generate v4 UUIDs with one click",
    icon: KeyRound,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    href: "/tools/uuid",
    badge: "New",
  },
  {
    id: "base64",
    name: "Base64 Converter",
    description: "Encode and decode Base64 strings",
    icon: Code2,
    color: "text-accent",
    bgColor: "bg-accent/10",
    href: "/tools/base64",
  },
];

export function ToolGrid() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-6 px-4 sm:px-6 lg:px-8 py-8'>
      <div className='relative max-w-md mx-auto'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
        <Input
          type='text'
          placeholder='Search tools...'
          className='pl-10 w-full'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <AnimatePresence>
        <motion.div
          className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          layout>
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}>
                <Link href={tool.href} className='block h-full'>
                  <Card className='h-full transition-all duration-200 hover:shadow-lg'>
                    <CardHeader>
                      <div className='flex items-center justify-between'>
                        <div
                          className={`${tool.color} ${tool.bgColor} p-3 rounded-xl`}>
                          <Icon className='w-6 h-6' />
                        </div>
                        {tool.badge && (
                          <Badge variant='secondary'>{tool.badge}</Badge>
                        )}
                      </div>
                      <CardTitle className='mt-4 text-lg sm:text-xl'>
                        {tool.name}
                      </CardTitle>
                      <CardDescription className='text-sm sm:text-base'>
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors'>
                        Try it out
                        <svg
                          className='ml-1 w-4 h-4'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 5l7 7-7 7'
                          />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
