const router = require('express').Router()
const {Project} = require('../db/models')
module.exports = router

// GET all projects for single org view project cards
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      attributes: ['id', 'name', 'about', 'imageUrl']
    })
    res.send(projects)
  } catch (err) {
    next(err)
  }
})

// GET single project with associated columns and tasks
router.get('/:id', async (req, res, next) => {
  try {
    const projectAndTasks = await Project.getSingleProjectAndAssociations(
      +req.params.id
    )
    res.status(200).send(projectAndTasks)
  } catch (err) {
    next(err)
  }
})

// POST create a new project from single org view
/*
  req.body = {
    name, about, imageUrl
  }
*/
router.post('/', async (req, res, next) => {
  try {
    const newProject = await Project.create(req.body)
    res.status(201).send(newProject)
  } catch (err) {
    next(err)
  }
})

// PUT update a single project
// update name, about, imageUrl in single org view
// update columnOrder in board view
/*
  req.body = {
    name, about, imageUrl, columnOrder
  }
*/
router.put('/:id', async (req, res, next) => {
  try {
    await Project.update(req.body, {
      where: {
        id: +req.params.id
      }
    })
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})

// DELETE a single project from single org view
router.delete('/:id', async (req, res, next) => {
  try {
    await Project.destroy({
      where: {
        id: +req.params.id
      },
      hooks: true
    })
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
