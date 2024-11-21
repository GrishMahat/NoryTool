/** @format */

import Link from "next/link";
import { Code2, KeyRound, FileJson } from "lucide-react";

const tools = [
  {
    id: "json",
    name: "JSON Formatter",
    description: "Beautify and minify JSON with syntax highlighting",
    icon: FileJson,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/tools/json",
  },
  {
    id: "uuid",
    name: "UUID Generator",
    description: "Generate v4 UUIDs with one click",
    icon: KeyRound,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    href: "/tools/uuid",
  },
  {
    id: "base64",
    name: "Base64 Converter",
    description: "Encode and decode Base64 strings",
    icon: Code2,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    href: "/tools/base64",
  },
];

export function ToolGrid() {
  return (
    <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Link
            key={tool.id}
            href={tool.href}
            className='relative group rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200'>
            <div
              className={`${tool.bgColor} absolute inset-0 opacity-50 rounded-2xl transition-opacity group-hover:opacity-100`}
            />
            <div className='relative'>
              <div
                className={`${tool.color} inline-flex p-3 rounded-xl ${tool.bgColor}`}>
                <Icon className='w-6 h-6' />
              </div>
              <h3 className='mt-4 text-xl font-semibold dark:text-white'>
                {tool.name}
              </h3>
              <p className='mt-2 text-gray-500 dark:text-gray-400'>
                {tool.description}
              </p>
              <span className='mt-4 inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300'>
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
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
