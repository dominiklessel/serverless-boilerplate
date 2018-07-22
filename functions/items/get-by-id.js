
// Modules
const joi = require('joi')
const boom = require('boom')
const { setRequestContext, parseParams, log, sendRes } = require('@dominiklessel/serverless-utils')
const { getItem } = require('../libs/items-lib')

// Config
const cors = true
const callbackWaitsForEmptyEventLoop = true // Auf "false" setzen wenn externe connections außerhalb des Handler Context' offen gehalten werden, sonst wird das callback niemals gefeuert

// Schema
const pathParamsSchema = joi.object().keys({
  idItem: joi.string().required()
})

const queryParamsSchema = joi.object().keys({
  fields: joi.string().allow('').default('*')
})

// Handler
module.exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = callbackWaitsForEmptyEventLoop
  setRequestContext(event, context)

  const {
    err: validationErr,
    pathParams: {
      idItem = null
    } = {},
    queryStringParams: {
      fields = null
    } = {}
  } = parseParams(event, { pathParamsSchema, queryParamsSchema })
  let body

  if (validationErr) {
    return sendRes({ body: boom.badRequest(validationErr.details[0].message), cors }, callback)
  }

  try {
    const item = await getItem({ idItem, fields })

    if (!item) {
      body = boom.notFound()
    } else {
      body = {
        meta: {
          fields
        },
        item
      }
    }
  } catch (err) {
    log.error('getItem - err', err)
    body = boom.badImplementation()
  }

  return sendRes({ body, cors }, callback)
}
