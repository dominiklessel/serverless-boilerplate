
// Modules
const shortid = require('shortid')
const mask = require('json-mask')
const { call } = require('../libs/dynamodb-lib')

// Config
const TableName = process.env.tableName

// Methods
const getItem = async ({ idItem = null, fields = '*' } = {}) => {
  if (!idItem) {
    throw new Error('`idItem` required!')
  }

  const Key = { idItem }
  const params = { TableName, Key }
  const { Item = null } = await call('get', params)

  return mask(Item, fields)
}

const createItem = async ({ itemProps = null } = {}) => {
  if (!itemProps) {
    throw new Error('`itemProps` required!')
  }

  const idItem = shortid.generate()
  const Item = Object.assign({}, itemProps, { idItem })
  const params = { TableName, Item }

  await call('put', params)

  return Item
}

const deleteItem = async ({ idItem = null } = {}) => {
  if (!idItem) {
    throw new Error('`idItem` required!')
  }

  // The ConditionExpression helps to find out if the item which should be delted exists
  // See: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html
  // > Unless you specify conditions, the DeleteItem is an idempotent operation;
  // > running it multiple times on the same item or attribute does not result in an error response.
  const Key = { idItem }
  const params = { TableName, Key, ConditionExpression: 'attribute_exists(idItem)' }

  try {
    await call('delete', params)
  } catch (err) {
    if (err.statusCode === 400) {
      return false
    }

    throw err
  }

  return true
}

const listItems = async ({ page = 1, pageSize = 25, fields = '*' } = {}) => {
  const params = { TableName }
  const { Items = [] } = await call('scan', params)
  const items = Items.map((i) => mask(i, fields))
  const elements = items.length
  const totalElements = elements
  const totalPages = Math.ceil(totalElements / pageSize)
  const meta = {
    fields,
    page,
    pageSize,
    elements,
    totalElements,
    totalPages
  }

  return { meta, items }
}

// Export
module.exports = {
  createItem,
  deleteItem,
  getItem,
  listItems
}
