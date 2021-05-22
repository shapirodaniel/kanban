const Sequelize = require('sequelize')
const db = require('../db')

const UserOrganization = db.define('user_organization', {
  role: Sequelize.ENUM('member', 'owner'),
  // status will be used to determine whether a user_organization is an INVITE (with status: pending)
  status: Sequelize.ENUM('pending', 'active')
})

module.exports = UserOrganization
