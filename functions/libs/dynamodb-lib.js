
// Modules
const AWS = require('aws-sdk')

// AWS
const documentClient = new AWS.DynamoDB.DocumentClient({ region: process.env.region })

// Helpers
const call = (action, params) => {
  return documentClient[action](params).promise()
}

// Export
module.exports = {
  call
}
