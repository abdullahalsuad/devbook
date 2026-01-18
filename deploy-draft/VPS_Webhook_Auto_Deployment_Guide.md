# VPS Webhook Auto-Deployment Setup Guide

## Overview

This guide shows you how to set up **automatic deployment** from a private GitHub repository to your VPS using webhooks. When you push code to GitHub, your VPS will automatically pull the changes, run migrations, build, and restart your application - all without any manual intervention.

## What You'll Achieve

- ✅ Push code to GitHub → Auto-deploy on VPS
- ✅ Works with private repositories
- ✅ 100% FREE (no GitHub Actions minutes used)
- ✅ Instant deployment (triggers within seconds)
- ✅ Clear success/failure notifications
- ✅ Works with NestJS, Prisma, PM2, and Nginx

---

## Architecture Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   GitHub    │────────>│   Webhook   │────────>│   Deploy    │
│  (Push/PR)  │  HTTP   │  Listener   │  Exec   │   Script    │
└─────────────┘         └─────────────┘         └─────────────┘
                              │                        │
                              │                        v
                              │                  ┌─────────────┐
                              │                  │  Git Pull   │
                              │                  │  Migrations │
                              │                  │  Build      │
                              v                  │  Restart    │
                        ┌─────────────┐         └─────────────┘
                        │  PM2 Logs   │
                        │ (Monitoring)│
                        └─────────────┘
```

---

## Prerequisites

Before starting, ensure you have:

- ✅ VPS with SSH access
- ✅ Private GitHub repository
- ✅ SSH Deploy Keys configured (see companion guide)
- ✅ Node.js and npm installed
- ✅ PM2 installed globally
- ✅ Git installed
- ✅ Your application already running on the VPS

---

## Part 1: Create Deployment Script

### Step 1: Navigate to Your Project

SSH into your VPS and go to your project directory:

```bash
cd /var/www/your-project-name
# Example: cd /var/www/Kotkoti-backend
```

---

### Step 2: Create deploy.sh Script

Create the deployment script:

```bash
nano deploy.sh
```

Paste this script (customize for your needs):

```bash
#!/bin/bash

# Exit immediately if any command fails
set -e

# Function to handle errors
handle_error() {
    echo "❌ ERROR: Deployment failed at step: $1"
    exit 1
}

echo "=========================================="
echo "🚀 DEPLOYMENT STARTED: $(date)"
echo "=========================================="

# Navigate to project directory
cd /var/www/Kotkoti-backend || handle_error "Navigate to project"

# Pull latest code from main branch
echo "📥 Pulling latest code..."
git pull origin main || handle_error "Git pull"

# Install/update dependencies (if package.json changed)
# Uncomment if you want to always update dependencies
# echo "📦 Installing dependencies..."
# npm install || handle_error "NPM install"

# Run Prisma migrations (for database changes)
echo "🗄️  Running Prisma migrations..."
npx prisma migrate deploy || handle_error "Prisma migrations"

# Generate Prisma client (update ORM types)
echo "⚙️  Generating Prisma client..."
npx prisma generate || handle_error "Prisma generate"

# Build NestJS application (compile TypeScript)
echo "🔨 Building NestJS application..."
npm run build || handle_error "Build"

# Restart PM2 application
echo "🔄 Restarting PM2 application..."
pm2 restart kotkoti-backend || handle_error "PM2 restart"

# Restart Nginx (reload configuration)
echo "🌐 Restarting Nginx..."
sudo systemctl restart nginx || handle_error "Nginx restart"

echo "=========================================="
echo "✅ DEPLOYMENT COMPLETED: $(date)"
echo "=========================================="

# Show last 20 lines of application logs
echo "📋 Recent application logs:"
pm2 logs kotkoti-backend --lines 20 --nostream

