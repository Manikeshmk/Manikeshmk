const fs = require("fs");

const readme = fs.readFileSync("README.md", "utf8");
const websiteLinks = fs.readFileSync("website-links.md", "utf8");

const updated = readme.replace(
  /<!-- WEBSITE-LINKS-START -->([\s\S]*?)<!-- WEBSITE-LINKS-END -->/,
  `<!-- WEBSITE-LINKS-START -->\n${websiteLinks}\n<!-- WEBSITE-LINKS-END -->`
);

fs.writeFileSync("README.md", updated);

console.log("README updated successfully!");
