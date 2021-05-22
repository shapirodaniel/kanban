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
        // only fetch user's imageUrl, for task card avatar(s)
        {
          model: User,
          // we only want fullName but since it's a virtual field we need to include its deps -- firstName, lastName
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
router.post('/', async (req, res, next) => {
  try {
    const [project, wasCreated] = await Project.findOrCreate({
      where: {
        name: req.body.name
      },
      defaults: {
        ...req.body,
        imageUrl: '/assets/project-default.png'
      }
    })
    res.status(201).send(project)
  } catch (err) {
    next(err)
  }
})

// PUT update a single project
router.put('/:id', async (req, res, next) => {
  try {
    const [numRows, [project]] = await Project.update(req.body, {
      where: {
        id: +req.params.id
      },
      include: [Column, Task],
      returning: true
    })
    res.status(200).send(project)
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
