# Discord Deployment Alerts Setup Guide

## Overview

This guide shows you how to set up **real-time Discord notifications** for your VPS deployments. Get instant alerts in your Discord server whenever code is deployed, whether it succeeds or fails - without needing to SSH into your server.

## What You'll Achieve

- ✅ **Instant notifications** when deployments start, succeed, or fail
- ✅ **Rich embedded messages** with deployment details
- ✅ **Team visibility** - everyone sees deployment status
- ✅ **No VPS access needed** - monitor from Discord mobile app
- ✅ **Deployment history** - scroll through Discord for past deploys

---

## Notification Types

Your Discord channel will receive three types of notifications:

### 1. 🚀 Deployment Started (Orange)

Triggered immediately when code is pushed to GitHub.

**Includes:**

- Branch name
- Who pushed the code
- Commit message

### 2. ✅ Deployment Successful (Green)

Triggered when deployment completes successfully.

**Includes:**

- Branch name
- Who pushed the code
- Commit message
- Confirmation that all services restarted

### 3. ❌ Deployment Failed (Red)

Triggered if any step of deployment fails.

**Includes:**

- Branch name
- Who pushed the code
- Commit message
- Error details (what went wrong)

---

## Prerequisites

Before starting, ensure you have:

- ✅ Discord server where you have admin permissions
- ✅ Webhook auto-deployment already set up (see companion guide)
- ✅ VPS with SSH access
- ✅ `webhook-server.js` already running via PM2

---

## Part 1: Create Discord Webhook

### Step 1: Open Discord Server Settings

1. Open your Discord server
2. Click the server name (top left)
3. Select **Server Settings**

---

### Step 2: Navigate to Integrations

1. In the left sidebar, click **Integrations**
2. Click **Webhooks** (or **View Webhooks** if you already have some)

---

### Step 3: Create New Webhook

1. Click **New Webhook** button (top right)
2. A new webhook appears with a default name like "Spidey Bot"

---

### Step 4: Configure Webhook

**Name:**

- Change to: `Deploy Bot` or `VPS Deployments`

**Channel:**

- Select the channel where you want notifications
- Recommended: Create a dedicated `#deployments` or `#deploy-alerts` channel
- Click the dropdown and select your channel

**Avatar (Optional):**

- Click the webhook icon to upload a custom avatar
- Suggested: Use a rocket 🚀 or server icon

---

### Step 5: Copy Webhook URL

1. Click **Copy Webhook URL** button
2. Save this URL somewhere safe (you'll need it in the next step)

**Example URL:**

```
https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

**Important:** Keep this URL private! Anyone with this URL can send messages to your Discord channel.

---

### Step 6: Save Webhook

Click **Save Changes** at the bottom of the page.

Your webhook is now created! ✅

---

## Part 2: Update VPS Configuration

### Step 7: SSH into Your VPS

```bash
ssh root@your-vps-ip
# Or: ssh your-username@your-vps-ip
```

---

### Step 8: Navigate to Project Directory

```bash
cd /var/www/Kotkoti-backend
# Or your actual project path
```

---

### Step 9: Edit webhook-server.js

```bash
nano webhook-server.js
```

---

### Step 10: Add Discord Webhook URL

Find this line near the top (around line 13):

```javascript
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN";
```

**Replace it with your actual Discord webhook URL** from Step 5:

```javascript
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/123456789012345678/abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
```

**Save and exit:**

- Press `Ctrl + X`
- Press `Y` (yes to save)
- Press `Enter` (confirm filename)

---

### Step 11: Verify Full webhook-server.js Code

Make sure your `webhook-server.js` looks like this (complete file):

```javascript
const http = require("http");
const https = require("https");
const crypto = require("crypto");
const { exec } = require("child_process");

// ============================================
// CONFIGURATION
// ============================================
const PORT = 9000;
const SECRET = "your-secret-key-here"; // Your actual secret
const DEPLOY_SCRIPT = "/var/www/Kotkoti-backend/deploy.sh";

// Discord webhook URL - ADD YOUR ACTUAL WEBHOOK URL HERE
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN";

// ============================================
// DISCORD NOTIFICATION FUNCTION
// ============================================
function sendDiscordNotification(title, description, color, fields = []) {
  // Skip if no Discord webhook configured
  if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL.includes("YOUR_WEBHOOK")) {
    console.log("⚠️  Discord webhook not configured, skipping notification");
    return;
  }

  const webhookURL = new URL(DISCORD_WEBHOOK_URL);

  const payload = JSON.stringify({
    embeds: [
      {
        title: title,
        description: description,
        color: color, // Green: 3066993, Red: 15158332, Orange: 15105570
        fields: fields,
        timestamp: new Date().toISOString(),
        footer: {
          text: "VPS Deploy Bot",
        },
      },
    ],
  });

  const options = {
    hostname: webhookURL.hostname,
    path: webhookURL.pathname + webhookURL.search,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
    },
  };

  const req = https.request(options, (res) => {
    if (res.statusCode === 204) {
      console.log("✅ Discord notification sent");
    } else {
      console.log(`⚠️ Discord notification failed: ${res.statusCode}`);
    }
  });

  req.on("error", (error) => {
    console.error("❌ Discord notification error:", error.message);
  });

  req.write(payload);
  req.end();
}

