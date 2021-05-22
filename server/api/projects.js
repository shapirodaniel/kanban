const router = require('express').Router()
const {Project, Column, Task, User} = require('../db/models')
module.exports = router

// GET all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      attributes: ['name', 'about', 'imageUrl']
    })
    res.send(projects)
  } catch (err) {
    next(err)
  }
})

// GET single project with associated columns and tasks
router.get('/:id', async (req, res, next) => {
  try {
    const foundProject = await Project.findByPk(+req.params.id, {
      include: [
        Column,
        Task,
        {
          model: User,
          // since fullName is a virtual field we need to include its the fields we use to build it in our attributes array (firstName, lastName), even though we're not using them directly...
          attributes: ['fullName', 'firstName', 'lastName', 'imageUrl']
        }
      ]
    })
    res.send(foundProject)
  } catch (err) {
    next(err)
  }
})

// POST create a new project
/*
  req.body = {
    name, about, imageUrl, columnOrder
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
/*
  req.body = {
    name, about, imageUrl, columnOrder
  }
*/
router.put('/:id', async (req, res, next) => {
  try {
    const updatedProject = await Project.updateAndAssociate(
      +req.params.id,
      req.body
    )
    res.status(200).send(updatedProject)
  } catch (err) {
    next(err)
  }
})

// DELETE a single project
router.delete('/:id', async (req, res, next) => {
  try {
    await Project.destroy({
      where: {
        id: +req.params.id
      }
    })
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
