import React from "react";
import { Logo } from "./logo";
import { FaTwitter, FaReddit, FaGithub, FaInstagram, FaCommentDots } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start border-b border-gray-200 pb-6">
          <div className="mb-6 md:mb-0 flex items-center gap-4">
            <Logo />
            <span className="text-sm text-gray-500 font-medium">
            |
              Identify AI-generated text with accuracy and ease.
            </span>
          </div>
          {/* Social Icons */}
          <div className="flex gap-4 text-blue-500 text-xl">
            <FaReddit className="cursor-pointer hover:text-blue-600" />
            <FaTwitter className="cursor-pointer hover:text-blue-600" />
            <FaGithub className="cursor-pointer hover:text-blue-600" />
            <FaCommentDots className="cursor-pointer hover:text-blue-600" />
            <FaInstagram className="cursor-pointer hover:text-blue-600" />
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="mt-2 space-y-2 text-gray-500 font-medium">
              <li>AI Humanizer</li>
              <li>Stealth Writer</li>
              <li>AI Content Detector</li>
              <li>Remove Watermarks</li>
              <li>SEO Writer</li>
              <li>Chrome Extension</li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="mt-2 space-y-2 text-gray-500 font-medium">
              <li>Home</li>
              <li>About Us</li>
              <li>Pricing</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="mt-2 space-y-2 text-gray-500 font-medium">
              <li>Blog</li>
              <li>What&apos;s AI Humanizer</li>
              <li>Help Center</li>
              <li>API</li>
              <li>Customer Forum</li>
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="mt-2 space-y-2 text-gray-500 font-medium">
              <li>FAQs</li>
              <li>Documentation</li>
              <li>Community</li>
              <li>
                Talk to Sales <span className="ml-1">↗</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};