// ============================================
// WEBHOOK SERVER
// ============================================
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/webhook") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      // Verify signature
      const signature = req.headers["x-hub-signature-256"];

      if (!signature) {
        console.log("❌ No signature provided");
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No signature" }));
        return;
      }

      const hmac = crypto.createHmac("sha256", SECRET);
      const digest = "sha256=" + hmac.update(body).digest("hex");

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

        // Send Discord notification for deployment start
        sendDiscordNotification(
          "🚀 Deployment Started",
          "Deployment process initiated...",
          15105570, // Orange color
          [
            { name: "🌿 Branch", value: branch, inline: true },
            { name: "👤 Pushed by", value: pusher, inline: true },
            { name: "💬 Commit", value: commitMessage.substring(0, 100) },
          ]
        );

        // Run deployment script
        exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`\n========================================`);
            console.error(`❌ DEPLOYMENT FAILED`);
            console.error(`========================================`);
            console.error(`Error: ${error.message}`);
            console.error(`Exit code: ${error.code}`);
            console.error(`========================================\n`);

            // Send Discord notification for failure
            sendDiscordNotification(
              "❌ Deployment Failed",
              "Deployment to production server failed!",
              15158332, // Red color
              [
                { name: "🌿 Branch", value: branch, inline: true },
                { name: "👤 Pushed by", value: pusher, inline: true },
                { name: "💬 Commit", value: commitMessage.substring(0, 100) },
                { name: "❗ Error", value: error.message.substring(0, 1000) },
              ]
            );

            return;
          }

          console.log(`\n========================================`);
          console.log(`✅ DEPLOYMENT SUCCESS`);
          console.log(`========================================`);
          console.log(stdout);
          console.log(`========================================\n`);

          // Send Discord notification for success
          sendDiscordNotification(
            "✅ Deployment Successful",
            "New changes deployed to production server!",
            3066993, // Green color
            [
              { name: "🌿 Branch", value: branch, inline: true },
              { name: "👤 Pushed by", value: pusher, inline: true },
              { name: "💬 Commit", value: commitMessage.substring(0, 100) },
              {
                name: "⏱️ Status",
                value: "All services restarted successfully",
              },
            ]
          );

          if (stderr) {
            console.log("ℹ️  Additional info:", stderr);
          }
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Deployment started",
            branch: branch,
            commit: commitMessage.substring(0, 60),
          })
        );
      } else {
        console.log("❌ Invalid signature - possible security threat");
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid signature" }));
      }
    });
  } else {
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
  console.log(
    `🔔 Discord notifications: ${
      DISCORD_WEBHOOK_URL.includes("YOUR_WEBHOOK")
        ? "Not configured"
        : "Enabled"
    }`
  );
  console.log(`========================================\n`);
});

