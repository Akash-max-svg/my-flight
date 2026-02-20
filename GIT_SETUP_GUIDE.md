# 🚀 Git Setup & Push Guide

This guide will help you push your Flight Booking System to GitHub safely.

---

## ⚠️ IMPORTANT - Before You Push

**CRITICAL:** Make sure sensitive files are NOT committed to Git!

### Files That Should NEVER Be Committed:
- ❌ `.env` files (contain passwords, API keys)
- ❌ `node_modules/` (too large, can be reinstalled)
- ❌ Database credentials
- ❌ API keys and secrets

### Files That Are Protected:
- ✅ `.gitignore` is configured to exclude sensitive files
- ✅ `.env.example` files are safe to commit (no real credentials)
- ✅ All sensitive data is excluded

---

## 📋 Pre-Push Checklist

Before pushing to GitHub, verify:

```bash
# 1. Check Git status
git status

# 2. Verify .env files are NOT listed
# If you see .env or backend/.env, STOP and check .gitignore

# 3. Check what files will be committed
git ls-files

# 4. Search for sensitive files (should return nothing)
git ls-files | grep -E '\.env$|credentials|secrets'
```

---

## 🔧 Initial Git Setup

### Step 1: Initialize Git (if not already done)

```bash
# Check if Git is initialized
git status

# If not initialized, run:
git init
```

### Step 2: Configure Git (First Time Only)

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your-email@example.com"

# Verify configuration
git config --list
```

### Step 3: Verify .gitignore is Working

```bash
# Check if .env files are ignored
git status

# You should NOT see:
# - .env
# - backend/.env
# - node_modules/

# You SHOULD see:
# - .env.example
# - backend/.env.example
# - All source code files
```

---

## 📤 Push to GitHub

### Option 1: Create New Repository on GitHub

1. **Go to GitHub**: https://github.com/new
2. **Create repository**:
   - Name: `flight-booking-system` (or your preferred name)
   - Description: "Full-stack flight booking application with React, Node.js, Express, and MongoDB"
   - Visibility: Public or Private
   - **DO NOT** initialize with README (we already have one)
3. **Copy the repository URL**

### Option 2: Use Existing Repository

If you already have a repository, copy its URL.

---

## 🚀 Push Commands

### First Time Push (New Repository)

```bash
# 1. Add all files (respects .gitignore)
git add .

# 2. Check what will be committed
git status

# 3. Commit with a message
git commit -m "Initial commit: Flight Booking System with email notifications"

# 4. Add remote repository (replace with your URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# 5. Push to GitHub
git push -u origin main

# If you get an error about 'master' vs 'main', try:
git branch -M main
git push -u origin main
```

### Subsequent Pushes (After First Push)

```bash
# 1. Check status
git status

# 2. Add changes
git add .

# 3. Commit with descriptive message
git commit -m "Add email notification system"

# 4. Push to GitHub
git push
```

---

## 🔍 Verify Push Was Successful

After pushing, check on GitHub:

1. **Go to your repository** on GitHub
2. **Verify files are there**:
   - ✅ Source code files
   - ✅ README.md
   - ✅ .env.example files
   - ✅ .gitignore
3. **Verify sensitive files are NOT there**:
   - ❌ .env (should NOT be visible)
   - ❌ backend/.env (should NOT be visible)
   - ❌ node_modules/ (should NOT be visible)

---

## 🛡️ Security Check

### If You Accidentally Committed .env File

**STOP! Don't panic. Follow these steps:**

```bash
# 1. Remove .env from Git (but keep local file)
git rm --cached .env
git rm --cached backend/.env

# 2. Commit the removal
git commit -m "Remove .env files from Git"

# 3. Push the changes
git push

# 4. IMPORTANT: Rotate all secrets!
# - Change MongoDB password
# - Generate new JWT secrets
# - Generate new email app password
# - Update Amadeus API keys
```

**Why rotate secrets?**
Once credentials are in Git history, they're compromised. Always rotate them immediately.

---

## 📝 Useful Git Commands

### Check Status
```bash
git status                    # See what's changed
git diff                      # See detailed changes
git log --oneline            # See commit history
```

### Undo Changes
```bash
git checkout -- filename     # Undo changes to a file
git reset HEAD filename      # Unstage a file
git reset --soft HEAD~1      # Undo last commit (keep changes)
```

### Branch Management
```bash
git branch                   # List branches
git branch feature-name      # Create new branch
git checkout feature-name    # Switch to branch
git checkout -b feature-name # Create and switch to branch
```

### Remote Management
```bash
git remote -v                # Show remote URLs
git remote set-url origin URL # Change remote URL
```

---

## 🌿 Recommended Git Workflow

### For New Features

```bash
# 1. Create a new branch
git checkout -b feature/email-notifications

# 2. Make your changes
# ... edit files ...

# 3. Commit changes
git add .
git commit -m "Add email notification system"

# 4. Push branch to GitHub
git push -u origin feature/email-notifications

# 5. Create Pull Request on GitHub
# 6. Merge after review
# 7. Switch back to main
git checkout main
git pull
```

---

## 📚 .gitignore Explanation

Your `.gitignore` file protects:

```
# Environment variables (CRITICAL)
.env
backend/.env

# Dependencies (can be reinstalled)
node_modules/

# Build output (can be regenerated)
dist/
build/

# Logs (not needed in Git)
*.log

# OS files (not needed)
.DS_Store
Thumbs.db

# IDE files (personal preference)
.vscode/
.idea/
```

---

## 🔐 Environment Variables for Collaborators

When someone clones your repository, they need to:

1. **Copy example files**:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

2. **Fill in their own credentials**:
   - MongoDB connection string
   - Email credentials
   - API keys
   - JWT secrets

3. **Never commit their .env files**

---

## 📖 README for GitHub

Your `README.md` is already configured with:
- ✅ Project description
- ✅ Setup instructions
- ✅ Environment variable guide
- ✅ API documentation
- ✅ Troubleshooting tips

---

## 🚨 Common Issues

### Issue: "fatal: remote origin already exists"
```bash
# Solution: Remove and re-add remote
git remote remove origin
git remote add origin YOUR-REPO-URL
```

### Issue: "Updates were rejected"
```bash
# Solution: Pull first, then push
git pull origin main --rebase
git push
```

### Issue: "Permission denied (publickey)"
```bash
# Solution: Use HTTPS instead of SSH, or set up SSH keys
# Use HTTPS URL: https://github.com/username/repo.git
```

### Issue: Large files rejected
```bash
# Solution: Make sure node_modules/ is in .gitignore
# Remove from Git if accidentally added:
git rm -r --cached node_modules/
git commit -m "Remove node_modules"
```

---

## ✅ Final Checklist

Before pushing to GitHub:

- [ ] `.gitignore` file is present and configured
- [ ] `.env` files are NOT in Git (`git status` doesn't show them)
- [ ] `.env.example` files are present with placeholder values
- [ ] `node_modules/` is NOT in Git
- [ ] README.md is updated and complete
- [ ] All sensitive credentials are in `.env` files only
- [ ] Tested locally and everything works
- [ ] Commit messages are clear and descriptive

---

## 🎉 You're Ready!

Your repository is now ready to be pushed to GitHub safely!

```bash
# Quick push commands:
git add .
git commit -m "Complete flight booking system with email notifications"
git push
```

---

## 📞 Need Help?

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf

---

**Remember:** Always review what you're committing before pushing!

```bash
git status    # Check what's changed
git diff      # Review changes
git add .     # Stage changes
git commit    # Commit with message
git push      # Push to GitHub
```

Happy coding! 🚀
