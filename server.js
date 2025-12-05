import express from 'express';
import cors from 'cors';
import simpleGit from 'simple-git';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize git instance
const git = simpleGit();

// Initialize Git repository
app.post('/api/git/init', async (req, res) => {
  try {
    const isRepo = await git.checkIsRepo();
    if (isRepo) {
      return res.json({ success: true, message: 'Repository already initialized' });
    }

    await git.init();
    res.json({ success: true, message: 'Git repository initialized successfully' });
  } catch (error) {
    console.error('Error initializing git:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get repository status
app.get('/api/git/status', async (req, res) => {
  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return res.json({ success: false, isRepo: false, message: 'Not a git repository' });
    }

    const status = await git.status();
    const remotes = await git.getRemotes(true);

    res.json({
      success: true,
      isRepo: true,
      status,
      remotes
    });
  } catch (error) {
    console.error('Error getting git status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add remote repository
app.post('/api/git/remote', async (req, res) => {
  try {
    const { name, url } = req.body;

    if (!name || !url) {
      return res.status(400).json({ success: false, error: 'Remote name and URL are required' });
    }

    const remotes = await git.getRemotes();
    const existingRemote = remotes.find(r => r.name === name);

    if (existingRemote) {
      await git.removeRemote(name);
    }

    await git.addRemote(name, url);
    res.json({ success: true, message: `Remote '${name}' added successfully` });
  } catch (error) {
    console.error('Error adding remote:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Configure Git user
app.post('/api/git/config', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    await git.addConfig('user.name', name);
    await git.addConfig('user.email', email);

    res.json({ success: true, message: 'Git user configured successfully' });
  } catch (error) {
    console.error('Error configuring git:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Commit changes
app.post('/api/git/commit', async (req, res) => {
  try {
    const { message, files } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Commit message is required' });
    }

    // Add specified files or all changes
    if (files && files.length > 0) {
      await git.add(files);
    } else {
      await git.add('.');
    }

    const commitResult = await git.commit(message);
    res.json({
      success: true,
      message: 'Changes committed successfully',
      commit: commitResult
    });
  } catch (error) {
    console.error('Error committing changes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Push to remote
app.post('/api/git/push', async (req, res) => {
  try {
    const { remote = 'origin', branch = 'main', token, username } = req.body;

    // If token is provided, modify the remote URL to include credentials
    if (token) {
      const remotes = await git.getRemotes(true);
      const originRemote = remotes.find(r => r.name === remote);

      if (originRemote) {
        const url = originRemote.refs.push;
        // Replace https:// with https://username:token@
        const authenticatedUrl = url.replace('https://', `https://${username || 'git'}:${token}@`);
        await git.removeRemote(remote);
        await git.addRemote(remote, authenticatedUrl);
      }
    }

    await git.push(remote, branch);
    res.json({ success: true, message: 'Changes pushed successfully' });
  } catch (error) {
    console.error('Error pushing changes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get changed files
app.get('/api/git/changes', async (req, res) => {
  try {
    const status = await git.status();

    const changes = {
      modified: status.modified,
      created: status.created,
      deleted: status.deleted,
      renamed: status.renamed,
      staged: status.staged,
      notAdded: status.not_added
    };

    res.json({ success: true, changes });
  } catch (error) {
    console.error('Error getting changes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get commit history
app.get('/api/git/log', async (req, res) => {
  try {
    const log = await git.log({ maxCount: 10 });
    res.json({ success: true, log });
  } catch (error) {
    console.error('Error getting commit log:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Git server running on http://localhost:${PORT}`);
});
