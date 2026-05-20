const https = require("https");
const fs = require("fs");

const username = "manikeshmk";

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent": "node",
          Accept: "application/vnd.github+json",
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));

        res.on("end", () => {
          try {
            resolve({
              status: res.statusCode,
              data: JSON.parse(data),
            });
          } catch (err) {
            reject(err);
          }
        });
      }
    ).on("error", reject);
  });
}

async function main() {
  const repoResponse = await fetchJSON(
    `https://api.github.com/users/${username}/repos?per_page=100`
  );

  const repos = repoResponse.data;

  let markdown = "";

  for (const repo of repos) {
    if (repo.fork) continue;

    // Check if GitHub Pages is enabled
    const pagesResponse = await fetchJSON(
      `https://api.github.com/repos/${username}/${repo.name}/pages`
    );

    // Skip repos without Pages deployment
    if (pagesResponse.status !== 200) continue;

    const liveUrl = pagesResponse.data.html_url;

    markdown += `<a href="${liveUrl}" target="_blank">
  <img src="https://img.shields.io/badge/${encodeURIComponent(
    repo.name
  )}-Visit_Website-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>\n\n`;
  }

  fs.writeFileSync("website-links.md", markdown);

  console.log("Website links generated!");
}

main().catch(console.error);