exit 0
```

**Customization points:**

- Line 17: Change `/var/www/Kotkoti-backend` to your project path
- Line 22: Change `main` if you use a different default branch (e.g., `master`)
- Line 27-29: Uncomment if you want to run `npm install` on every deploy
- Line 42: Change `kotkoti-backend` to your PM2 app name
- Line 52: Change `kotkoti-backend` to your PM2 app name

**Save and exit:**

- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

### Step 3: Make Script Executable

```bash
chmod +x deploy.sh
```

---

### Step 4: Test the Script Manually

Before automating, test that it works:

```bash
./deploy.sh
```

**Expected output:**

```
==========================================
🚀 DEPLOYMENT STARTED: Sat Jan 10 17:30:00 2026
==========================================
📥 Pulling latest code...
Already up to date.
🗄️  Running Prisma migrations...
...
✅ DEPLOYMENT COMPLETED: Sat Jan 10 17:30:45 2026
==========================================
```

If you see `✅ DEPLOYMENT COMPLETED`, you're good! ✅

If any errors occur, fix them before proceeding.

---

## Part 2: Create Webhook Listener

### Step 5: Create webhook-server.js

Create a Node.js server to listen for GitHub webhooks:

```bash
nano webhook-server.js
```

Paste this code:

```javascript
const http = require("http");
const crypto = require("crypto");
const { exec } = require("child_process");

// ============================================
// CONFIGURATION - Change these values
// ============================================
const PORT = 9000; // Port for webhook listener
const SECRET = "CHANGE-THIS-TO-YOUR-SECRET-KEY"; // Will generate in next step
const DEPLOY_SCRIPT = "/var/www/Kotkoti-backend/deploy.sh"; // Path to your deploy script