// Handle server errors
server.on("error", (err) => {
  console.error("❌ Server error:", err);
  process.exit(1);
});
```

**Make sure to update:**

- Line 10: `SECRET` with your actual secret key
- Line 14: `DISCORD_WEBHOOK_URL` with your Discord webhook URL

---

### Step 12: Restart Webhook Listener

```bash
pm2 restart webhook-listener
```

---

### Step 13: Verify It Started Correctly

```bash
pm2 logs webhook-listener --lines 20
```

**You should see:**

```
========================================
🎣 Webhook Server Started
========================================
📡 Listening on port: 9000
🔐 Secret configured: Yes
📂 Deploy script: /var/www/Kotkoti-backend/deploy.sh
🔔 Discord notifications: Enabled
========================================
```

If it shows `Discord notifications: Enabled` ✅ - You're good!

If it shows `Discord notifications: Not configured` ❌ - Check your webhook URL is correct.

---

## Part 3: Testing

### Step 14: Test Discord Notifications

Make a test deployment to verify notifications work:

1. **On your local machine:**

   ```bash
   echo "// Test Discord alerts" >> src/main.ts
   git add .
   git commit -m "test: Discord deployment alerts"
   git push origin main
   ```

2. **Watch Discord channel:**

   - You should see 3 messages appear:
     - 🚀 **Orange:** Deployment Started
     - ✅ **Green:** Deployment Successful (after ~30 seconds)

3. **Check VPS logs (optional):**
   ```bash
   pm2 logs webhook-listener --lines 50
   ```
   Should show: `✅ Discord notification sent` (3 times)

---

### Step 15: Test Failure Notification

To test failure notifications, temporarily break the build:

1. **Create a syntax error:**

   ```bash
   # Add invalid TypeScript code
   echo "this will break the build" >> src/main.ts
   git add .
   git commit -m "test: failure notification"
   git push origin main
   ```

2. **Check Discord:**

   - 🚀 **Orange:** Deployment Started
   - ❌ **Red:** Deployment Failed (with error details)

3. **Fix it:**
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## Customization Options

### Change Notification Colors

Edit `webhook-server.js` and modify the color values:

```javascript
// Deployment Started
15105570; // Orange (default)
16776960; // Yellow
3447003; // Blue

// Deployment Success
3066993; // Green (default)
5763719; // Aqua green
2067276; // Dark green

// Deployment Failed
15158332; // Red (default)
10038562; // Dark red
16711680; // Bright red
```

---

### Add More Information to Notifications

You can add additional fields to notifications. Edit the `fields` array:

```javascript
sendDiscordNotification(
  "✅ Deployment Successful",
  "New changes deployed to production server!",
  3066993,
  [
    { name: "🌿 Branch", value: branch, inline: true },
    { name: "👤 Pushed by", value: pusher, inline: true },
    { name: "💬 Commit", value: commitMessage.substring(0, 100) },
    { name: "⏱️ Status", value: "All services restarted successfully" },
    // Add custom fields:
    { name: "🌐 Environment", value: "Production", inline: true },
    { name: "🔗 Server", value: "VPS-01", inline: true },
    { name: "📊 Build Time", value: "~30 seconds", inline: true },
  ]
);
```

---

### Change Bot Name and Avatar

In Discord:

1. Go to Server Settings → Integrations → Webhooks
2. Click your webhook
3. Change **Name** and upload new **Avatar**
4. Click **Save Changes**

No VPS changes needed!

---

### Add @mentions for Failed Deployments

To mention specific users/roles when deployment fails:

```javascript
// Send Discord notification for failure
sendDiscordNotification(
  "❌ Deployment Failed",
  "<@USER_ID> Deployment to production server failed!", // Mentions user
  // Or use: '<@&ROLE_ID>' to mention a role
  15158332,
  [
    { name: "🌿 Branch", value: branch, inline: true },
    { name: "👤 Pushed by", value: pusher, inline: true },
    { name: "💬 Commit", value: commitMessage.substring(0, 100) },
    { name: "❗ Error", value: error.message.substring(0, 1000) },
  ]
);
```

**To get User ID:**

1. Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
2. Right-click user → Copy ID

**To get Role ID:**

1. Right-click role → Copy ID

---

### Disable Certain Notifications

If you don't want "Deployment Started" notifications:

**Comment out or remove this section in webhook-server.js:**

```javascript
// Send Discord notification for deployment start
// sendDiscordNotification(
//   '🚀 Deployment Started',
//   'Deployment process initiated...',
//   15105570,
//   [
//     { name: '🌿 Branch', value: branch, inline: true },
//     { name: '👤 Pushed by', value: pusher, inline: true },
//     { name: '💬 Commit', value: commitMessage.substring(0, 100) }
//   ]
// );
```

Then restart: `pm2 restart webhook-listener`

---

## Troubleshooting

### Problem: No Discord notifications appearing

**Check 1: Verify webhook URL is correct**

```bash
cat /var/www/Kotkoti-backend/webhook-server.js | grep DISCORD_WEBHOOK_URL
```

Should show your actual Discord webhook URL, not the placeholder.

**Check 2: Verify webhook listener is running**

```bash
pm2 status
```

Should show `webhook-listener` as `online`.

**Check 3: Check logs for errors**

```bash
pm2 logs webhook-listener --lines 50 --nostream | grep Discord
```

Look for:

- `✅ Discord notification sent` = Working
- `⚠️ Discord webhook not configured` = URL not set
- `❌ Discord notification error` = Invalid URL or network issue

**Check 4: Test webhook directly**

Test your Discord webhook manually:

```bash
curl -X POST "YOUR_DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test message from VPS"
  }'
