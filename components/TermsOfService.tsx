import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-zinc-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-lime-400/20 rounded-2xl shadow-2xl shadow-lime-900/40 p-8">
          <h1 className="text-4xl font-bold text-lime-400 mb-6">Terms of Service</h1>
          <p className="text-zinc-400 mb-6">Last updated: December 5, 2024</p>

          <div className="space-y-6 text-zinc-300">
            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Bulk Hyperlink Generator application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use this application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">2. Use License</h2>
              <p className="mb-3">
                Permission is granted to use this application for personal and commercial purposes, subject to the following conditions:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You may not modify or copy the application materials</li>
                <li>You may not use the application for any illegal purpose</li>
                <li>You may not attempt to reverse engineer or decompile the software</li>
                <li>You must comply with all applicable laws when using this application</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">3. GitHub Integration</h2>
              <p className="mb-3">
                When using the GitHub integration features:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are responsible for maintaining the security of your GitHub Personal Access Tokens</li>
                <li>You agree to comply with GitHub's Terms of Service</li>
                <li>You are responsible for all actions taken using your GitHub credentials through this application</li>
                <li>We are not liable for any unauthorized access to your GitHub account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">4. Disclaimer</h2>
              <p className="mb-3">
                This application is provided "as is" without warranties of any kind, either express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fitness for a particular purpose</li>
                <li>Merchantability</li>
                <li>Non-infringement</li>
                <li>Accuracy or completeness of content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">5. Limitations of Liability</h2>
              <p>
                In no event shall the application creators be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use this application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">6. Data Processing</h2>
              <p>
                All URL processing and file generation happens locally on your device. We do not store, transmit, or have access to your data. You retain full ownership of all content you input into the application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">7. Modifications</h2>
              <p>
                We reserve the right to revise these terms of service at any time without notice. By using this application, you agree to be bound by the current version of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">8. Third-Party Services</h2>
              <p className="mb-3">
                This application integrates with third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>GitHub:</strong> Subject to GitHub's Terms of Service</li>
                <li><strong>CDN Services:</strong> For loading external libraries (SheetJS)</li>
              </ul>
              <p className="mt-3">
                Your use of these services is subject to their respective terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">9. Open Source</h2>
              <p>
                This project is open source and available for personal and commercial use. Contributions, bug reports, and feature requests are welcome through the project's GitHub repository.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">10. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">11. Contact</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through the Contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
