/** @format */

import { Card } from "@/components/card";
import { Button } from "@/components/ui/button";
import {
  Github,
  Twitter,
  Mail,
  PenTool,
  Code,
  Zap,
  Users,
  Coffee,
  Star,
  Heart,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Nory Tools | Developer Tools",
  description: "Modern, efficient developer tools to streamline your workflow",
};

export default function AboutPage() {
  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      {/* Hero Section */}
      <div className='text-center mb-12'>
        <h1 className='text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text'>
          About Nory Tools
        </h1>
        <p className='text-xl text-gray-600 dark:text-gray-300'>
          Empowering developers with modern, efficient tools
        </p>
      </div>

      {/* Stats Section */}
      <Card className='p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
          <div className='space-y-2'>
            <PenTool className='w-8 h-8 mx-auto text-blue-600 dark:text-blue-400' />
            <h3 className='text-2xl font-bold dark:text-white'>15+</h3>
            <p className='text-gray-600 dark:text-gray-300'>Developer Tools</p>
          </div>
          <div className='space-y-2'>
            <Zap className='w-8 h-8 mx-auto text-purple-600 dark:text-purple-400' />
            <h3 className='text-2xl font-bold dark:text-white'>100%</h3>
            <p className='text-gray-600 dark:text-gray-300'>Free & Fast</p>
          </div>
          <div className='space-y-2'>
            <Users className='w-8 h-8 mx-auto text-indigo-600 dark:text-indigo-400' />
            <h3 className='text-2xl font-bold dark:text-white'>5K+</h3>
            <p className='text-gray-600 dark:text-gray-300'>Happy Developers</p>
          </div>
        </div>
      </Card>

      {/* Mission Section */}
      <Card className='p-8 mb-8'>
        <h2 className='text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white'>
          <Heart className='text-red-500' /> Our Mission
        </h2>
        <p className='text-gray-600 dark:text-gray-300 mb-4'>
          Nory Tools was born from a simple idea: developer tools should be
          fast, reliable, and accessible. We&apos;re building a platform that
          streamlines your workflow and helps you focus on what matters -
          building great software.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold dark:text-white'>
              What We Offer
            </h3>
            <ul className='list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1'>
              <li>JSON/XML Formatting</li>
              <li>Base64 Encoding/Decoding</li>
              <li>UUID Generation</li>
              <li>Hash Calculator</li>
              <li>JWT Decoder</li>
            </ul>
          </div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold dark:text-white'>
              Why Choose Us
            </h3>
            <ul className='list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1'>
              <li>Lightning Fast Performance</li>
              <li>Modern, Clean Interface</li>
              <li>Dark Mode Support</li>
              <li>No Ads or Tracking</li>
              <li>Regular Updates</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Features Section */}
      <Card className='p-8 mb-8'>
        <h2 className='text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white'>
          <Star className='text-yellow-500' /> Key Features
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='p-4 rounded-lg border dark:border-gray-700'>
            <Code className='w-6 h-6 mb-2 text-blue-500' />
            <h3 className='font-semibold mb-2 dark:text-white'>
              Developer First
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              Built by developers, for developers
            </p>
          </div>
          <div className='p-4 rounded-lg border dark:border-gray-700'>
            <Zap className='w-6 h-6 mb-2 text-yellow-500' />
            <h3 className='font-semibold mb-2 dark:text-white'>
              Lightning Fast
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              Optimized for speed and efficiency
            </p>
          </div>
          <div className='p-4 rounded-lg border dark:border-gray-700'>
            <Coffee className='w-6 h-6 mb-2 text-brown-500' />
            <h3 className='font-semibold mb-2 dark:text-white'>Always Free</h3>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              No hidden costs or subscriptions
            </p>
          </div>
        </div>
      </Card>

      {/* Connect Section */}
      <Card className='p-8'>
        <h2 className='text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white'>
          <Users className='text-green-500' /> Connect With Us
        </h2>
        <div className='flex flex-wrap gap-4'>
          <Button variant='primary' className='flex items-center gap-2'>
            <Github className='h-5 w-5' />
            GitHub
          </Button>
          <Button variant='primary' className='flex items-center gap-2'>
            <Twitter className='h-5 w-5' />
            Twitter
          </Button>
          <Button variant='primary' className='flex items-center gap-2'>
            <Mail className='h-5 w-5' />
            Contact
          </Button>
        </div>
      </Card>

      {/* Sign In/Sign Up Section */}
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-3xl font-bold mb-4'>Welcome to Our App</h1>
        <div className='flex flex-col items-center gap-4'>
          <Button
            variant='primary'
            className='flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300'>
            Sign In
          </Button>
          <Button
            variant='secondary'
            className='flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition duration-300'>
            Sign Up
          </Button>
        </div>
        <div className='mt-8 flex flex-col items-center'>
          <h2 className='text-xl font-semibold'>Locking Sextant</h2>
          <p className='text-center'>
            Secure your navigation with our advanced locking system.
          </p>
          {/* Add more content here as needed */}
        </div>
      </div>
    </div>
  );
}
