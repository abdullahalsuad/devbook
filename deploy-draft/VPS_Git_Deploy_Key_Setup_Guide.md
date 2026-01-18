# VPS Git Deploy Key Setup Guide

## Overview

This guide explains how to set up SSH deploy keys so you can pull from a **private GitHub repository** on your VPS without entering credentials every time. This is perfect for team projects where the repository is in an organization.

## Why Use Deploy Keys?

- ✅ Repository stays private
- ✅ No password needed for `git pull`
- ✅ Other team members unaffected
- ✅ VPS can only read (cannot push changes)
- ✅ Easy to revoke access if needed

---

## Prerequisites

- Access to your VPS via SSH
- A private GitHub repository (personal or organization)
- Admin access to the repository settings

---

## Step-by-Step Setup

### Step 1: Connect to Your VPS

Open your terminal and connect to your VPS:

```bash
ssh your-username@your-vps-ip
# Example: ssh root@192.168.1.100
```

Enter your password when prompted.

---

### Step 2: Navigate to Your Project Directory

Go to where your project is located:

```bash
cd /var/www/your-project-name
# Example: cd /var/www/your-project
```

**Tip:** Use `pwd` to see your current directory path.

---

### Step 3: Generate SSH Key Pair

Create a new SSH key specifically for deployment:

```bash
ssh-keygen -t ed25519 -C "vps-deployment" -f ~/.ssh/deploy_key
```

**When prompted:**

- `Enter passphrase (empty for no passphrase):` → Press **Enter** (leave empty)
- `Enter same passphrase again:` → Press **Enter** again

**What this does:**

- Creates a private key at `~/.ssh/deploy_key`
- Creates a public key at `~/.ssh/deploy_key.pub`
- The `-C "vps-deployment"` adds a comment for identification

---

### Step 4: Copy the Public Key

Display and copy the public key:

```bash
cat ~/.ssh/deploy_key.pub
```

**Output will look like:**

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJx... vps-deployment
```

**Select and copy the entire line** from `ssh-ed25519` to the end.

---

### Step 5: Add Deploy Key to GitHub

#### For Organization Repositories:

1. Go to your repository on GitHub: `https://github.com/organization-name/repo-name`
2. Click **Settings** tab (top menu)
3. In the left sidebar, click **Deploy keys**
4. Click **Add deploy key** button (green button, top right)
5. Fill in the form:
   - **Title:** `VPS Server` (or any descriptive name)
   - **Key:** Paste the public key you copied in Step 4
   - **Allow write access:** Leave this **UNCHECKED** ❌ (read-only is safer)
6. Click **Add key** button

#### For Personal Repositories:

Same steps as above, just navigate to your personal repo instead.

---

### Step 6: Configure SSH on VPS

Create or edit the SSH config file:

```bash
nano ~/.ssh/config
```

Add the following configuration:

```
Host github.com
    HostName github.com
    IdentityFile ~/.ssh/deploy_key
    IdentitiesOnly yes
```

**To save and exit nano:**

1. Press `Ctrl + X`
2. Press `Y` (yes to save)
3. Press `Enter` (confirm filename)

**What this does:**

- Tells SSH to use the `deploy_key` when connecting to `github.com`
- `IdentitiesOnly yes` ensures only this key is used

---

### Step 7: Set Correct File Permissions

Secure your SSH files with proper permissions:

```bash
chmod 600 ~/.ssh/deploy_key
chmod 600 ~/.ssh/config
```

**Why this matters:**

- SSH requires strict permissions on private keys
- `600` means only you (the owner) can read/write

---

### Step 8: Check Current Git Remote

View your current Git remote URL:

```bash
git remote -v
```

**Example output:**

```
origin  https://github.com/organization/your-project.git (fetch)
origin  https://github.com/organization/your-project.git (push)
```

Note the **organization name** and **repository name** from the URL.

---

### Step 9: Change Remote from HTTPS to SSH

Replace the HTTPS URL with SSH format:

```bash
git remote set-url origin git@github.com:organization-name/repo-name.git
```

**Example:**

```bash
git remote set-url origin git@github.com:organization/your-project.git
```

**Verify the change:**

```bash
git remote -v
```

Should now show:

```
origin  git@github.com:organization/your-project.git (fetch)
origin  git@github.com:organization/your-project.git (push)
```

---

### Step 10: Test SSH Connection

Test that SSH authentication works:

```bash
ssh -T git@github.com
```

**First time only:** You'll see:

```
The authenticity of host 'github.com (20.205.243.166)' can't be established.
ED25519 key fingerprint is SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Type `yes` and press Enter.

**Success message:**

```
Warning: Permanently added 'github.com' (ED25519) to the list of known hosts.
Hi organization-name/repo-name! You've successfully authenticated, but GitHub does not provide shell access.
```

✅ If you see this, SSH is working correctly!

---

### Step 11: Test Git Pull

Now test pulling from your repository:

```bash
git pull
```

**If up to date:**

```
Already up-to-date.
```

**If updates available:**

```
Updating abc123..def456
Fast-forward
 file.js | 10 +++++-----
 1 file changed, 5 insertions(+), 5 deletions(-)
