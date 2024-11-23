/** @format */

import { Card } from "@/components/card";
import { Mail, Shield, Database, Activity, Lock } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className='container mx-auto py-8 px-4 space-y-8 max-w-4xl'>
      <div className="text-center space-y-4">
        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text'>
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card className='p-8 space-y-8 bg-background'>
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h2 className='text-2xl font-semibold text-foreground'>
              1. Introduction
            </h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Welcome to Nory Tools! We prioritize your privacy and are committed
              to protecting your personal information. This Privacy Policy
              explains how we collect, use, and safeguard your data.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-green-500" />
            <h2 className='text-2xl font-semibold text-foreground'>
              2. Information We Collect
            </h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>We may collect the following information:</p>
            <ul className="list-disc pl-6 space-y-2">
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
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-yellow-500" />
            <h2 className='text-2xl font-semibold text-foreground'>
              3. How We Use Your Information
            </h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our tools and services</li>
              <li>Communicate updates and support information</li>
              <li>Analyze usage to improve our platform performance</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-purple-500" />
            <h2 className='text-2xl font-semibold text-foreground'>
              4. Data Protection
            </h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>
              We implement industry-standard security measures to protect your personal information.
              Your data is encrypted and stored securely on our servers.
            </p>
          </div>
        </section>

        <section className="space-y-4 border-t dark:border-gray-800 pt-8">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-blue-500" />
            <h2 className='text-2xl font-semibold text-foreground'>
              Contact Us
            </h2>
          </div>
          <p className='text-muted-foreground'>
            If you have any questions about our Privacy Policy, please contact us at:
            <a
              href='mailto:support@norytools.com'
              className='text-blue-500 hover:text-blue-600 hover:underline ml-2'>
              support@nory.tech
            </a>
          </p>
        </section>
      </Card>
    </div>
  );
}
