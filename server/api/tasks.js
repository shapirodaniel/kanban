const router = require('express').Router()
const {Task, User, Column} = require('../db/models')
module.exports = router

// GET all tasks
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.findAll()
    res.status(200).send(tasks)
  } catch (err) {
    next(err)
  }
})

// GET a single task and its assignees
router.get('/:id', async (req, res, next) => {
  try {
    const foundTask = await Task.findByPk(+req.params.id, {
      include: [
        {
          model: User,
          attributes: ['fullName', 'firstName', 'lastName', 'imageUrl']
        },
        {
          model: Column
        }
      ]
    })
    res.status(200).send(foundTask)
  } catch (err) {
    next(err)
  }
})

// POST create a new task from add task modal in board view
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

// UPDATE a single task in single task view
/*
  req.body = {
    updateInfo: {
        ...fields
    },
    assignees: [...userIds]
  }
*/
router.put('/:id', async (req, res, next) => {
  try {
    const {updateInfo, assignees} = req.body
    await Task.updateAndAssociate(+req.params.id, updateInfo, assignees)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

// UPDATE assign task to column, move task within column, or move task from column to another column
// (in board view only)
router.put('/:id/reorder', async (req, res, next) => {
  try {
    const {sourceColId, destColId, sourceTaskOrder, destTaskOrder} = req.body
    await Task.reorder(
      +req.params.id,
      sourceColId,
      sourceTaskOrder,
      destColId,
      destTaskOrder
    )
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

// DELETE a single task from either board view or single task view
// since column is included in the single task GET route above, we'll have access to sourceColId and sourceTaskOrder
/*
  important! if using axios, configure the request as follows:

  axios.delete(
    '/tasks/${taskId}',

    // send an object with data keyed to payload, where payload will be req.body
    { data: { sourceColId, sourceTaskOrder } }
  )

  if using postman or another client-test interface, configure request as usual (directly on body)
*/
router.delete('/:id', async (req, res, next) => {
  try {
    const {sourceColId, sourceTaskOrder} = req.body
    await Task.deleteAndReorderSourceCol(
      +req.params.id,
      sourceColId,
      sourceTaskOrder
    )
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
