var hidePoweredBy = require('..')

var connect = require('connect')
var request = require('supertest')
var assert = require('assert')

describe('hidePoweredBy', function () {
  function app () {
    var result = connect()
    result.use(function (req, res, next) {
      res.setHeader('X-Powered-By', 'Computers')
      next()
    })
    result.use(hidePoweredBy.apply(null, arguments))
    result.use(function (req, res) {
      res.end('Hello world!')
    })
    return result
  }

  it('works even if no header is set', function (done) {
    var app = connect()
    app.use(hidePoweredBy())
    app.use(function (req, res) {
      res.end('Hello world!')
    })

    request(app).get('/')
      .end(function (err, res) {
        if (err) {
          done(err)
          return
        }
        assert.strictEqual(res.header['x-powered-by'], undefined)
        done()
      })
  })

  it('removes the X-Powered-By header when no arguments are passed', function () {
    return request(app()).get('/')
      .expect(function (res) {
        assert(!('x-powered-by' in res.headers))
      })
  })

  it('removes the X-Powered-By header when empty options are passed', function () {
    return request(app({})).get('/')
      .expect(function (res) {
        assert(!('x-powered-by' in res.headers))
      })
  })

  it('allows you to explicitly set the header', function () {
    return request(app({ setTo: 'steampowered' })).get('/')
      .expect('X-Powered-By', 'steampowered')
  })

  it('names its function and middleware', function () {
    assert.strictEqual(hidePoweredBy.name, 'hidePoweredBy')
    assert.strictEqual(hidePoweredBy().name, 'hidePoweredBy')
  })
})
