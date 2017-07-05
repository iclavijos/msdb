const fs = require('fs');

module.exports = {
    parseVersion : parseVersion
};

// Returns the second occurrence of the version number from `build.gradle` file
function parseVersion() {
    const versionRegex = /^version\s*=\s*[',"]([^',"]*)[',"]/gm; // Match and group the version number
    const buildGradle = fs.readFileSync('build.gradle', 'utf8');
    return versionRegex.exec(buildGradle)[1];
}
