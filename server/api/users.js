const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

// GET all users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

// CREATE a new user
router.post('/', async (req, res, next) => {
  try {
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        email: req.body.email
      },
      defaults: {...req.body}
    })
    res.status(wasCreated ? 204 : 200).send(user)
  } catch (err) {
    next(err)
  }
})

// UPDATE handle user invitation acceptance / rejection
// didAccept: Boolean
router.put('/:id/invitations', async (req, res, next) => {
  try {
    const {organizationId, didAccept} = req.body
    await User.handleInvitation(+req.params.id, organizationId, didAccept)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
})
