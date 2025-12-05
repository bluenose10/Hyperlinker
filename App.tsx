
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LinkIcon, ClipboardIcon, TrashIcon, CheckIcon, UploadIcon, DownloadIcon, GitHubIcon, RobotIcon } from './components/icons';

// TypeScript declaration for the XLSX library loaded from CDN
declare const XLSX: any;

type ActionButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
};

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, children, variant = 'primary', className = '' }) => {
  const baseClasses = 'px-5 py-2.5 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-4';
  
  const variantClasses = {
    primary: 'bg-lime-400 hover:bg-lime-500 text-black focus:ring-lime-400/50',
    secondary: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100 focus:ring-zinc-600/50',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50',
  };

  const disabledClasses = 'disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};


const API_BASE_URL = 'http://localhost:3001/api';

export default function App() {
  const [urlsInput, setUrlsInput] = useState<string>('');
  const [hyperlinks, setHyperlinks] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Git/GitHub state
  const [showGitModal, setShowGitModal] = useState<boolean>(false);
  const [isGitRepo, setIsGitRepo] = useState<boolean>(false);
  const [gitStatus, setGitStatus] = useState<any>(null);
  const [commitMessage, setCommitMessage] = useState<string>('');
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [gitToken, setGitToken] = useState<string>('');
  const [gitLoading, setGitLoading] = useState<boolean>(false);
  const [gitMessage, setGitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleGenerateLinks = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const urls = urlsInput
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);
      setHyperlinks(urls);
      setIsGenerating(false);
    }, 500);
  }, [urlsInput]);

  const handleCopyHtml = useCallback(() => {
    if (hyperlinks.length === 0) return;

    const htmlToCopy = hyperlinks.map(url => {
      let href = url;
      if (!href.startsWith('http://') && !href.startsWith('https://')) {
        href = `//${url}`;
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    }).join('\n');
    
    navigator.clipboard.writeText(htmlToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [hyperlinks]);

  const handleClear = useCallback(() => {
    setUrlsInput('');
    setHyperlinks([]);
  }, []);

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('//') ? `https:${url}` : url);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  const handleFile = useCallback((file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setUrlsInput(text);
    };
    reader.onerror = () => {
        console.error("Failed to read file");
    };
    reader.readAsText(file);
  }, []);

  const getAbsoluteUrl = (url: string): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    return `https://${url}`;
  };

  const handleDownloadXLSX = useCallback(() => {
    if (hyperlinks.length === 0) return;

    const ws: any = {};
    const range = { s: { c: 0, r: 0 }, e: { c: 0, r: hyperlinks.length } };

    // Header
    ws['A1'] = { v: 'Clickable Link', t: 's' };

    // Add hyperlinks
    hyperlinks.forEach((url, index) => {
      const href = getAbsoluteUrl(url);
      const cellAddress = `A${index + 2}`;

      ws[cellAddress] = {
        v: href,
        t: 's',
        l: { Target: href },
        s: {
          font: { color: { rgb: "0563C1" }, underline: true }
        }
      };
    });

    ws['!ref'] = XLSX.utils.encode_range(range);
    ws['!cols'] = [{ wch: 60 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hyperlinks');
    XLSX.writeFile(wb, 'hyperlinks.xlsx');
  }, [hyperlinks]);
  
  const handleUploadAreaClick = () => fileInputRef.current?.click();
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Git/GitHub functions
  const checkGitStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/git/status`);
      const data = await response.json();
      setIsGitRepo(data.isRepo);
      setGitStatus(data.status);
      return data;
    } catch (error) {
      console.error('Error checking git status:', error);
      return { isRepo: false };
    }
  }, []);

  const initializeGitRepo = useCallback(async () => {
    setGitLoading(true);
    setGitMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/git/init`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setGitMessage({ type: 'success', text: 'Git repository initialized!' });
        await checkGitStatus();
      } else {
        setGitMessage({ type: 'error', text: data.error || 'Failed to initialize repository' });
      }
    } catch (error) {
      setGitMessage({ type: 'error', text: 'Failed to connect to server' });
    } finally {
      setGitLoading(false);
    }
  }, [checkGitStatus]);

  const configureGitUser = useCallback(async () => {
    if (!userName || !userEmail) {
      setGitMessage({ type: 'error', text: 'Please provide both name and email' });
      return;
    }
    setGitLoading(true);
    setGitMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/git/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, email: userEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setGitMessage({ type: 'success', text: 'Git user configured!' });
      } else {
        setGitMessage({ type: 'error', text: data.error || 'Failed to configure user' });
      }
    } catch (error) {
      setGitMessage({ type: 'error', text: 'Failed to connect to server' });
    } finally {
      setGitLoading(false);
    }
  }, [userName, userEmail]);

  const addRemoteRepo = useCallback(async () => {
    if (!repoUrl) {
      setGitMessage({ type: 'error', text: 'Please provide repository URL' });
      return;
    }
    setGitLoading(true);
    setGitMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/git/remote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'origin', url: repoUrl }),
      });
      const data = await response.json();
      if (data.success) {
        setGitMessage({ type: 'success', text: 'Remote repository added!' });
        await checkGitStatus();
      } else {
        setGitMessage({ type: 'error', text: data.error || 'Failed to add remote' });
      }
    } catch (error) {
      setGitMessage({ type: 'error', text: 'Failed to connect to server' });
    } finally {
      setGitLoading(false);
    }
  }, [repoUrl, checkGitStatus]);

  const commitChanges = useCallback(async () => {
    if (!commitMessage) {
      setGitMessage({ type: 'error', text: 'Please provide a commit message' });
      return;
    }
    setGitLoading(true);
    setGitMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/git/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commitMessage }),
      });
      const data = await response.json();
      if (data.success) {
        setGitMessage({ type: 'success', text: 'Changes committed successfully!' });
        setCommitMessage('');
        await checkGitStatus();
      } else {
        setGitMessage({ type: 'error', text: data.error || 'Failed to commit' });
      }
    } catch (error) {
      setGitMessage({ type: 'error', text: 'Failed to connect to server' });
    } finally {
      setGitLoading(false);
    }
  }, [commitMessage, checkGitStatus]);

  const pushToGitHub = useCallback(async () => {
    if (!gitToken) {
      setGitMessage({ type: 'error', text: 'Please provide GitHub token' });
      return;
    }
    setGitLoading(true);
    setGitMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/git/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remote: 'origin',
          branch: 'main',
          token: gitToken,
          username: userName || 'git'
        }),
      });
      const data = await response.json();
      if (data.success) {
        setGitMessage({ type: 'success', text: 'Pushed to GitHub successfully!' });
        await checkGitStatus();
      } else {
        setGitMessage({ type: 'error', text: data.error || 'Failed to push' });
      }
    } catch (error) {
      setGitMessage({ type: 'error', text: 'Failed to connect to server' });
    } finally {
      setGitLoading(false);
    }
  }, [gitToken, userName, checkGitStatus]);

  useEffect(() => {
    if (showGitModal) {
      checkGitStatus();
    }
  }, [showGitModal, checkGitStatus]);

  // PWA Install Prompt Logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show install prompt after 3 seconds
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans">
      {/* Navigation Bar */}
      <nav className="w-full border-b border-zinc-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <RobotIcon className="w-8 h-8 text-lime-400" />
              <span className="text-xl font-bold text-lime-400">Lynkiey</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#how-to" className="text-lime-400 hover:text-lime-300 transition-colors text-sm font-medium">How It Works</a>
              <a href="#features" className="text-lime-400 hover:text-lime-300 transition-colors text-sm font-medium">Features</a>
              <Link to="/contact" className="text-lime-400 hover:text-lime-300 transition-colors text-sm font-medium">Contact</Link>
              {/* Test install button for development */}
              <button
                onClick={() => setShowInstallPrompt(true)}
                className="px-3 py-1.5 bg-lime-500 hover:bg-lime-600 text-black text-xs font-semibold rounded-lg transition-colors"
              >
                Install App
              </button>
            </div>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-lime-400 hover:text-lime-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-black/90 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              <a href="#how-to" onClick={() => setMobileMenuOpen(false)} className="block text-lime-400 hover:text-lime-300 transition-colors text-sm font-medium">How It Works</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-lime-400 hover:text-lime-300 transition-colors text-sm font-medium">Features</a>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-lime-400 hover:text-lime-300 transition-colors text-sm font-medium">Contact</Link>
              <button
                onClick={() => { setShowInstallPrompt(true); setMobileMenuOpen(false); }}
                className="w-full px-3 py-2 bg-lime-500 hover:bg-lime-600 text-black text-sm font-semibold rounded-lg transition-colors"
              >
                Install App
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center relative">
      {/* Animated gradient background orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="w-full max-w-5xl bg-zinc-900/50 backdrop-blur-xl border border-lime-400/20 rounded-2xl shadow-2xl shadow-lime-900/40 overflow-hidden my-8 relative z-10 hover:shadow-lime-900/60 hover:border-lime-400/30 transition-all duration-500">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-lime-400">Free Hyperlink Generator</h1>
            <p className="text-2xl font-bold text-lime-400 mt-3">Create Hyperlinks from URLs Instantly</p>
            <p className="text-zinc-400 mt-4 text-lg max-w-3xl mx-auto">
              Free online tool to create hyperlinks and convert URL to hyperlink for SEO and web development. Bulk process links with our hyperlink generator - no signup required.
            </p>
          </div>

          {/* Support Links */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://paypal.me/markm678"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors duration-200 text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.296c-.465 0-.927.108-1.336.296z"/>
              </svg>
              Buy Mark a Coffee
            </a>
            <a
              href="https://www.linkedin.com/in/mark-moran-blockchain-solutions-architect/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleUploadAreaClick(); }}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-lime-400 bg-lime-900/20 scale-105' : 'border-zinc-700 hover:border-lime-500 hover:bg-zinc-800/60'}`}
                onClick={handleUploadAreaClick} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".txt" aria-label="File upload" />
                <UploadIcon className="mx-auto h-12 w-12 text-zinc-600" />
                <p className="mt-2 text-zinc-300">
                  <span className="font-semibold text-lime-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-zinc-500">Plain text file (.txt)</p>
              </div>

              <div className="relative my-4 flex items-center" aria-hidden="true">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink mx-4 text-zinc-600 text-xs uppercase">Or paste below</span>
                <div className="flex-grow border-t border-zinc-800"></div>
              </div>
              
              <textarea
                id="url-input"
                rows={8}
                value={urlsInput}
                onChange={(e) => setUrlsInput(e.target.value)}
                placeholder="https://example.com&#10;www.google.com&#10;anothersite.org/path"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200 resize-y"
              />
            </div>

            {/* Output Section */}
            <div>
              <div className="w-full h-full bg-zinc-900 border border-zinc-700 rounded-lg flex flex-col">
                <div className="p-4 flex-grow overflow-y-auto h-64">
                    {hyperlinks.length > 0 ? (
                    <ul className="space-y-2">
                        {hyperlinks.slice(0, 5).map((url, index) => {
                          let href = url;
                          if (!href.startsWith('http://') && !href.startsWith('https://')) href = `//${url}`;
                          const valid = isValidUrl(href);
                          return (
                              <li key={index} className="flex items-center text-sm">
                                <a href={valid ? href : '#'} target="_blank" rel="noopener noreferrer" className={`break-all text-blue-500 hover:text-blue-400 underline ${!valid ? 'cursor-not-allowed text-red-500 line-through decoration-red-500' : ''}`} title={valid ? url : 'Invalid URL'}>{url}</a>
                              </li>
                          );
                        })}
                    </ul>
                    ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-500 text-center">Generated links will appear here.</p>
                    </div>
                    )}
                </div>
                {hyperlinks.length > 0 && (
                  <div className="border-t border-zinc-700 p-3 bg-zinc-800/50 rounded-b-lg">
                    {hyperlinks.length > 5 && ( <p className="text-xs text-zinc-400 text-center mb-3">Showing 5 of {hyperlinks.length} links.</p> )}
                    <div className="flex items-center justify-center">
                        <button onClick={handleDownloadXLSX} className="text-xs flex items-center gap-1.5 px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-lime-400">
                          <DownloadIcon className="w-4 h-4" /> Download Excel File
                        </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ActionButton onClick={handleGenerateLinks} disabled={!urlsInput.trim() || isGenerating} variant="primary" className="w-full sm:w-auto">
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <LinkIcon className="w-5 h-5" /> Generate Links
                </>
              )}
            </ActionButton>
            <div className="flex items-center gap-4">
               <ActionButton onClick={handleCopyHtml} disabled={hyperlinks.length === 0} variant="secondary">
                {isCopied ? <CheckIcon className="w-5 h-5 text-lime-400" /> : <ClipboardIcon className="w-5 h-5" />} {isCopied ? 'Copied HTML!' : 'Copy HTML'}
              </ActionButton>
              <ActionButton onClick={handleClear} disabled={!urlsInput && hyperlinks.length === 0} variant="danger">
                <TrashIcon className="w-5 h-5" /> Clear
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl text-zinc-400 space-y-8 px-8 pb-8">
        {/* How To Section */}
        <div id="how-to" className="bg-zinc-900/50 rounded-3xl p-8 md:p-12 border border-lime-400/20 scroll-mt-20">
          <h2 className="text-3xl font-bold text-lime-400 mb-6">How to Create Hyperlinks from URLs</h2>
          <div className="space-y-4 text-zinc-300">
            <p>Use our free hyperlink generator to create hyperlinks in seconds:</p>
            <ol className="space-y-3 ml-6 list-decimal">
              <li><strong className="text-white">Input URLs:</strong> Paste your URLs (one per line) or upload a file to convert URL to hyperlink.</li>
              <li><strong className="text-white">Customize:</strong> Optionally add custom anchor text for your hyperlinks.</li>
              <li><strong className="text-white">Convert:</strong> Click "Generate Links" to create hyperlinks instantly.</li>
              <li><strong className="text-white">Export:</strong> Copy HTML hyperlinks to clipboard or download as CSV/XLSX.</li>
            </ol>
          </div>
        </div>

        {/* Why Use Section */}
        <div id="features" className="bg-zinc-900/50 rounded-3xl p-6 md:p-8 border border-lime-400/20 scroll-mt-20">
          <h2 className="text-2xl font-bold text-lime-400 mb-4">Why Use Our Free Hyperlink Generator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group p-6 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-lime-400/50 hover:bg-zinc-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-lime-900/20">
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-lime-400 transition-colors">Bulk Hyperlink Creation</h3>
              <p className="text-zinc-400">Create hyperlinks from thousands of URLs at once. Perfect for SEO professionals and digital marketers who need to convert URL to hyperlink in bulk.</p>
            </div>
            <div className="group p-6 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-lime-400/50 hover:bg-zinc-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-lime-900/20">
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-lime-400 transition-colors">SEO Optimized Links</h3>
              <p className="text-zinc-400">Generate SEO-ready hyperlinks for link building campaigns and content optimization strategies.</p>
            </div>
            <div className="group p-6 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-lime-400/50 hover:bg-zinc-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-lime-900/20">
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-lime-400 transition-colors">100% Free Tool</h3>
              <p className="text-zinc-400">Create unlimited hyperlinks with no signup required. Free hyperlink generator with no restrictions.</p>
            </div>
            <div className="group p-6 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:border-lime-400/50 hover:bg-zinc-800 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-lime-900/20">
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-lime-400 transition-colors">Private & Secure</h3>
              <p className="text-zinc-400">Your URLs are processed locally in your browser. We never store or transmit your data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-5xl px-8 pb-8">
        <div className="bg-zinc-900/50 rounded-3xl p-8 md:p-12 border border-lime-400/20">
          <h2 className="text-3xl font-bold text-lime-400 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "How do I create a hyperlink?",
                answer: "Simply paste your URLs into the text box (one per line), or upload a file. Click 'Generate Links' and you'll instantly get clickable hyperlinks."
              },
              {
                question: "Can I bulk create hyperlinks?",
                answer: "Yes! Paste hundreds or thousands of URLs at once, or upload CSV, TXT, or Excel files."
              },
              {
                question: "What file formats are supported?",
                answer: "We support TXT, CSV, and Excel files (.xlsx, .xls). Drag and drop or browse to upload."
              },
              {
                question: "Is this free?",
                answer: "Yes, completely free with unlimited conversions. No sign-up required."
              },
              {
                question: "Can I customize anchor text?",
                answer: "Absolutely! Set custom anchor text for all links, or leave blank to use the URL."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-lime-400/50 transition-all duration-300 overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-lime-400">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-lime-400 flex-shrink-0 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="px-6 pb-6 text-zinc-300">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden Git/GitHub Modal - Removed */}
      {false && showGitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-lime-400/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-lime-400 flex items-center gap-2">
                  <GitHubIcon className="w-7 h-7" />
                  Git & GitHub Integration
                </h2>
                <button
                  onClick={() => setShowGitModal(false)}
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {gitMessage && (
                <div className={`mb-4 p-3 rounded-lg ${gitMessage.type === 'success' ? 'bg-lime-900/30 border border-lime-500/50 text-lime-300' : 'bg-red-900/30 border border-red-500/50 text-red-300'}`}>
                  {gitMessage.text}
                </div>
              )}

              <div className="space-y-6">
                {/* Git Status */}
                <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                  <h3 className="text-lg font-semibold text-zinc-200 mb-2">Repository Status</h3>
                  <p className="text-sm text-zinc-400">
                    {isGitRepo ? '✓ Git repository initialized' : '✗ Not a Git repository'}
                  </p>
                  {gitStatus && (
                    <div className="mt-2 text-xs text-zinc-500">
                      <p>Modified: {gitStatus.modified?.length || 0} | Created: {gitStatus.created?.length || 0} | Deleted: {gitStatus.deleted?.length || 0}</p>
                    </div>
                  )}
                </div>

                {/* Initialize Repo */}
                {!isGitRepo && (
                  <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                    <h3 className="text-lg font-semibold text-zinc-200 mb-3">1. Initialize Repository</h3>
                    <button
                      onClick={initializeGitRepo}
                      disabled={gitLoading}
                      className="w-full px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {gitLoading ? 'Initializing...' : 'Initialize Git Repository'}
                    </button>
                  </div>
                )}

                {/* Configure User */}
                {isGitRepo && (
                  <>
                    <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                      <h3 className="text-lg font-semibold text-zinc-200 mb-3">2. Configure Git User</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        />
                        <input
                          type="email"
                          placeholder="your.email@example.com"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        />
                        <button
                          onClick={configureGitUser}
                          disabled={gitLoading || !userName || !userEmail}
                          className="w-full px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {gitLoading ? 'Configuring...' : 'Configure User'}
                        </button>
                      </div>
                    </div>

                    {/* Add Remote */}
                    <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                      <h3 className="text-lg font-semibold text-zinc-200 mb-3">3. Add GitHub Repository</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="https://github.com/username/repo.git"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        />
                        <button
                          onClick={addRemoteRepo}
                          disabled={gitLoading || !repoUrl}
                          className="w-full px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {gitLoading ? 'Adding...' : 'Add Remote'}
                        </button>
                      </div>
                    </div>

                    {/* Commit Changes */}
                    <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                      <h3 className="text-lg font-semibold text-zinc-200 mb-3">4. Commit Changes</h3>
                      <div className="space-y-3">
                        <textarea
                          placeholder="Commit message (e.g., 'Initial commit' or 'Update hyperlink generator')"
                          value={commitMessage}
                          onChange={(e) => setCommitMessage(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500 resize-none"
                        />
                        <button
                          onClick={commitChanges}
                          disabled={gitLoading || !commitMessage}
                          className="w-full px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {gitLoading ? 'Committing...' : 'Commit All Changes'}
                        </button>
                      </div>
                    </div>

                    {/* Push to GitHub */}
                    <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                      <h3 className="text-lg font-semibold text-zinc-200 mb-3">5. Push to GitHub</h3>
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="GitHub Personal Access Token"
                          value={gitToken}
                          onChange={(e) => setGitToken(e.target.value)}
                          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        />
                        <p className="text-xs text-zinc-500">
                          Generate a token at: <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">github.com/settings/tokens</a>
                        </p>
                        <button
                          onClick={pushToGitHub}
                          disabled={gitLoading || !gitToken}
                          className="w-full px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {gitLoading ? 'Pushing...' : 'Push to GitHub'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Prompt Widget */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-fade-in-up">
          <div className="bg-zinc-900 border-2 border-lime-400 rounded-2xl shadow-2xl shadow-lime-900/50 p-6">
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-start gap-4">
              <RobotIcon className="w-12 h-12 text-lime-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-lime-400 mb-2">Install Lynkiey</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Add Lynkiey to your home screen for quick access and offline use!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-lg transition-colors text-sm"
                  >
                    Install App
                  </button>
                  <button
                    onClick={() => setShowInstallPrompt(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-lg transition-colors text-sm"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-5xl border-t border-zinc-800 mt-16 pt-8 pb-8">
        <div className="flex flex-col items-center gap-6">
          {/* Footer Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
            <div className="text-center md:text-left">
              <p className="text-lime-400 text-sm">
                © 2024 Hyperlink Generator • Free • No signup required
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/privacy"
                className="text-lime-400 hover:text-lime-300 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-lime-400 hover:text-lime-300 text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-lime-400 hover:text-lime-300 text-sm transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}