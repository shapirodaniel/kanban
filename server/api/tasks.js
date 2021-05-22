const router = require('express').Router()
const {Task, User} = require('../db/models')
module.exports = router

// GET a single task
router.get('/:id', async (req, res, next) => {
  try {
    const foundTask = await Task.findByPk(+req.params.id)
    res.send(foundTask)
  } catch (err) {
    next(err)
  }
})

// POST create a new task
router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create(req.body)
    res.status(201).send(task)
  } catch (err) {
    next(err)
  }
})

// UPDATE a single task
router.put('/:id', async (req, res, next) => {
  try {
    const [numRows, [task]] = await Task.update(req.body, {
      where: {
        id: +req.params.id
      },
      include: [User],
      returning: true
    })
    res.status(200).send(task)
  } catch (err) {
    next(err)
  }
})

// DELETE a single task
router.delete('/:id', async (req, res, next) => {
  try {
    await Task.destroy({
      where: {
        id: +req.params.id
      }
    })
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
