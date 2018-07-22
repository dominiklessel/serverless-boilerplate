
// Modules
const joi = require('joi')
const boom = require('boom')
const { setRequestContext, parseParams, log, sendRes } = require('@dominiklessel/serverless-utils')
const { listItems } = require('../libs/items-lib')

// Config
const cors = true
const callbackWaitsForEmptyEventLoop = true // Auf "false" setzen wenn externe connections außerhalb des Handler Context' offen gehalten werden, sonst wird das callback niemals gefeuert

// Schema
const queryParamsSchema = joi.object().keys({
  fields: joi.string().allow('').default('*'),
  page: joi.number().allow(null).min(1).default(1),
  pageSize: joi.number().allow(null).min(-1).max(100).default(25)
})

// Handler
module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = callbackWaitsForEmptyEventLoop
  setRequestContext(event, context)

  const {
    err: validationErr,
    queryStringParams: {
      fields = null,
      page = null,
      pageSize = null
    } = {}
  } = parseParams(event, { queryParamsSchema })
  let body = {}

  if (validationErr) {
    return sendRes({ body: boom.badRequest(validationErr.details[0].message), cors }, callback)
  }

  try {
    const { meta, items } = await listItems({ fields, page, pageSize })
    body = {
      meta,
      items
    }
  } catch (err) {
    log.error('listItems - err', err)
    body = boom.badImplementation()
  }

  return sendRes({ body, cors }, callback)
}
