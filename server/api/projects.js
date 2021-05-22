const router = require('express').Router()
const {Project, Column, Task} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.findAll()
    res.send(projects)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const foundProject = await Project.findByPk(+req.params.id, {
      include: [Column, Task]
    })
    res.send(foundProject)
  } catch (err) {
    next(err)
  }
})

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

    // add default columns and a sample task to the new project

    res.status(201).send(project)
  } catch (err) {
    next(err)
  }
})

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