```

If this works, the webhook URL is valid.

---

### Problem: Webhook URL is invalid

**Symptoms:** Error: `Invalid URL`

**Solution:**

1. Delete the old webhook in Discord
2. Create a new webhook (follow Part 1 again)
3. Update `webhook-server.js` with new URL
4. Restart: `pm2 restart webhook-listener`

---

### Problem: Notifications sent but not visible in Discord

**Check 1: Verify correct channel**

1. Go to Discord Server Settings → Integrations → Webhooks
2. Click your webhook
3. Check which channel it's posting to
4. Make sure you're looking at that channel

**Check 2: Check Discord permissions**

Make sure the bot has permission to post in that channel:

1. Right-click the channel → Edit Channel
2. Permissions → @everyone or your role
3. Ensure "Send Messages" is enabled

---

### Problem: Too many notifications / spam

**Solution:** Disable "Deployment Started" notifications (see Customization section above).

Only keep:

- ✅ Success notifications
- ❌ Failure notifications

---

### Problem: Webhook gets rate limited

**Symptoms:** `429 Too Many Requests` in logs

**Cause:** Discord limits webhooks to 30 requests per minute.

**Solution:**

- Normal deployment traffic won't hit this limit
- If you're testing rapidly, wait 1-2 minutes between pushes
- Consider batching notifications or reducing notification types

---

## Security Best Practices

### 1. Keep Webhook URL Private

❌ **Don't:**

- Commit webhook URL to Git
- Share webhook URL publicly
- Post webhook URL in Discord

✅ **Do:**

- Store webhook URL only on VPS
- Use environment variables (optional)
- Regenerate webhook if exposed

---

### 2. Use Dedicated Channel

Create a separate `#deployments` or `#deploy-alerts` channel:

- Easier to find deployment history
- Doesn't clutter general channels
- Can restrict access to relevant team members

---

### 3. Regenerate Webhook If Compromised

If webhook URL is accidentally exposed:

1. Go to Discord Server Settings → Integrations → Webhooks
2. Click your webhook
3. Click **Delete Webhook**
4. Create new webhook (follow Part 1 again)
5. Update VPS with new URL
6. Restart webhook listener

---

### 4. Restrict Channel Permissions (Optional)

For sensitive deployments:

1. Make `#deployments` channel private
2. Only add developers/devops team
3. Set read-only permissions for most members

---

## Advanced Features

### Multi-Environment Notifications

If you deploy to staging and production:

```javascript
// Determine environment from branch
let environment = "Unknown";
let color = 15105570; // Orange

if (branch === "main" || branch === "master") {
  environment = "Production";
  color = 15158332; // Red (production)
} else if (branch === "staging" || branch === "dev") {
  environment = "Staging";
  color = 3447003; // Blue (staging)
}

sendDiscordNotification(
  `🚀 Deployment Started (${environment})`,
  "Deployment process initiated...",
  color,
  [
    { name: "🌐 Environment", value: environment, inline: true },
    { name: "🌿 Branch", value: branch, inline: true },
    { name: "👤 Pushed by", value: pusher, inline: true },
    { name: "💬 Commit", value: commitMessage.substring(0, 100) },
  ]
);
```

