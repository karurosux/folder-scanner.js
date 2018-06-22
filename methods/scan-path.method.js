const { lstatSync, readdirSync } = require('fs');
const { resolve } = require('path');

/**
 *
 * @param {String} dir The directory to scan.
 * @param {Object} config Configuration object.
 */
module.exports = function scanPath(dir, config) {
  const result = [];

  config = config || {};

  if (!dir) {
    throw new Error("Input variable 'dir' is required.");
  }

  _scanRecursive(dir, config, result);

  return result;
};

const _scanRecursive = function _scanRecursive(dir, config, result) {
  const dirStats = lstatSync(dir);

  if (dirStats.isDirectory()) {
    let readPaths = readdirSync(dir);

    if (Array.isArray(config.exclude)) {
      readPaths = readPaths.filter(
        p => !config.exclude.some(e => p.endsWith(e))
      );
    }

    readPaths.forEach(path => {
      const currentDir = resolve(dir, path);
      const currentPathStats = lstatSync(currentDir);

      if (currentPathStats.isFile()) {
        result.push(currentDir);
      } else if (currentPathStats.isDirectory()) {
        _scanRecursive(currentDir, config, result);
      }
    });
  }
};
