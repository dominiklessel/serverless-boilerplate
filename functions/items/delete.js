
// Modules
const joi = require('joi')
const boom = require('boom')
const { setRequestContext, parseParams, log, sendRes } = require('@dominiklessel/serverless-utils')
const { deleteItem } = require('../libs/items-lib')

// Config
const cors = true
const callbackWaitsForEmptyEventLoop = true // Auf "false" setzen wenn externe connections außerhalb des Handler Context' offen gehalten werden, sonst wird das callback niemals gefeuert

// Schema
const pathParamsSchema = joi.object().keys({
  idItem: joi.string().required()
})

// Handler
module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = callbackWaitsForEmptyEventLoop
  setRequestContext(event, context)

  const {
    err: validationErr,
    pathParams: {
      idItem = null
    } = {}
  } = parseParams(event, { pathParamsSchema })
  const statusCode = 204
  let body = {}

  if (validationErr) {
    return sendRes({ body: boom.badRequest(validationErr.details[0].message), cors }, callback)
  }

  try {
    const deleted = await deleteItem({ idItem })

    if (!deleted) {
      body = boom.notFound()
    }
  } catch (err) {
    log.error('deleteItem - err', err)
    body = boom.badImplementation()
  }

  return sendRes({ statusCode, body, cors }, callback)
}