```

🎉 **Success!** No password required!

---

## Daily Usage

From now on, whenever you need to update code on your VPS:

```bash
# Navigate to project
cd /var/www/your-project-name

# Pull latest changes
git pull

# Restart your application (if needed)
pm2 restart all
# or
systemctl restart your-service-name
```

---

## Troubleshooting

### Problem: Permission denied (publickey)

**Solution:** Make sure you completed Step 5 (added deploy key to GitHub)

```bash
# Test connection
ssh -T git@github.com

# Check if key exists
ls -la ~/.ssh/deploy_key*
```

---

### Problem: Host key verification failed

**Solution:** Accept GitHub's host key:

```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

---

### Problem: Still asking for password

**Cause:** Remote URL is still using HTTPS instead of SSH

**Solution:** Check and fix remote URL:

```bash
# Check current remote
git remote -v

# If still showing https://, change it
git remote set-url origin git@github.com:organization/repo.git
```

---

### Problem: fatal: Could not read from remote repository

**Possible causes:**

1. Deploy key not added to GitHub (Step 5)
2. SSH config not set up correctly (Step 6)
3. Wrong repository name in remote URL (Step 9)

**Solution:**

```bash
# Verify SSH connection works
ssh -T git@github.com

# Check remote URL is correct
git remote -v

# Check SSH config exists
cat ~/.ssh/config
```

---

## Security Best Practices

### 1. Use a Dedicated User (Not Root)

If you're currently using root, consider creating a dedicated deployment user:

```bash
# Create deploy user
adduser deploy

# Add to sudo group (if needed)
usermod -aG sudo deploy

# Change project ownership
chown -R deploy:deploy /var/www/your-project

# Switch to deploy user
su - deploy
```

Then repeat the setup steps as the `deploy` user.

---

### 2. Read-Only Access

Always leave **"Allow write access"** unchecked when adding the deploy key. Your VPS should only pull code, not push changes.

---

### 3. Revoke Access When Needed

If you need to remove VPS access:

1. Go to GitHub repository → Settings → Deploy keys
2. Find the deploy key (e.g., "VPS Server")
3. Click **Delete** button

The VPS will immediately lose access.

---

### 4. Use Different Keys for Different Servers

If you have multiple VPS servers, create separate deploy keys for each:

```bash
# Server 1
ssh-keygen -t ed25519 -C "vps-1-deployment" -f ~/.ssh/deploy_key_vps1

# Server 2
ssh-keygen -t ed25519 -C "vps-2-deployment" -f ~/.ssh/deploy_key_vps2
```

Update SSH config accordingly with different Host entries.

---

## Understanding SSH vs HTTPS

### HTTPS URL Format:

```
https://github.com/organization/repo.git
```

- Requires username and password/token
- Good for: Local development, temporary access

### SSH URL Format:

```
git@github.com:organization/repo.git
```

- Uses SSH keys for authentication
- Good for: Servers, automation, frequent access
- No password needed after setup

---

## Quick Reference Commands

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "vps-deployment" -f ~/.ssh/deploy_key

# View public key
cat ~/.ssh/deploy_key.pub

# Test SSH connection
ssh -T git@github.com

# Change remote to SSH
git remote set-url origin git@github.com:org/repo.git

# Check remote URL
git remote -v

# Pull code
git pull

# View SSH config
cat ~/.ssh/config

# Check file permissions
ls -la ~/.ssh/
```

---

## Additional Resources

- [GitHub Deploy Keys Documentation](https://docs.github.com/en/developers/overview/managing-deploy-keys)
- [SSH Key Generation Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [Git Remote Management](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)

---

## Summary

You've successfully set up SSH deploy keys! Your VPS can now pull from your private GitHub repository without any password prompts. This setup is:

- ✅ Secure (read-only access)
- ✅ Convenient (no password needed)
- ✅ Team-friendly (doesn't affect other developers)
- ✅ Easy to manage (can revoke anytime)

**Remember:** Always use `git pull` to update your code, and restart your application if needed!

---

ssh-keygen -t ed25519 -C "auction-admin-backend" -f ~/.ssh/auction_admin_backend_key -N ""
ssh-keygen -t ed25519 -C "auction-admin-frontend" -f ~/.ssh/auction_admin_frontend_key -N ""
ssh-keygen -t ed25519 -C "auction-gem-backend" -f ~/.ssh/auction_gem_backend_key -N ""
ssh-keygen -t ed25519 -C "auction-gem-frontend" -f ~/.ssh/auction_gem_frontend_key -N ""
