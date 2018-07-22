
// Modules
const joi = require('joi')
const boom = require('boom')
const { setRequestContext, parseParams, log, sendRes } = require('@dominiklessel/serverless-utils')
const { createItem } = require('../libs/items-lib')

// Config
const cors = true
const callbackWaitsForEmptyEventLoop = true // Auf "false" setzen wenn externe connections außerhalb des Handler Context' offen gehalten werden, sonst wird das callback niemals gefeuert

// Schema
const bodySchema = joi.object().keys({
  name: joi.string().required(),
  foo: joi.string().allow(null)
})

// Handler
module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = callbackWaitsForEmptyEventLoop
  setRequestContext(event, context)

  const {
    err: validationErr,
    body: requestBody
  } = parseParams(event, { bodySchema })
  let body = {}
  const statusCode = 201

  if (validationErr) {
    return sendRes({ body: boom.badRequest(validationErr.details[0].message), cors }, callback)
  }

  try {
    const item = await createItem({ itemProps: requestBody })
    body = {
      meta: {
        requestBody
      },
      item
    }
  } catch (err) {
    log.error('createItem - err', err)
    body = boom.badImplementation()
  }

  return sendRes({ statusCode, body, cors }, callback)
}
