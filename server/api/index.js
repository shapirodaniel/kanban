const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/organizations', require('./organizations'))
router.use('/projects', require('./projects'))
router.use('/columns', require('./columns'))
router.use('/tasks', require('./tasks'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