// ============================================
// WEBHOOK SERVER
// ============================================
const server = http.createServer((req, res) => {
  // Only accept POST requests to /webhook
  if (req.method === "POST" && req.url === "/webhook") {
    let body = "";

    // Collect request body
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      // Verify GitHub signature for security
      const signature = req.headers["x-hub-signature-256"];

      if (!signature) {
        console.log("❌ No signature provided");
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No signature" }));
        return;
      }

      // Calculate expected signature
      const hmac = crypto.createHmac("sha256", SECRET);
      const digest = "sha256=" + hmac.update(body).digest("hex");

      // Verify signature matches
      if (signature === digest) {
        const payload = JSON.parse(body);
        const branch = payload.ref ? payload.ref.split("/").pop() : "unknown";
        const commitMessage = payload.head_commit
          ? payload.head_commit.message
          : "No message";
        const pusher = payload.pusher ? payload.pusher.name : "Unknown";

        // Log deployment info
        const deployTime = new Date().toISOString();
        console.log(`\n========================================`);
        console.log(`🚀 DEPLOYMENT TRIGGERED`);
        console.log(`========================================`);
        console.log(`⏰ Time: ${deployTime}`);
        console.log(`🌿 Branch: ${branch}`);
        console.log(`👤 Pushed by: ${pusher}`);
        console.log(`💬 Commit: ${commitMessage.substring(0, 60)}`);
        console.log(`========================================\n`);

        // Execute deployment script
        exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`\n========================================`);
            console.error(`❌ DEPLOYMENT FAILED`);
            console.error(`========================================`);
            console.error(`Error: ${error.message}`);
            console.error(`Exit code: ${error.code}`);
            console.error(`========================================\n`);
            return;
          }

          console.log(`\n========================================`);
          console.log(`✅ DEPLOYMENT SUCCESS`);
          console.log(`========================================`);
          console.log(stdout);
          console.log(`========================================\n`);

          if (stderr) {
            console.log("ℹ️  Additional info:", stderr);
          }
        });

        // Send success response to GitHub
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Deployment started",
            branch: branch,
            commit: commitMessage.substring(0, 60),
          })
        );
      } else {
        // Invalid signature - reject
        console.log("❌ Invalid signature - possible security threat");
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid signature" }));
      }
    });
  } else {
    // Handle other requests
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🎣 Webhook Server Started`);
  console.log(`========================================`);
  console.log(`📡 Listening on port: ${PORT}`);
  console.log(`🔐 Secret configured: Yes`);
  console.log(`📂 Deploy script: ${DEPLOY_SCRIPT}`);
  console.log(`========================================\n`);
});

// Handle server errors
server.on("error", (err) => {
  console.error("❌ Server error:", err);
  process.exit(1);
});
```

**Customization points:**

- Line 8: Change port if 9000 is already in use
- Line 9: Will update with secret key in next step
- Line 10: Change to your deploy script path

**Save and exit** (Ctrl+X, Y, Enter)

---

### Step 6: Generate Secret Key

Generate a secure random secret for webhook authentication:

```bash
openssl rand -hex 32
```

**Example output:**

```
a3f5b9c2e8d4f1a7b6c9e2d5f8a1b4c7e9d2f5a8b1c4e7d0f3a6b9c2e5d8f1a4
```

**Copy this entire string!** You'll need it in the next steps.

---

### Step 7: Update Secret in webhook-server.js

Edit the webhook server:

```bash
nano webhook-server.js
```

Find line 9:

```javascript
const SECRET = "CHANGE-THIS-TO-YOUR-SECRET-KEY";
```

Replace with your generated secret:

```javascript
const SECRET =
  "a3f5b9c2e8d4f1a7b6c9e2d5f8a1b4c7e9d2f5a8b1c4e7d0f3a6b9c2e5d8f1a4";
```

**Save and exit** (Ctrl+X, Y, Enter)

**IMPORTANT:** Keep this secret safe! Don't commit it to your repository.

---

### Step 8: Start Webhook Listener with PM2

Start the webhook server using PM2:

```bash
pm2 start webhook-server.js --name webhook-listener
```

Save PM2 configuration:

```bash
pm2 save
```

Verify it's running:

```bash
pm2 status
```

**Expected output:**

```
┌────┬─────────────────────┬─────────┬─────────┬──────────┐
│ id │ name                │ mode    │ pid     │ status   │
├────┼─────────────────────┼─────────┼─────────┼──────────┤
│ 0  │ kotkoti-backend     │ fork    │ 123456  │ online   │
│ 1  │ webhook-listener    │ fork    │ 123457  │ online   │
└────┴─────────────────────┴─────────┴─────────┴──────────┘
```

Both should show `online` ✅

---

### Step 9: Configure PM2 Startup

Ensure PM2 restarts on server reboot:

```bash
pm2 startup
```

Copy and run the command it outputs (it will look like):

```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
```

Then save:

```bash
pm2 save
```

---

### Step 10: Open Firewall Port

Allow incoming connections on port 9000:

```bash
# For UFW firewall
sudo ufw allow 9000

# For firewalld
sudo firewall-cmd --permanent --add-port=9000/tcp
sudo firewall-cmd --reload

# For iptables
sudo iptables -A INPUT -p tcp --dport 9000 -j ACCEPT
sudo iptables-save
```

Verify port is open:

```bash
sudo netstat -tlnp | grep 9000
```

Should show Node.js listening on port 9000.

---

## Part 3: Configure GitHub Webhook

### Step 11: Add Webhook to GitHub Repository

1. Go to your GitHub repository: `https://github.com/your-org/your-repo`
2. Click **Settings** (top menu bar)
3. In left sidebar, click **Webhooks**
4. Click **Add webhook** button (green button, top right)

---

### Step 12: Configure Webhook Settings

Fill in the webhook form:

**Payload URL:**

```
http://YOUR-VPS-IP:9000/webhook
```

Replace `YOUR-VPS-IP` with your actual VPS IP address.

**Example:** `http://192.168.1.100:9000/webhook`

**Content type:**

- Select: `application/json`

**Secret:**

- Paste the secret key you generated in Step 6

**SSL verification:**

- Keep: `Enable SSL verification` (if using HTTPS)
- Or: `Disable SSL verification` (if using HTTP with IP)

**Which events would you like to trigger this webhook?**

- Select: `Just the push event` ✅

**Active:**

- Check: ✅ `Active`

Click **Add webhook** button.

---

### Step 13: Verify Webhook

After adding, GitHub will send a test ping.

**Check the webhook status:**

1. Go back to Settings → Webhooks
2. Click on your webhook
3. Scroll to **Recent Deliveries**
4. You should see a ✅ green checkmark

If you see ❌ red X:

- Check your VPS IP is correct
- Verify port 9000 is open
- Check webhook-listener is running: `pm2 status`

---

## Part 4: Testing and Monitoring

### Step 14: Test Auto-Deployment

Make a test deployment:

1. **On your local machine, make a small change:**

   ```bash
   echo "// Test auto-deploy" >> src/main.ts
   git add .
   git commit -m "test: auto-deploy webhook"
   git push origin main
   ```

2. **On your VPS, watch the logs:**
   ```bash
   pm2 logs webhook-listener --lines 50
   ```

**You should see:**

```
========================================
🚀 DEPLOYMENT TRIGGERED
========================================
⏰ Time: 2026-01-10T17:30:00.000Z
🌿 Branch: main
👤 Pushed by: your-username
💬 Commit: test: auto-deploy webhook
========================================

========================================
🚀 DEPLOYMENT STARTED: Sat Jan 10 17:30:01 2026
========================================
📥 Pulling latest code...
🗄️  Running Prisma migrations...
⚙️  Generating Prisma client...
🔨 Building NestJS application...
🔄 Restarting PM2 application...
🌐 Restarting Nginx...
========================================
✅ DEPLOYMENT COMPLETED: Sat Jan 10 17:30:45 2026
========================================
```

If you see `✅ DEPLOYMENT SUCCESS` - **Congratulations!** 🎉

---

### Step 15: Monitor Deployments

#### Real-time Monitoring

Watch logs live:

```bash
pm2 logs webhook-listener
```

Press `Ctrl+C` to stop watching.

#### Check Recent Deployments

View last 50 lines:

```bash
pm2 logs webhook-listener --lines 50 --nostream
```

#### Check Specific Deployment Status

Search for success/failure:

```bash
pm2 logs webhook-listener --lines 100 --nostream | grep "DEPLOYMENT"
```

#### Check Application Logs

If deployment succeeds but app has issues:

```bash
pm2 logs kotkoti-backend --lines 50
```

#### Check All PM2 Processes

```bash
pm2 status
```

---

## Common Workflows

### Workflow 1: Regular Development

```
Developer → Push to feature branch → Create PR → Review → Merge to main → Auto-deploy ✅
```

### Workflow 2: Hotfix

```
Developer → Push directly to main → Auto-deploy ✅
```

### Workflow 3: Rollback

If deployment breaks something:

```bash
# SSH into VPS
cd /var/www/Kotkoti-backend

# Check recent commits
git log --oneline -10

# Rollback to previous commit
git reset --hard COMMIT_HASH

# Run deployment manually
./deploy.sh
```

---

## Troubleshooting

### Problem: Webhook not triggering

**Symptoms:** Push to GitHub but nothing happens on VPS.

**Solutions:**

1. **Check webhook listener is running:**

   ```bash
   pm2 status
   ```

   If `webhook-listener` shows `stopped`, restart it:

   ```bash
   pm2 restart webhook-listener
   ```

2. **Check GitHub webhook deliveries:**

   - Go to GitHub → Settings → Webhooks
   - Click your webhook
   - Check "Recent Deliveries"
   - If shows errors, check the error message

3. **Verify firewall allows port 9000:**

   ```bash
   sudo netstat -tlnp | grep 9000
   ```

4. **Check webhook logs:**
   ```bash
   pm2 logs webhook-listener --lines 100
   ```

---

### Problem: Deployment fails at specific step

**Symptoms:** See `❌ DEPLOYMENT FAILED` in logs.

**Solutions:**

1. **Check which step failed:**

   ```bash
   pm2 logs webhook-listener --lines 50 --nostream
   ```

2. **Test deployment manually:**

   ```bash
   cd /var/www/Kotkoti-backend
   ./deploy.sh
   ```

   This shows exactly where it fails.

3. **Common failures:**

   **Git pull fails:**

   - Check SSH keys are configured
   - Verify: `git pull origin main` works manually

   **Prisma migrations fail:**

   - Check database is accessible
   - Verify: `npx prisma migrate deploy` works manually

   **Build fails:**

   - Check for TypeScript errors
   - Run: `npm run build` manually to see errors

   **PM2 restart fails:**

   - Check PM2 app name is correct
   - Verify: `pm2 list` shows your app

---

### Problem: Invalid signature error

**Symptoms:** Logs show `❌ Invalid signature`.

**Cause:** Secret mismatch between GitHub and VPS.

**Solution:**

1. **Regenerate secret:**

   ```bash
   openssl rand -hex 32
   ```

2. **Update webhook-server.js:**

   ```bash
   nano webhook-server.js
   ```

   Update the `SECRET` constant.

3. **Update GitHub webhook:**

   - Go to GitHub → Settings → Webhooks
   - Edit webhook
   - Update Secret field
   - Save

4. **Restart webhook listener:**
   ```bash
   pm2 restart webhook-listener
   ```

---

### Problem: Port 9000 already in use

**Symptoms:** Error when starting webhook-listener.

**Solution:**

1. **Find what's using the port:**

   ```bash
   sudo lsof -i :9000
   ```

2. **Option A - Stop the other process:**

   ```bash
   sudo kill -9 PID
   ```

3. **Option B - Use a different port:**
   - Edit `webhook-server.js`, change `PORT = 9000` to `PORT = 9001`
   - Update firewall: `sudo ufw allow 9001`
   - Update GitHub webhook URL to use new port
   - Restart: `pm2 restart webhook-listener`

---

### Problem: Deployment succeeds but app doesn't work

**Symptoms:** See `✅ DEPLOYMENT SUCCESS` but app has errors.

**Solution:**

1. **Check application logs:**

   ```bash
   pm2 logs kotkoti-backend --lines 100
   ```

2. **Check if app is running:**

   ```bash
   pm2 status
   ```

3. **Restart app manually:**

   ```bash
   pm2 restart kotkoti-backend
   ```

4. **Check Nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

---

## Security Best Practices

### 1. Use Strong Secret Keys

Always generate secrets with:

```bash
openssl rand -hex 32
```

Never use simple passwords like `"mysecret123"`.

---

### 2. Restrict Firewall Rules

Only allow webhook port from GitHub IPs (optional, advanced):

```bash
# Get GitHub webhook IPs
curl https://api.github.com/meta | jq .hooks

# Allow only those IPs
sudo ufw allow from 192.30.252.0/22 to any port 9000
```

---

### 3. Use HTTPS (Recommended)

For production, use a reverse proxy with SSL:

**Install Certbot:**

```bash
sudo apt install certbot python3-certbot-nginx
```

**Get SSL certificate:**

```bash
sudo certbot --nginx -d yourdomain.com
```

**Update Nginx to proxy webhook:**

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    location /webhook {
        proxy_pass http://localhost:9000/webhook;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Update GitHub webhook URL to:**

```
https://yourdomain.com/webhook
```

---

### 4. Run as Non-Root User

Create dedicated deployment user:

```bash
# Create user
sudo adduser deploy

# Add to required groups
sudo usermod -aG sudo deploy
sudo usermod -aG www-data deploy

# Transfer project ownership
sudo chown -R deploy:deploy /var/www/Kotkoti-backend

# Switch to deploy user
su - deploy

# Repeat all setup steps as this user
```

---

### 5. Monitor Failed Deployments

Set up alerts for failed deployments (optional):

**Create monitoring script:**

```bash
nano /var/www/monitor-deploy.sh
```

```bash
#!/bin/bash

# Check for failed deployments in last 10 lines
if pm2 logs webhook-listener --lines 10 --nostream | grep -q "DEPLOYMENT FAILED"; then
    # Send alert (email, Slack, etc.)
    echo "Deployment failed at $(date)" | mail -s "Deployment Alert" admin@yourdomain.com
fi
```

**Add to crontab:**

```bash
crontab -e
```

Add:

```
*/5 * * * * /var/www/monitor-deploy.sh
```

---

## Advanced Configurations

### Deploy to Different Branches

To deploy `dev` branch to staging:

**Update webhook-server.js:**

```javascript
// After line 49, add branch check:
if (branch === 'main') {
    exec(`bash /var/www/production/deploy.sh`, ...);
} else if (branch === 'dev') {
    exec(`bash /var/www/staging/deploy.sh`, ...);
} else {
    console.log(`ℹ️  Branch ${branch} - No deployment configured`);
    return;
}
```

**Update GitHub webhook:**

- Change "Just the push event" to "Let me select individual events"
- Check: "Pushes"
- Save

---

### Add Deployment Notifications

**Slack notifications:**

Install webhook:

```bash
npm install @slack/webhook
```

Add to webhook-server.js:

```javascript
const { IncomingWebhook } = require("@slack/webhook");
const slackWebhook = new IncomingWebhook("YOUR_SLACK_WEBHOOK_URL");

// After successful deployment:
slackWebhook.send({
  text: `✅ Deployment successful! Branch: ${branch}, Commit: ${commitMessage}`,
});
```

---

### Backup Before Deployment

Add to deploy.sh before git pull:

```bash
# Create backup
echo "💾 Creating backup..."
BACKUP_DIR="/var/backups/kotkoti-backend"
mkdir -p $BACKUP_DIR
tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" \
    --exclude='node_modules' \
    --exclude='.git' \
    /var/www/Kotkoti-backend

# Keep only last 5 backups
cd $BACKUP_DIR && ls -t | tail -n +6 | xargs -r rm
```

---

## Maintenance

### Update Dependencies

Periodically update the webhook system:

```bash
# Update Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt update && sudo apt upgrade -y

# Update PM2
npm install -g pm2@latest
pm2 update
```

---

### Clean Up Logs

PM2 logs can grow large over time:

```bash
# Install log rotation
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

### Backup Webhook Configuration

Save your configuration:

```bash
# Backup files
mkdir -p ~/webhook-backup
cp /var/www/Kotkoti-backend/deploy.sh ~/webhook-backup/
cp /var/www/Kotkoti-backend/webhook-server.js ~/webhook-backup/
cp ~/.ssh/config ~/webhook-backup/

# Note: Don't backup secret keys in version control!
```

---

## Quick Reference Commands

```bash
# Start webhook listener
pm2 start webhook-server.js --name webhook-listener

# Stop webhook listener
pm2 stop webhook-listener

# Restart webhook listener
pm2 restart webhook-listener

# View webhook logs (live)
pm2 logs webhook-listener

# View webhook logs (last 50 lines)
pm2 logs webhook-listener --lines 50 --nostream

# View all PM2 processes
pm2 status

# Manual deployment
cd /var/www/Kotkoti-backend && ./deploy.sh

# Check webhook server is listening
sudo netstat -tlnp | grep 9000

# Test git pull manually
cd /var/www/Kotkoti-backend && git pull origin main

# Check recent commits
git log --oneline -10

# Rollback to previous commit
git reset --hard COMMIT_HASH && ./deploy.sh

# Check firewall rules
sudo ufw status

# Save PM2 configuration
pm2 save

# Resurrect PM2 processes after reboot
pm2 resurrect
```

---

## Summary

You now have a fully automated deployment pipeline:

1. ✅ **Developer pushes code** → Automatic deployment
2. ✅ **Works with private repos** → Using SSH keys
3. ✅ **100% FREE** → No GitHub Actions costs
4. ✅ **Instant** → Deploys within seconds
5. ✅ **Monitored** → Clear success/failure logs
6. ✅ **Secure** → Webhook signature verification
7. ✅ **Reliable** → Automatic restarts with PM2

**Workflow:**

```
Push → GitHub Webhook → VPS Listener → Run deploy.sh → Success! 🎉
```

**Key Files:**

- `/var/www/Kotkoti-backend/deploy.sh` - Deployment script
- `/var/www/Kotkoti-backend/webhook-server.js` - Webhook listener
- `~/.ssh/deploy_key` - SSH authentication
- `~/.ssh/config` - SSH configuration

**Monitoring:**

```bash
pm2 logs webhook-listener  # Watch deployments
pm2 status                 # Check all processes
pm2 logs kotkoti-backend   # Check application
```

---

## Additional Resources

- [GitHub Webhooks Documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [NestJS Deployment Guide](https://docs.nestjs.com/faq/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

---

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review logs: `pm2 logs webhook-listener --lines 100`
3. Test manually: `./deploy.sh`
4. Verify webhook deliveries in GitHub settings
5. Check firewall and port configuration

---

**Happy Deploying! 🚀**

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const { exec } = require('child_process');

// ===================== CONFIGURATION =====================
const PORT = 9000; // Backend port
const SECRET = '195413626cb92d2e198ee449ccbc19d2131b61c7e67ac71ec85f12b3ad74eabc';
const DEPLOY_SCRIPT = '/var/www/Kotkoti-backend/deploy.sh'; // Backend deploy script
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1459826999299280980/vhJ34GEMxN4vkKXKrM7F1a-zO_I6vSi8JbZXzVOrPw24ueGfrIG6N028N1LeC0ViBFBI';

// ===================== DISCORD NOTIFICATION =====================
function sendDiscordNotification(title, description, color, fields = []) {
if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL.includes('YOUR_WEBHOOK')) {
console.log('Discord webhook not configured, skipping notification');
return;
}

    const webhookURL = new URL(DISCORD_WEBHOOK_URL);

    const payload = JSON.stringify({
        embeds: [{
            title,
            description,
            color,
            fields,
            timestamp: new Date().toISOString(),
            footer: { text: 'VPS Deploy Bot - Backend' }
        }]
    });

    const options = {
        hostname: webhookURL.hostname,
        path: webhookURL.pathname + webhookURL.search,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const req = https.request(options, (res) => {
        if (res.statusCode === 204) {
            console.log('Discord notification sent');
        } else {
            console.log(`Discord notification failed: ${res.statusCode}`);
        }
    });

    req.on('error', (err) => console.error('Discord notification error:', err.message));
    req.write(payload);
    req.end();

}

// ===================== WEBHOOK SERVER =====================
const server = http.createServer((req, res) => {
if (req.method === 'POST' && req.url === '/webhook') {
let body = '';

        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const signature = req.headers['x-hub-signature-256'];
            if (!signature) {
                console.log('No signature provided');
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'No signature' }));
            }

            const hmac = crypto.createHmac('sha256', SECRET);
            const digest = 'sha256=' + hmac.update(body).digest('hex');

            if (signature !== digest) {
                console.log('Invalid signature');
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid signature' }));
            }

            const payload = JSON.parse(body);
            const branch = payload.ref ? payload.ref.split('/').pop() : 'unknown';
            const commitMessage = payload.head_commit ? payload.head_commit.message : 'No message';
            const pusher = payload.pusher ? payload.pusher.name : 'Unknown';

            console.log(`\n----------------------------------------`);
            console.log(`WEBHOOK RECEIVED (Backend)`);
            console.log(`Time: ${new Date().toISOString()}`);
            console.log(`Branch: ${branch}`);
            console.log(`Pushed by: ${pusher}`);
            console.log(`Commit: ${commitMessage.substring(0, 60)}`);
            console.log(`----------------------------------------\n`);

            // Only deploy on main/master
            if (branch !== 'main' && branch !== 'master') {
                console.log(`Branch "${branch}" ignored (not main/master)\n`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Branch ignored', branch }));
            }

            sendDiscordNotification(
                'Backend Deployment Started',
                'Backend deployment process initiated...',
                15105570,
                [
                    { name: 'Branch', value: branch, inline: true },
                    { name: 'Pusher', value: pusher, inline: true },
                    { name: 'Commit', value: commitMessage.substring(0, 100) }
                ]
            );

            exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
                if (error) {
                    console.error('DEPLOYMENT FAILED', error);
                    sendDiscordNotification(
                        'Backend Deployment Failed',
                        'Backend deployment failed!',
                        15158332,
                        [
                            { name: 'Branch', value: branch, inline: true },
                            { name: 'Pusher', value: pusher, inline: true },
                            { name: 'Commit', value: commitMessage.substring(0, 100) },
                            { name: 'Error', value: error.message.substring(0, 1000) }
                        ]
                    );
                    return;
                }

                console.log('DEPLOYMENT SUCCESS\n', stdout);
                sendDiscordNotification(
                    'Backend Deployment Successful',
                    'Backend deployed successfully!',
                    3066993,
                    [
                        { name: 'Branch', value: branch, inline: true },
                        { name: 'Pusher', value: pusher, inline: true },
                        { name: 'Commit', value: commitMessage.substring(0, 100) },
                        { name: 'Status', value: 'Build completed and backend restarted' }
                    ]
                );

                if (stderr) console.log('Additional info:', stderr);
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Deployment started', branch, commit: commitMessage.substring(0, 60) }));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }

});

// ===================== START SERVER =====================
server.listen(PORT, () => {
console.log('----------------------------------------');
console.log('Webhook Server Started (Backend)');
console.log(`Listening on port: ${PORT}`);
console.log(`Secret configured: Yes`);
console.log(`Deploy script: ${DEPLOY_SCRIPT}`);
console.log(`Discord notifications: Enabled`);
console.log(`Deploy branches: main, master`);
console.log('----------------------------------------\n');
});

server.on('error', (err) => {
console.error('Server error:', err);
process.exit(1);
});

#!/bin/bash
set -e

LOCKFILE="/tmp/kotkoti-backend.deploy.lock"

handle_error() {
echo "ERROR: Deployment failed at step: $1"
    rm -f "$LOCKFILE"
exit 1
}

# Prevent concurrent deploys

if [ -f "$LOCKFILE" ]; then
echo "Deployment already running. Exiting."
exit 0
fi

touch "$LOCKFILE"
trap 'rm -f "$LOCKFILE"' EXIT

echo "=========================================="
echo "DEPLOYMENT STARTED: $(date)"
echo "=========================================="

cd /var/www/Kotkoti-backend || handle_error "Navigate to project"

echo "Fetching latest code safely..."
git fetch origin || handle_error "Git fetch"

echo "Resetting to origin/main (safe, no conflicts)..."
git reset --hard origin/main || handle_error "Git reset"

echo "Installing dependencies (npm ci)..."
npm ci || handle_error "npm ci"

echo "Running Prisma migrations..."
npx prisma migrate deploy || handle_error "Prisma migrations"

echo "Generating Prisma client..."
npx prisma generate || handle_error "Prisma generate"

echo "Building NestJS application..."
npm run build || handle_error "Build"

echo "Restarting PM2 application..."
pm2 restart kotkoti-backend || handle_error "PM2 restart"

echo "=========================================="
echo "DEPLOYMENT COMPLETED: $(date)"
echo "=========================================="

pm2 logs kotkoti-backend --lines 20 --nostream
exit 0
