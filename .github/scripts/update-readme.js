const fs = require("fs");

const readmePath = "README.md";
const linksPath = "website-links.md";

const readme = fs.readFileSync(readmePath, "utf8");
const websiteLinks = fs.readFileSync(linksPath, "utf8");

const updatedReadme = readme.replace(
  /<!-- WEBSITE-LINKS-START -->([\s\S]*?)<!-- WEBSITE-LINKS-END -->/,
  `<!-- WEBSITE-LINKS-START -->

${websiteLinks}

<!-- WEBSITE-LINKS-END -->`
);

fs.writeFileSync(readmePath, updatedReadme);

console.log("README updated!");
