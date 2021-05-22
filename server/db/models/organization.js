const Sequelize = require('sequelize')
const db = require('../db')
const User = require('./user')

const Organization = db.define('organization', {
  name: Sequelize.STRING,
  imageUrl: Sequelize.STRING
})

///////////////////
/* CLASS METHODS */
///////////////////

Organization.inviteUser = async function (orgId, email) {
  // find user to invite by email
  const user = await User.findOne({
    where: {
      email
    }
  })
  if (!user) throw new Error('User does not exist!')

  // then grab org and set user
  const organization = await this.findByPk(orgId)
  await organization.setUser(user.id)
}

module.exports = Organization
