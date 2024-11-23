/** @format */

import { Card } from "@/components/card";
import { Mail, Shield, Book, AlertCircle, FileCheck } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className='container mx-auto py-8 px-4 space-y-8 max-w-4xl'>
      <div className="text-center space-y-4">
        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text'>
          Terms of Service
        </h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card className='p-8 space-y-8 bg-background'>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h2 className='text-2xl font-semibold dark:text-white'>
              1. Acceptance of Terms
            </h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>
              By accessing or using Nory Tools, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            <p>
              We reserve the right to modify these terms at any time, and we ll always post the most current version on our website.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-green-500" />
            <h2 className='text-2xl font-semibold dark:text-white'>
              2. Services Description
            </h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Nory Tools provides a suite of developer tools and utilities designed to enhance productivity and streamline workflows. Our services include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>JSON/XML formatting and validation</li>
              <li>Base64 encoding/decoding</li>
              <li>UUID generation</li>
              <li>Hash calculation tools</li>
              <li>Other developer utilities</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <h2 className='text-2xl font-semibold dark:text-white'>
              3. User Responsibilities
            </h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>When using our services, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform for lawful purposes only</li>
              <li>Not attempt to hack, disrupt, or misuse our services</li>
              <li>Provide accurate information when creating an account</li>
              <li>Protect your account credentials and not share them with others</li>
              <li>Report any security vulnerabilities or bugs you discover</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <FileCheck className="w-6 h-6 text-purple-500" />
            <h2 className='text-2xl font-semibold dark:text-white'>
              4. Privacy & Data
            </h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your data.
            </p>
            <p>
              We implement various security measures to maintain the safety of your personal information when you use our services.
            </p>
          </div>
        </section>

        <section className="space-y-4 border-t pt-8">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-blue-500" />
            <h2 className='text-2xl font-semibold dark:text-white'>
              Contact Us
            </h2>
          </div>
          <p className='text-muted-foreground flex items-center gap-2'>
            If you have any questions about these Terms of Service, please contact us at:
            <a
              href='mailto:support@norytools.com'
              className='text-blue-500 hover:text-blue-600 hover:underline'>
              support@norytools.com
            </a>
          </p>
        </section>
      </Card>
    </div>
  );
}
