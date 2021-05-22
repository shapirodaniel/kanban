const Sequelize = require('sequelize')
const db = require('../db')
const User = require('./user')
const UserOrganization = require('./userOrganization')

const Organization = db.define('organization', {
  name: Sequelize.STRING,
  imageUrl: Sequelize.STRING
})

///////////////////
/* CLASS METHODS */
///////////////////

Organization.inviteUser = async function (orgId, email, role) {
  // find user to invite by email
  const user = await User.findOne({
    where: {
      email
    }
  })
  if (!user) throw new Error('User does not exist!')

  // then grab org and set user
  const organization = await this.findByPk(orgId)
  await organization.addUser(user.id)

  // finally, grab UserOrganization instance
  // and set role
  const userOrg = await UserOrganization.findOne({
    where: {
      userId: user.id,
      organizationId: orgId
    }
  })
  userOrg.role = role
  userOrg.status = 'pending'
  await userOrg.save()
}

module.exports = Organization
