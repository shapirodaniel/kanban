const router = require('express').Router()
const {Organization, UserOrganization} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const organizations = await Organization.findAll()
    res.send(organizations)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const foundOrganization = await Organization.findByPk(+req.params.id, {
      include: [Project],
    })
    res.send(foundOrganization)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const [organization, wasCreated] = await Organization.findOrCreate({
      where: {
        name: req.body.name,
      },
      defaults: req.body,
    })
    res.status(201).send(organization)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const [numRows, [organization]] = await Organization.update(req.body, {
      where: {
        id: +req.params.id,
      },
      include: [Project],
      returning: true,
    })
    res.status(200).send(organization)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Organization.destroy({
      where: {
        id: +req.params.id,
      },
    })
    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})
