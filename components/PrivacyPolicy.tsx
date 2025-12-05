import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-lime-400 mb-6">Privacy Policy</h1>
          <p className="text-zinc-400 mb-6">Last updated: December 5, 2024</p>

          <div className="space-y-6 text-zinc-300">
            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">1. Information We Collect</h2>
              <p className="mb-3">
                This application runs locally on your machine. We do not collect, store, or transmit any personal information to external servers.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>URLs you input are processed locally in your browser</li>
                <li>GitHub tokens are used only for authentication and are not stored permanently</li>
                <li>Git configuration (name and email) is stored locally on your machine</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">
                The application uses your information solely for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Converting URLs to hyperlinks in various formats</li>
                <li>Authenticating with GitHub for repository operations</li>
                <li>Storing Git configuration locally for commit operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">3. Data Storage</h2>
              <p>
                All data is stored locally on your device. The application does not use cookies, tracking pixels, or any remote data storage. GitHub Personal Access Tokens entered in the UI are stored only in memory during your session and are not persisted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">4. Third-Party Services</h2>
              <p className="mb-3">
                This application may interact with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>GitHub:</strong> When you push code to GitHub, you're subject to GitHub's privacy policy</li>
                <li><strong>SheetJS (XLSX):</strong> Loaded from CDN for Excel file generation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">5. Your Rights</h2>
              <p>
                Since all data is stored locally on your device, you have complete control over your information. You can delete any stored data by clearing your browser's local storage or uninstalling the application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">6. Security</h2>
              <p>
                We recommend treating GitHub Personal Access Tokens as passwords. Never share your tokens, and regularly rotate them. The application does not transmit tokens to any server other than GitHub's official API.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">7. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-lime-400 mb-3">8. Contact</h2>
              <p>
                If you have questions about this privacy policy, please contact us through the Contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
