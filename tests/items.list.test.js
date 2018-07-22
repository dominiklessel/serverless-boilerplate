
// Env
process.env.region = 'eu-central-1'
process.env.tableName = 'dev-mf-sl-bp-testTable'

// Modules
const is = require('@sindresorhus/is')
const { handler } = require('../functions/items/list')
const { createItem, deleteItem } = require('../functions/libs/items-lib')

// Tmp vars
let idItem

// Hooks
beforeAll(async () => {
  const item = await createItem({ itemProps: { name: 'foo', foo: 'bar' } })
  idItem = item.idItem
})

afterAll(async () => {
  await deleteItem({ idItem })
})

// Tests
test('should send proper response', (done) => {
  const anEvent = {}
  const context = {}

  handler(anEvent, context, (err, res) => {
    expect(err).toBeNull()
    expect(is(res)).toBe('Object')
    expect(is(res.statusCode)).toBe('number')
    expect(is(res.headers)).toBe('Object')
    expect(is(res.body)).toBe('string')
    expect(res.statusCode).toBe(200)
    expect(res.headers).toMatchObject({ 'Access-Control-Allow-Origin': '*' })

    const body = JSON.parse(res.body)

    expect(is(body.meta)).toBe('Object')
    expect(is(body.meta.fields)).toBe('string')
    expect(is(body.meta.page)).toBe('number')
    expect(is(body.meta.pageSize)).toBe('number')
    expect(is(body.meta.elements)).toBe('number')
    expect(is(body.meta.totalElements)).toBe('number')
    expect(is(body.meta.totalPages)).toBe('number')
    expect(is(body.items)).toBe('Array')
    expect(is(body.items[0])).toBe('Object')
    expect(is(body.items[0].idItem)).toBe('string')
    expect(is(body.items[0].name)).toBe('string')
    expect(is(body.items[0].foo)).toBe('string')

    done()
  })
})

test('should responde with proper error code if query string is malformed', (done) => {
  const anEvent = {
    queryStringParameters: {
      foo: true
    }
  }
  const context = {}

  handler(anEvent, context, (err, res) => {
    expect(err).toBeNull()
    expect(is(res)).toBe('Object')
    expect(is(res.statusCode)).toBe('number')
    expect(is(res.headers)).toBe('Object')
    expect(is(res.body)).toBe('string')
    expect(res.statusCode).toBe(400)
    expect(res.headers).toMatchObject({ 'Access-Control-Allow-Origin': '*' })

    done()
  })
})

test('should send proper response with field mask', (done) => {
  const anEvent = {
    queryStringParameters: {
      fields: 'name'
    }
  }
  const context = {}

  handler(anEvent, context, (err, res) => {
    expect(err).toBeNull()
    expect(is(res)).toBe('Object')
    expect(is(res.statusCode)).toBe('number')
    expect(is(res.headers)).toBe('Object')
    expect(is(res.body)).toBe('string')
    expect(res.statusCode).toBe(200)
    expect(res.headers).toMatchObject({ 'Access-Control-Allow-Origin': '*' })

    const body = JSON.parse(res.body)

    expect(is(body.meta)).toBe('Object')
    expect(is(body.meta.fields)).toBe('string')
    expect(is(body.meta.page)).toBe('number')
    expect(is(body.meta.pageSize)).toBe('number')
    expect(is(body.meta.elements)).toBe('number')
    expect(is(body.meta.totalElements)).toBe('number')
    expect(is(body.meta.totalPages)).toBe('number')
    expect(is(body.items)).toBe('Array')
    expect(is(body.items[0])).toBe('Object')
    expect(is(body.items[0].idItem)).toBe('undefined')
    expect(is(body.items[0].name)).toBe('string')
    expect(is(body.items[0].foo)).toBe('undefined')

    done()
  })
})
