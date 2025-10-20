const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, 'package.json');
const packageJson = require(packagePath);

// Set the homepage field based on an environment variable or default value
packageJson.homepage = process.env.HOMEPAGE_URL;

// Write the updated package.json back to file
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
