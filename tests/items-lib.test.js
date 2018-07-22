
// Env
process.env.region = 'eu-central-1'
process.env.tableName = 'dev-mf-sl-bp-testTable'

// Modules
const { createItem, deleteItem, getItem, listItems } = require('../functions/libs/items-lib.js')

// Tests
describe('createItem()', () => {
  let idItem

  afterAll(async () => {
    await deleteItem({ idItem })
  })

  test('throws if arguments are missing', async () => {
    expect.assertions(1)
    await expect(createItem()).rejects.toEqual(new Error('`itemProps` required!'))
  })

  test('returns object if item was created', async () => {
    expect.assertions(1)
    const item = await createItem({ itemProps: { foo: 'bar' } })

    idItem = item.idItem

    expect(item).toBeInstanceOf(Object)
  })
})

describe('getItem()', () => {
  let item

  beforeAll(async () => {
    item = await createItem({ itemProps: { foo: 'bar' } })
  })

  afterAll(async () => {
    await deleteItem({ idItem: item.idItem })
  })

  test('throws if arguments are missing', async () => {
    expect.assertions(1)
    await expect(getItem()).rejects.toEqual(new Error('`idItem` required!'))
  })

  test('returns null if item was not found', async () => {
    expect.assertions(1)

    expect(await getItem({ idItem: 'notFound' })).toBeNull()
  })

  test('returns object if item was found', async () => {
    expect.assertions(1)

    expect(await getItem({ idItem: item.idItem })).toBeInstanceOf(Object)
  })
})

describe('deleteItem()', () => {
  let item

  beforeAll(async () => {
    item = await createItem({ itemProps: { foo: 'bar' } })
  })

  test('throws if arguments are missing', async () => {
    expect.assertions(1)
    await expect(deleteItem()).rejects.toEqual(new Error('`idItem` required!'))
  })

  test('returns false if item was not found', async () => {
    expect.assertions(1)
    expect(await deleteItem({ idItem: -1 })).toBe(false)
  })

  test('returns true if item was found and deleted', async () => {
    expect.assertions(1)

    expect(await deleteItem({ idItem: item.idItem })).toBe(true)
  })
})

describe('listItems()', () => {
  test('returns an Object', async () => {
    expect.assertions(1)
    const res = await listItems()
    expect(res).toBeInstanceOf(Object)
  })
})
