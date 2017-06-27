module.exports = function hidePoweredBy (options) {
  var setTo = (options || {}).setTo

  return function hidePoweredBy (req, res, next) {
    if (setTo) {
      res.setHeader('X-Powered-By', setTo)
    } else {
      res.removeHeader('X-Powered-By')
    }

    next()
  }
}
