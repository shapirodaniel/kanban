const router = require('express').Router()
const {Column} = require('../db/models')
module.exports = router

router.post('/', async (req, res, next) => {
  try {
    await Column.create(req.body)
    res.sendStatus(201)
  } catch (err) {
    next(err)
  }
})

// PUT update column name
router.put('/:id', async (req, res, next) => {
  try {
    await Column.update(req.body)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Column.destroy({
      where: {
        id: +req.params.id
      }
    })
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