---

### Add Deployment Duration

Track how long deployments take:

```javascript
// At the start (after logging deployment info)
const startTime = Date.now();

// In the success callback
const duration = ((Date.now() - startTime) / 1000).toFixed(1);

sendDiscordNotification(
  "✅ Deployment Successful",
  "New changes deployed to production server!",
  3066993,
  [
    { name: "🌿 Branch", value: branch, inline: true },
    { name: "👤 Pushed by", value: pusher, inline: true },
    { name: "⏱️ Duration", value: `${duration} seconds`, inline: true },
    { name: "💬 Commit", value: commitMessage.substring(0, 100) },
    { name: "📊 Status", value: "All services restarted successfully" },
  ]
);
```

---

### Link to GitHub Commit

Add clickable commit link:

```javascript
const commitUrl = payload.head_commit ? payload.head_commit.url : null;

sendDiscordNotification(
  "✅ Deployment Successful",
  "New changes deployed to production server!",
  3066993,
  [
    { name: "🌿 Branch", value: branch, inline: true },
    { name: "👤 Pushed by", value: pusher, inline: true },
    { name: "💬 Commit", value: commitMessage.substring(0, 100) },
    {
      name: "🔗 View Commit",
      value: commitUrl ? `[View on GitHub](${commitUrl})` : "N/A",
    },
    { name: "⏱️ Status", value: "All services restarted successfully" },
  ]
);
```

---

## Monitoring and Maintenance

### View Notification History

All notifications are stored in your Discord channel. You can:

- Scroll up to see past deployments
- Search for specific commits or users
- Pin important deployment messages

---

### Discord Webhook Limits

Discord webhooks have these limits:

- **Rate limit:** 30 requests per minute
- **Message length:** 2000 characters per message
- **Embeds:** 10 embeds per message, 25 fields per embed

Normal deployment usage won't hit these limits.

---

### Backup Webhook Configuration

Save your webhook configuration:

```bash
# On VPS, save webhook URL to a secure note
cat /var/www/Kotkoti-backend/webhook-server.js | grep DISCORD_WEBHOOK_URL
```

Store this somewhere safe (password manager, encrypted file).

---

## Quick Reference

### Commands

```bash
# Check webhook listener status
pm2 status

# View webhook logs
pm2 logs webhook-listener

# Restart webhook listener (after changes)
pm2 restart webhook-listener

# Test webhook directly
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test message"}'
```

---

### Key Files

- `/var/www/Kotkoti-backend/webhook-server.js` - Main webhook listener
- `/var/www/Kotkoti-backend/deploy.sh` - Deployment script
- Discord webhook URL - Stored in `webhook-server.js` line 14

---

### Notification Colors

```javascript
3066993; // Green (success)
15158332; // Red (failure)
15105570; // Orange (started)
16776960; // Yellow (warning)
3447003; // Blue (info)
```

---

## Summary

You now have a complete Discord notification system that:

✅ **Sends instant alerts** for every deployment
✅ **Shows success/failure** with detailed error messages
✅ **Visible to entire team** in Discord
✅ **No VPS access needed** to monitor deployments
✅ **Mobile-friendly** via Discord mobile app
✅ **Searchable history** of all deployments

**Workflow:**

```
Push code → GitHub webhook → VPS deploys → Discord notifications 🎉
```

**Three notifications per deployment:**

1. 🚀 Orange - Deployment Started
2. ✅ Green - Deployment Success (or ❌ Red - Failure)
3. Team stays informed without checking VPS!

---

## Additional Resources

- [Discord Webhooks Documentation](https://discord.com/developers/docs/resources/webhook)
- [Discord Embed Visualizer](https://leovoel.github.io/embed-visualizer/) - Test embed designs
- [Discord Developer Portal](https://discord.com/developers/docs/intro)

---

_Last updated: January 2026_

**Happy Deploying! 🚀**
