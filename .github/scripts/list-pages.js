const https = require("https");
const fs = require("fs");

const username = "manikeshmk";

https.get(`https://api.github.com/users/${username}/repos?per_page=100`, {
  headers: {
    "User-Agent": "node"
  }
}, (res) => {
  let data = "";

  res.on("data", chunk => data += chunk);

  res.on("end", () => {
    const repos = JSON.parse(data);

    let markdown = `## 🌐 My Live Websites\n\n`;

    repos.forEach(repo => {
      if (!repo.fork) {
        const url = `https://${username}.github.io/${repo.name}/`;
        markdown += `- [${repo.name}](${url})\n`;
      }
    });

    fs.writeFileSync("website-links.md", markdown);
    console.log("Website links generated!");
  });
});
