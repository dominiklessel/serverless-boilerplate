
// Modules
const semver = require('semver')
const { apiVersion } = require('../serverless.vars')

// Package
const manifest = require('../package.json')

test('should return proper api version based on package.json major version', () => {
  expect(apiVersion()).toBe(`v${semver.major(manifest.version)}`)
})
