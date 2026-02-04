# Git Command Cheatsheet

A comprehensive, easy-to-understand guide to Git commands with practical examples, use cases, and explanations.

Git is a free and open source distributed version control system that helps you track changes in your code and collaborate with others.

---

## Table of Contents

1. [Setup & Configuration](#1-setup--configuration)
2. [Setup & Init](#2-setup--init)
3. [Stage & Snapshot](#3-stage--snapshot)
4. [Branch & Merge](#4-branch--merge)
5. [Share & Update](#5-share--update)
6. [Inspect & Compare](#6-inspect--compare)
7. [Tracking Path Changes](#7-tracking-path-changes)
8. [Temporary Commits](#8-temporary-commits)
9. [Rewrite History](#9-rewrite-history)
10. [Ignoring Patterns](#10-ignoring-patterns)

---

## 1. Setup & Configuration

Configuring user information used across all local repositories.

### 1.1 Set User Name

```bash
git config --global user.name "[firstname lastname]"
```

**What it does:** Sets your name that will appear in commit history.

**When to use:** When setting up Git for the first time on your computer.

**Why use it:** To identify who made each commit when reviewing version history.

**Example:**

```bash
git config --global user.name "John Smith"
```

---

### 1.2 Set User Email

```bash
git config --global user.email "[valid-email]"
```

**What it does:** Sets your email address that will be associated with each commit.

**When to use:** During initial Git setup on your machine.

**Why use it:** To associate commits with your identity and GitHub account.

**Example:**

```bash
git config --global user.email "john.smith@example.com"
```

---

### 1.3 Enable Color UI

```bash
git config --global color.ui auto
```

**What it does:** Enables automatic command line coloring for Git output.

**When to use:** During initial setup to improve readability.

**Why use it:** Makes Git output easier to read and review in the terminal.

---

## 2. Setup & Init

Configuring user information, initializing and cloning repositories.

### 2.1 Initialize a Repository

```bash
git init
```

**What it does:** Initializes an existing directory as a Git repository.

**When to use:** When starting a new project or adding version control to an existing project.

**Why use it:** To start tracking changes in your project with Git.

**Example:**

```bash
cd my-project
git init
```

---

### 2.2 Clone a Repository

```bash
git clone [url]
```

**What it does:** Retrieves an entire repository from a hosted location via URL.

**When to use:** When you want to work on an existing project from GitHub or another remote repository.

**Why use it:** To get a complete copy of a project including all its history.

**Example:**

```bash
git clone https://github.com/username/repository.git
```

---

## 3. Stage & Snapshot

Working with snapshots and the Git staging area.

### 3.1 Check Status

```bash
git status
```

**What it does:** Shows modified files in working directory, staged for your next commit.

**When to use:** Before committing to see what changes will be included.

**Why use it:** To review what files have been modified, added, or deleted.

**Example:**

```bash
git status
```

---

### 3.2 Add File to Staging

```bash
git add [file]
```

**What it does:** Adds a file as it looks now to your next commit (stage).

**When to use:** When you want to include specific changes in your next commit.

**Why use it:** To selectively choose which changes to commit.

**Example:**

```bash
git add index.html
git add .              # Add all files
git add *.js          # Add all JavaScript files
```

---

### 3.3 Unstage a File

```bash
git reset [file]
```

**What it does:** Unstages a file while retaining the changes in working directory.

**When to use:** When you accidentally staged a file you don't want to commit yet.

**Why use it:** To remove files from staging area without losing your changes.

**Example:**

```bash
git reset index.html
```

---

### 3.4 View Unstaged Changes

```bash
git diff
```

**What it does:** Shows the difference of what is changed but not staged.

**When to use:** When you want to see what changes you've made but haven't staged yet.

**Why use it:** To review your modifications before staging them.

**Example:**

```bash
git diff
```

---

### 3.5 View Staged Changes

```bash
git diff --staged
```

**What it does:** Shows the difference of what is staged but not yet committed.

**When to use:** Before committing to review what will be included.

**Why use it:** To verify the changes you're about to commit.

**Example:**

```bash
git diff --staged
```

---

### 3.6 Commit Changes

```bash
git commit -m "[descriptive message]"
```

**What it does:** Commits your staged content as a new commit snapshot.

**When to use:** After staging changes you want to save to history.

**Why use it:** To create a permanent record of your changes with a description.

**Example:**

```bash
git commit -m "Add user login functionality"
git commit -m "Fix navigation bug on mobile devices"
```

---

## 4. Branch & Merge

Isolating work in branches, changing context, and integrating changes.

### 4.1 List Branches

```bash
git branch
```

**What it does:** Lists your branches with an asterisk (\*) next to the currently active branch.

**When to use:** When you need to see all available branches in your repository.

**Why use it:** To check which branch you're on and what other branches exist.

**Example:**

```bash
git branch
# Output:
#   main
# * feature-login
#   bugfix-header
```

---

### 4.2 Create New Branch

```bash
git branch [branch-name]
```

**What it does:** Creates a new branch at the current commit.

**When to use:** When starting work on a new feature or bug fix.

**Why use it:** To isolate your work from the main codebase.

**Example:**

```bash
git branch feature-dashboard
```

---

### 4.3 Switch Branch

```bash
git checkout [branch-name]
```

**What it does:** Switches to another branch and checks it out into your working directory.

**When to use:** When you want to work on a different branch.

**Why use it:** To switch between different lines of development.

**Example:**

```bash
git checkout feature-dashboard
git checkout -b new-feature  # Create and switch to new branch
```

---

### 4.4 Merge Branch

```bash
git merge [branch]
```

**What it does:** Merges the specified branch's history into the current one.

**When to use:** When you want to integrate changes from one branch into another.

**Why use it:** To combine work from different branches.

**Example:**

```bash
git checkout main
git merge feature-dashboard
```

---

### 4.5 View Commit History

```bash
git log
```

**What it does:** Shows all commits in the current branch's history.

**When to use:** When you want to see what changes have been made over time.

**Why use it:** To review project history and find specific commits.

**Example:**

```bash
git log
git log --oneline           # Compact view
git log --graph --oneline   # Visual branch graph
```

---

## 5. Share & Update

Retrieving updates from another repository and updating local repos.

### 5.1 Add Remote Repository

```bash
git remote add [alias] [url]
```

**What it does:** Adds a Git URL as an alias.

**When to use:** When you want to connect your local repository to a remote one.

**Why use it:** To enable pushing and pulling changes to/from a remote server.

**Example:**

```bash
git remote add origin https://github.com/username/repository.git
```

---

### 5.2 Fetch Remote Changes

```bash
git fetch [alias]
```

**What it does:** Fetches down all the branches from that Git remote.

**When to use:** When you want to see what others have committed without merging.

**Why use it:** To update your local copy of the remote branches without affecting your work.

**Example:**

```bash
git fetch origin
```

---

### 5.3 Merge Remote Branch

```bash
git merge [alias]/[branch]
```

**What it does:** Merges a remote branch into your current branch to bring it up to date.

**When to use:** After fetching, when you want to integrate remote changes.

**Why use it:** To combine remote changes with your local work.

**Example:**

```bash
git merge origin/main
```

---

### 5.4 Push to Remote

```bash
git push [alias] [branch]
```

**What it does:** Transmits local branch commits to the remote repository branch.

**When to use:** When you want to share your commits with others.

**Why use it:** To upload your local changes to the remote repository.

**Example:**

```bash
git push origin main
git push origin feature-dashboard
```

---

### 5.5 Pull from Remote

```bash
git pull
```

**What it does:** Fetches and merges any commits from the tracking remote branch.

**When to use:** When you want to get the latest changes from the remote repository.

**Why use it:** To sync your local branch with the remote branch in one step.

**Example:**

```bash
git pull origin main
```

---

## 6. Inspect & Compare

Examining logs, diffs and object information.

### 6.1 View Commit History

```bash
git log
```

**What it does:** Shows the commit history for the currently active branch.

**When to use:** When you want to review the project's development history.

**Why use it:** To see who made what changes and when.

---

### 6.2 Compare Branches

```bash
git log branchB..branchA
```

**What it does:** Shows the commits on branchA that are not on branchB.

**When to use:** When comparing what's different between two branches.

**Why use it:** To see what commits are unique to one branch.

**Example:**

```bash
git log main..feature-dashboard
```

---

### 6.3 Track File History

```bash
git log --follow [file]
```

**What it does:** Shows the commits that changed a file, even across renames.

**When to use:** When tracking the history of a specific file.

**Why use it:** To see all changes made to a particular file over time.

**Example:**

```bash
git log --follow src/app.js
```

---

### 6.4 Show Branch Differences

```bash
git diff branchB...branchA
```

**What it does:** Shows the diff of what is in branchA that is not in branchB.

**When to use:** When you want to see the actual code differences between branches.

**Why use it:** To review what changes would be introduced by merging.

**Example:**

```bash
git diff main...feature-dashboard
```

---

### 6.5 Show Specific Commit

```bash
git show [SHA]
```

**What it does:** Shows any object in Git in human-readable format.

**When to use:** When you want to see details of a specific commit.

**Why use it:** To inspect the changes made in a particular commit.

**Example:**

```bash
git show a1b2c3d
```

---

## 7. Tracking Path Changes

Versioning file removes and path changes.

### 7.1 Remove File

```bash
git rm [file]
```

**What it does:** Deletes the file from project and stages the removal for commit.

**When to use:** When you want to delete a file and track that deletion.

**Why use it:** To remove files from version control properly.

**Example:**

```bash
git rm old-file.js
```

---

### 7.2 Move or Rename File

```bash
git mv [existing-path] [new-path]
```

**What it does:** Changes an existing file path and stages the move.

**When to use:** When renaming or moving files within your repository.

**Why use it:** To track file movements and renames in Git history.

**Example:**

```bash
git mv old-name.js new-name.js
git mv src/file.js lib/file.js
```

---

### 7.3 View Move History

```bash
git log --stat -M
```

**What it does:** Shows all commit logs with indication of any paths that moved.

**When to use:** When tracking file movements across commits.

**Why use it:** To see when and where files were moved or renamed.

---

## 8. Temporary Commits

Temporarily store modified, tracked files in order to change branches.

### 8.1 Stash Changes

```bash
git stash
```

**What it does:** Saves modified and staged changes temporarily.

**When to use:** When you need to switch branches but have uncommitted changes.

**Why use it:** To save your work without committing it.

**Example:**

```bash
git stash
git stash save "Work in progress on login feature"
```

---

### 8.2 List Stashes

```bash
git stash list
```

**What it does:** Lists stack-order of stashed file changes.

**When to use:** When you want to see what stashes you have saved.

**Why use it:** To manage multiple stashed changes.

---

### 8.3 Apply Stash

```bash
git stash pop
```

**What it does:** Writes working from top of stash stack and removes it from stash.

**When to use:** When you want to restore your stashed changes.

**Why use it:** To continue working on previously stashed changes.

**Example:**

```bash
git stash pop
```

---

### 8.4 Drop Stash

```bash
git stash drop
```

**What it does:** Discards the changes from top of stash stack.

**When to use:** When you no longer need the stashed changes.

**Why use it:** To clean up stashes you don't need anymore.

---

## 9. Rewrite History

Rewriting branches, updating commits and clearing history.

### 9.1 Rebase Branch

```bash
git rebase [branch]
```

**What it does:** Applies any commits of current branch ahead of specified one.

**When to use:** When you want to maintain a linear project history.

**Why use it:** To keep a clean, linear commit history.

**Example:**

```bash
git rebase main
```

---

### 9.2 Hard Reset

```bash
git reset --hard [commit]
```

**What it does:** Clears staging area and rewrites working tree from specified commit.

**When to use:** When you want to completely discard changes and reset to a previous state.

**Why use it:** To undo commits and all changes completely (use with caution).

**Example:**

```bash
git reset --hard HEAD~1  # Undo last commit
git reset --hard a1b2c3d  # Reset to specific commit
```

---

## 10. Ignoring Patterns

Preventing unintentional staging or committing of files.

### 10.1 Set Global Ignore File

```bash
git config --global core.excludesfile [file]
```

**What it does:** Sets a system-wide ignore pattern for all local repositories.

**When to use:** When you want to ignore certain files across all your projects.

**Why use it:** To automatically exclude files like OS-specific files or editor configs.

**Example:**

```bash
git config --global core.excludesfile ~/.gitignore_global
```

---

### 10.2 Create .gitignore File

Create a file named `.gitignore` in your project root with patterns to ignore:

```
# Logs
logs/
*.log

# Notes
*.notes

# Build files
dist/
build/

# Dependencies
node_modules/
vendor/

# Environment files
.env
.env.local

# IDE files
.vscode/
.idea/
```

**What it does:** Prevents specified files and folders from being tracked by Git.

**When to use:** When you have files that shouldn't be in version control.

**Why use it:** To keep sensitive data, build artifacts, and dependencies out of your repository.

---

## Quick Tips

### 1. Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

### 2. Amend Last Commit Message

```bash
git commit --amend -m "New commit message"
```

### 3. Create and Switch to New Branch

```bash
git checkout -b new-branch-name
```

### 4. Delete Local Branch

```bash
git branch -d branch-name
```

### 5. Delete Remote Branch

```bash
git push origin --delete branch-name
```

### 6. View Remote URLs

```bash
git remote -v
```

### 7. Discard Local Changes

```bash
git checkout -- filename  # Single file
git checkout .            # All files
```

### 8. View Compact Log

```bash
git log --oneline --graph --all
```

---

## Common Workflows

### Starting a New Feature

```bash
git checkout main
git pull origin main
git checkout -b feature-new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature-new-feature
```

### Updating Your Branch with Main

```bash
git checkout main
git pull origin main
git checkout feature-branch
git merge main
```

### Fixing Merge Conflicts

```bash
# After merge conflict occurs
# 1. Open conflicted files and resolve conflicts
# 2. Stage resolved files
git add resolved-file.js
# 3. Complete the merge
git commit -m "Resolve merge conflicts"
```

---

**Last Updated:** February 2026
