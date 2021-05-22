const router = require('express').Router()
const {Organization, User, UserOrganization, Project} = require('../db/models')
module.exports = router

// GET all organizations
router.get('/', async (req, res, next) => {
  try {
    const organizations = await Organization.findAll()
    res.send(organizations)
  } catch (err) {
    next(err)
  }
})

// GET a single organization with associated projects, users, userOrgs
router.get('/:id', async (req, res, next) => {
  try {
    const foundOrganization = await Organization.findByPk(+req.params.id, {
      include: [Project, User, UserOrganization]
    })
    res.send(foundOrganization)
  } catch (err) {
    next(err)
  }
})

// CREATE a new organization
router.post('/', async (req, res, next) => {
  try {
    const [organization, wasCreated] = await Organization.findOrCreate({
      where: {
        name: req.body.name
      },
      defaults: {
        ...req.body,
        imageUrl: '/assets/org-default.png'
      }
    })
    res.status(201).send(organization)
  } catch (err) {
    next(err)
  }
})

// UPDATE a single organization
router.put('/:id', async (req, res, next) => {
  try {
    const [numRows, [organization]] = await Organization.update(req.body, {
      where: {
        id: +req.params.id
      },
      include: [Project],
      returning: true
    })
    res.status(200).send(organization)
  } catch (err) {
    next(err)
  }
})

// DELETE a single organization
router.delete('/:id', async (req, res, next) => {
  try {
    await Organization.destroy({
      where: {
        id: +req.params.id
      }
    })
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
