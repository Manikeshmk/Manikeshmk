const https = require("https");
const fs = require("fs");

const username = "manikeshmk";

https.get(`https://api.github.com/users/${username}/repos?per_page=100`, {
  headers: { "User-Agent": "node" }
}, (res) => {
  let data = "";

  res.on("data", chunk => data += chunk);

  res.on("end", () => {
    const repos = JSON.parse(data);

    let markdown = "";

    repos
      .filter(repo => !repo.fork)
      .forEach(repo => {
        const liveUrl =
          repo.name.toLowerCase() === username.toLowerCase()
            ? `https://${username}.github.io/`
            : `https://${username}.github.io/${repo.name}/`;

        markdown += `<a href="${liveUrl}" target="_blank">
  <img src="https://img.shields.io/badge/${encodeURIComponent(repo.name)}-Visit_Website-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>\n\n`;
      });

    fs.writeFileSync("website-links.md", markdown);
    console.log("Website links generated!");
  });
});
