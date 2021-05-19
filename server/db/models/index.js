const Sequelize = require('sequelize')
const db = require('../db')

const User = require('./user')
const Organization = require('./organization')
const Project = require('./project')
const Task = require('./task')

const UserOrganization = db.define('user_organization', {
  role: Sequelize.ENUM('member', 'owner'),

  // status will be used to determine whether a user_organization
  // is an INVITE (with status: pending)
  status: Sequelize.ENUM('pending', 'active')
})

// associations
Project.hasMany(Task)
Task.belongsTo(Project)

Organization.hasMany(Project)
Project.belongsTo(Organization)

Organization.belongsToMany(User, {through: UserOrganization})
User.belongsToMany(Organization, {through: UserOrganization})

Task.belongsToMany(User, {through: 'UserTask'})
User.belongsToMany(Task, {through: 'UserTask'})

module.exports = {
  User,
  Organization,
  Project,
  Task,
  UserOrganization
}
