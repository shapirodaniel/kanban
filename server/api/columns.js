const router = require('express').Router()
const {Column} = require('../db/models')
module.exports = router

// CREATE a new column
router.post('/', async (req, res, next) => {
  try {
    await Column.create(req.body)
    res.sendStatus(201)
  } catch (err) {
    next(err)
  }
})

// PUT update column name only
// reordering the taskOrder array happens in Task routes and model
router.put('/:id', async (req, res, next) => {
  try {
    await Column.update(req.body)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

// DELETE remove a column
// tasks in the column will be reassigned to tasksWithoutColumns field on the column's project in its GET route
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
