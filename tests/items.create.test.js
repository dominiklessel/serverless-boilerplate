
// Env
process.env.region = 'eu-central-1'
process.env.tableName = 'dev-mf-sl-bp-testTable'

// Modules
const is = require('@sindresorhus/is')
const { handler } = require('../functions/items/create')
const { deleteItem } = require('../functions/libs/items-lib')

// Tmp vars
let idItem

// Hooks
afterAll(async () => {
  await deleteItem({ idItem })
})

// Test
test('should send proper error response if a bad request happens', (done) => {
  const anEvent = {
    body: JSON.stringify({
      name: null
    })
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

test('should send proper response', (done) => {
  const anEvent = {
    body: JSON.stringify({
      name: 'ava-test',
      foo: 'bar'
    })
  }
  const context = {}

  handler(anEvent, context, (err, res) => {
    expect(err).toBeNull()
    expect(is(res)).toBe('Object')
    expect(is(res.statusCode)).toBe('number')
    expect(is(res.headers)).toBe('Object')
    expect(is(res.body)).toBe('string')
    expect(res.statusCode).toBe(201)
    expect(res.headers).toMatchObject({ 'Access-Control-Allow-Origin': '*' })

    const body = JSON.parse(res.body)

    expect(is(body.meta)).toBe('Object')
    expect(is(body.meta.requestBody)).toBe('Object')
    expect(is(body.item)).toBe('Object')
    expect(is(body.item.idItem)).toBe('string')
    expect(is(body.item.name)).toBe('string')

    idItem = body.item.idItem

    done()
  })
})
