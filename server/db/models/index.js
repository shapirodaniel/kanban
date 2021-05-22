const Sequelize = require('sequelize')
const db = require('../db')

const User = require('./user')
const Organization = require('./organization')
const Project = require('./project')
const Column = require('./column')
const Task = require('./task')

const UserOrganization = db.define('user_organization', {
  role: Sequelize.ENUM('member', 'owner'),
  // status will be used to determine whether a user_organization is an INVITE (with status: pending)
  status: Sequelize.ENUM('pending', 'active')
})

const UserTask = db.define('user_task')
const UserProject = db.define('user_project')

// associations

// important! https://sequelize.org/master/manual/hooks.html
// in order to fire beforeDestroy hook we need onDelete, hooks options
Project.hasMany(Column, {onDelete: 'CASCADE', hooks: true})
Column.belongsTo(Project)

Project.hasMany(Task, {onDelete: 'CASCADE', hooks: true})
Task.belongsTo(Project)

Column.hasMany(Task)
Task.belongsTo(Column)

Organization.hasMany(Project)
Project.belongsTo(Organization)

Organization.belongsToMany(User, {through: UserOrganization})
User.belongsToMany(Organization, {through: UserOrganization})

Project.belongsToMany(User, {through: UserProject})
User.belongsToMany(Project, {through: UserProject})

Task.belongsToMany(User, {through: UserTask})
User.belongsToMany(Task, {through: UserTask})

module.exports = {
  User,
  Organization,
  Project,
  Column,
  Task,
  UserOrganization,
  UserProject,
  UserTask
}
