
// Modules
const semver = require('semver')

// Package
const manifest = require('./package.json')

module.exports.apiVersion = () => {
  return `v${semver.major(manifest.version)}`
}
