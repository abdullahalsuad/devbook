const http = require("http");
const https = require("https");
const crypto = require("crypto");
const { exec } = require("child_process");

// ===================== CONFIGURATION =====================
const PORT = 9000;
const SECRET =
  "195413626cb92d2e198ee449ccbc19d2131b61c7e67ac71ec85f12b3ad74eabc";
const DEPLOY_SCRIPT = "/var/www/Kotkoti-backend/deploy.sh";
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1459826999299280980/vhJ34GEMxN4vkKXKrM7F1a-zO_I6vSi8JbZXzVOrPw24ueGfrIG6N028N1LeC0ViBFBI";

// ===================== DISCORD NOTIFICATION =====================
function sendDiscordNotification(title, description, color, fields = []) {
  if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL.includes("YOUR_WEBHOOK")) {
    console.log("Discord webhook not configured, skipping notification");
    return;
  }

  const webhookURL = new URL(DISCORD_WEBHOOK_URL);

  const payload = JSON.stringify({
    embeds: [
      {
        title,
        description,
        color,
        fields,
        timestamp: new Date().toISOString(),
        footer: { text: "VPS Deploy Bot - Backend" },
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
      console.log("Discord notification sent");
    } else {
      console.log(`Discord notification failed: ${res.statusCode}`);
    }
  });

  req.on("error", (err) =>
    console.error("Discord notification error:", err.message)
  );
  req.write(payload);
  req.end();
}

// ===================== WEBHOOK SERVER =====================
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/webhook") {
    let body = "";

    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      const signature = req.headers["x-hub-signature-256"];
      if (!signature) {
        console.log("No signature provided");
        res.writeHead(403, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "No signature" }));
      }

      const hmac = crypto.createHmac("sha256", SECRET);
      const digest = "sha256=" + hmac.update(body).digest("hex");

      if (signature !== digest) {
        console.log("Invalid signature");
        res.writeHead(403, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid signature" }));
      }

      const payload = JSON.parse(body);
      const branch = payload.ref ? payload.ref.split("/").pop() : "unknown";
      const commitMessage = payload.head_commit
        ? payload.head_commit.message
        : "No message";
      const pusher = payload.pusher ? payload.pusher.name : "Unknown";

      console.log(`\n----------------------------------------`);
      console.log(`WEBHOOK RECEIVED (Backend)`);
      console.log(`Time: ${new Date().toISOString()}`);
      console.log(`Branch: ${branch}`);
      console.log(`Pushed by: ${pusher}`);
      console.log(`Commit: ${commitMessage.substring(0, 60)}`);
      console.log(`----------------------------------------\n`);

      // Only deploy on main/master
      if (branch !== "main" && branch !== "master") {
        console.log(`Branch "${branch}" ignored (not main/master)\n`);
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Branch ignored", branch }));
      }

      sendDiscordNotification(
        "Backend Deployment Started",
        "Backend deployment process initiated...",
        15105570,
        [
          { name: "Branch", value: branch, inline: true },
          { name: "Pusher", value: pusher, inline: true },
          { name: "Commit", value: commitMessage.substring(0, 100) },
        ]
      );

      exec(`bash ${DEPLOY_SCRIPT}`, (error, stdout, stderr) => {
        if (error) {
          console.error("DEPLOYMENT FAILED", error);
          sendDiscordNotification(
            "Backend Deployment Failed",
            "Backend deployment failed!",
            15158332,
            [
              { name: "Branch", value: branch, inline: true },
              { name: "Pusher", value: pusher, inline: true },
              { name: "Commit", value: commitMessage.substring(0, 100) },
              { name: "Error", value: error.message.substring(0, 1000) },
            ]
          );
          return;
        }

        console.log("DEPLOYMENT SUCCESS\n", stdout);
        sendDiscordNotification(
          "Backend Deployment Successful",
          "Backend deployed successfully!",
          3066993,
          [
            { name: "Branch", value: branch, inline: true },
            { name: "Pusher", value: pusher, inline: true },
            { name: "Commit", value: commitMessage.substring(0, 100) },
            { name: "Status", value: "Build completed and backend restarted" },
          ]
        );

        if (stderr) console.log("Additional info:", stderr);
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Deployment started",
          branch,
          commit: commitMessage.substring(0, 60),
        })
      );
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

// ===================== START SERVER =====================
server.listen(PORT, () => {
  console.log("----------------------------------------");
  console.log("Webhook Server Started (Backend)");
  console.log(`Listening on port: ${PORT}`);
  console.log(`Secret configured: Yes`);
  console.log(`Deploy script: ${DEPLOY_SCRIPT}`);
  console.log(`Discord notifications: Enabled`);
  console.log(`Deploy branches: main, master`);
  console.log("----------------------------------------\n");
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});
