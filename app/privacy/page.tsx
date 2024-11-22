/** @format */

import { Card } from "@/components/card";
import { Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className='container mx-auto py-8 px-4 space-y-6 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-8 dark:text-white'>
        Privacy Policy
      </h1>
      <Card className='p-6 space-y-6'>
        <section>
          <h2 className='text-xl font-semibold mb-4 dark:text-white'>
            1. Introduction
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Welcome to Nory Tools! We prioritize your privacy and are committed
            to protecting your personal information. This Privacy Policy
            explains how we collect, use, and safeguard your data.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-4 dark:text-white'>
            2. Information We Collect
          </h2>
          <p className='text-gray-600 dark:text-gray-300 mb-4'>
            We may collect the following information:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300'>
            <li>
              Personal Information: Name, email address, and any other
              information you voluntarily provide
            </li>
            <li>
              Usage Data: Information about your interactions with the platform
            </li>
            <li>
              Cookies and Tracking: We use cookies to improve your user
              experience
            </li>
          </ul>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-4 dark:text-white'>
            3. How We Use Your Information
          </h2>
          <ul className='list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300'>
            <li>Provide and improve our tools and services</li>
            <li>Communicate updates and support information</li>
            <li>Analyze usage to improve our platform performance</li>
          </ul>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-4 dark:text-white'>
            4. Contact Us
          </h2>
          <p className='text-gray-600 dark:text-gray-300 flex items-center gap-2'>
            <Mail className='w-5 h-5' />
            <a
              href='mailto:support@norytools.com'
              className='text-blue-500 hover:text-blue-600'>
              support@nory.tech
            </a>
          </p>
        </section>
      </Card>
    </div>
  );
}
