/** @format */

import { Card } from "@/components/card";
import { Mail } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className='container mx-auto py-8 px-4 space-y-6 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-8 dark:text-white'>
        Terms of Service
      </h1>
      <Card className='p-6 space-y-6'>
        <section>
          <h2 className='text-xl font-semibold mb-4 dark:text-white'>
            1. Acceptance of Terms
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            By accessing or using Nory Tools, you agree to comply with these
            Terms of Service. If you do not agree, please discontinue use.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-4 dark:text-white'>
            2. Description of Services
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Nory Tools provides developers with various online tools for
            productivity and convenience. We reserve the right to modify or
            discontinue services at any time.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-4 dark:text-white'>
            3. User Responsibilities
          </h2>
          <ul className='list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300'>
            <li>Use the platform for lawful purposes only</li>
            <li>Not attempt to hack, disrupt, or misuse our services</li>
            <li>
              Provide accurate and truthful information when creating an account
            </li>
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
              support@norytools.com
            </a>
          </p>
        </section>
      </Card>
    </div>
  );
}
