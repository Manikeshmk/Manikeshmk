const https = require("https");
const fs = require("fs");

const username = "manikeshmk";
const token = process.env.GITHUB_TOKEN;

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent": "node",
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

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

  let markdown = `# 🌐 Live Websites Portfolio

<p align="center">
  <i>Explore my deployed products, experiments, and interactive web experiences</i>
</p>

`;

  for (const repo of repos) {
  if (repo.fork) continue;

  let liveUrl = repo.homepage;

  // If homepage exists, prefer it
  if (!liveUrl || liveUrl.trim() === "") {
    const deploymentResponse = await fetchJSON(
      `https://api.github.com/repos/${username}/${repo.name}/deployments`
    );

    const deployments = deploymentResponse.data;

    if (!Array.isArray(deployments) || deployments.length === 0) {
      continue;
    }

    const latestDeployment = deployments[0];

    const statusResponse = await fetchJSON(
      latestDeployment.statuses_url
    );

    const statuses = statusResponse.data;

    if (!Array.isArray(statuses) || statuses.length === 0) {
      continue;
    }

    const deployedStatus = statuses.find(
      (status) => status.environment_url
    );

    if (!deployedStatus) continue;

    liveUrl = deployedStatus.environment_url;
  }

  markdown += `<a href="${liveUrl}" target="_blank">
  <img src="https://img.shields.io/badge/${encodeURIComponent(
    repo.name
  )}-Visit_Website-181717?style=for-the-badge&logo=github&logoColor=white" />
</a>

`;
  }

  fs.writeFileSync("website-links.md", markdown);

  console.log("Website links generated!");
}

main().catch(console.error);
