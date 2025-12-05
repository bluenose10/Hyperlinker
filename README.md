<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Bulk Hyperlink Generator with GitHub Integration

A powerful web application for converting bulk URLs into clickable hyperlinks with support for HTML, CSV, and XLSX exports. Now includes built-in Git and GitHub integration for committing and pushing your code changes directly from the app!

## Features

- **Bulk URL Processing**: Convert hundreds of URLs to hyperlinks instantly
- **Multiple Input Methods**: Paste URLs directly or upload .txt files via drag & drop
- **Multiple Export Formats**:
  - Copy HTML code to clipboard
  - Download CSV with Excel-compatible HYPERLINK formulas
  - Download XLSX with clickable links
- **Git & GitHub Integration**: Initialize repos, commit changes, and push to GitHub directly from the UI
- **Beautiful UI**: Modern, responsive design with dark theme

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Edit [.env.local](.env.local) and add your GitHub Personal Access Token (optional, can also be entered in the UI):
   ```
   GITHUB_TOKEN=your_github_token_here
   PORT=3001
   ```

3. **Run the app:**
   ```bash
   npm start
   ```

   This will start both the frontend (Vite dev server on port 5173) and backend (Express server on port 3001) concurrently.

4. **Open your browser:**

   Navigate to `http://localhost:5173`

### Alternative: Run Servers Separately

If you prefer to run the servers in separate terminals:

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
npm run server
```

## Using the GitHub Integration

The app now includes a full Git/GitHub integration workflow accessible via the "Commit to GitHub" button:

### Step-by-Step Guide

1. **Initialize Repository**
   - Click "Commit to GitHub" button
   - Click "Initialize Git Repository" if not already initialized

2. **Configure Git User**
   - Enter your name and email
   - Click "Configure User"

3. **Add GitHub Repository**
   - Create a new repository on GitHub
   - Copy the repository URL (e.g., `https://github.com/username/repo.git`)
   - Paste it in the "Add GitHub Repository" field
   - Click "Add Remote"

4. **Commit Changes**
   - Enter a commit message
   - Click "Commit All Changes"

5. **Push to GitHub**
   - Enter your GitHub Personal Access Token
   - Click "Push to GitHub"

### Getting a GitHub Personal Access Token

1. Go to [GitHub Settings > Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "Hyperlink Generator")
4. Select scopes:
   - For public repos: `public_repo`
   - For private repos: `repo` (full control)
5. Click "Generate token"
6. Copy the token immediately (you won't see it again!)

## Project Structure

```
hyperlinker/
├── App.tsx              # Main React application with Git integration
├── server.js            # Express backend for Git operations
├── components/
│   └── icons.tsx        # Icon components
├── .env.local           # Environment variables (not committed)
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## API Endpoints

The backend server provides the following Git API endpoints:

- `POST /api/git/init` - Initialize Git repository
- `GET /api/git/status` - Get repository status
- `POST /api/git/config` - Configure Git user
- `POST /api/git/remote` - Add remote repository
- `POST /api/git/commit` - Commit changes
- `POST /api/git/push` - Push to remote
- `GET /api/git/changes` - Get changed files
- `GET /api/git/log` - Get commit history

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, simple-git
- **Export**: SheetJS (XLSX)
- **Version Control**: Git, GitHub

## Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Troubleshooting

### Backend connection errors
- Ensure the backend server is running on port 3001
- Check that CORS is properly configured
- Verify `.env.local` exists and has correct values

### Git operations failing
- Make sure Git is installed on your system
- Verify your GitHub token has the correct permissions
- Check that the repository URL is correct

### Token authentication issues
- Ensure your GitHub token hasn't expired
- Verify the token has `repo` or `public_repo` scope
- Try generating a new token

## Security Notes

- **Never commit your `.env.local` file** - it's already in .gitignore
- GitHub tokens are sensitive - treat them like passwords
- Tokens entered in the UI are only stored in memory and used for push operations
- Consider using environment variables for production deployments

## License

This project is open source and available for personal and commercial use.
