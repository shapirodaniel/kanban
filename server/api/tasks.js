const router = require('express').Router()
const {Task, User} = require('../db/models')
module.exports = router

// GET all tasks
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.findAll()
    res.send(tasks)
  } catch (err) {
    next(err)
  }
})

// GET a single task
router.get('/:id', async (req, res, next) => {
  try {
    const foundTask = await Task.findByPk(+req.params.id, {include: [User]})
    res.send(foundTask)
  } catch (err) {
    next(err)
  }
})

// POST create a new task
/*
  req.body = {
    newTask: {
      name, description, openedBy, lastEdit
    },
    projectId,
    columnId,
    assignees?: [...taskIds]
  }
*/
router.post('/', async (req, res, next) => {
  try {
    const {newTask, projectId, columnId, assignees} = req.body
    const createdAndAssociatedTask = await Task.createAndAssociate(
      newTask,
      projectId,
      columnId,
      assignees
    )
    res.status(201).send(createdAndAssociatedTask)
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
