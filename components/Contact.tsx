import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);

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
          <h1 className="text-4xl font-bold text-lime-400 mb-6">Contact Us</h1>
          <p className="text-zinc-400 mb-8">
            Have questions, feedback, or need support? We'd love to hear from you!
          </p>

          <div className="space-y-8 text-zinc-300">
            {/* Contact Form */}
            <section className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700">
              <h2 className="text-2xl font-semibold text-lime-400 mb-4">Send us a Message</h2>

              {formSubmitted ? (
                <div className="bg-lime-900/30 border border-lime-500/50 text-lime-300 p-4 rounded-lg">
                  <p className="font-semibold">Thank you for your message!</p>
                  <p className="text-sm mt-1">We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    fetch('/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      body: new URLSearchParams(new FormData(form) as any).toString(),
                    })
                      .then(() => setFormSubmitted(true))
                      .catch((error) => alert(error));
                  }}
                  className="space-y-4"
                >
                  {/* Hidden fields for Netlify */}
                  <input type="hidden" name="form-name" value="contact" />
                  <p className="hidden">
                    <label>
                      Don't fill this out if you're human: <input name="bot-field" />
                    </label>
                  </p>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-lime-400/50"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </section>

            <section className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700">
              <h2 className="text-2xl font-semibold text-lime-400 mb-4">Support</h2>
              <p className="mb-4">
                Need help using the application? Check out these resources:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
                <li>
                  <strong className="text-zinc-200">README:</strong> Comprehensive setup and usage guide in the project repository
                </li>
                <li>
                  <strong className="text-zinc-200">Documentation:</strong> Detailed API documentation and examples
                </li>
                <li>
                  <strong className="text-zinc-200">FAQ:</strong> Common questions and troubleshooting tips
                </li>
              </ul>
            </section>

            <section className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700">
              <h2 className="text-2xl font-semibold text-lime-400 mb-4">Community</h2>
              <p className="text-zinc-400">
                Join our community to discuss features, share ideas, and connect with other users. We're building a supportive environment for developers and digital marketers.
              </p>
            </section>

            <section className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700">
              <h2 className="text-2xl font-semibold text-lime-400 mb-4">Response Time</h2>
              <p className="text-zinc-400">
                We typically respond to inquiries within 2-5 business days. For urgent matters, please include "URGENT" in the subject line of your message.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
