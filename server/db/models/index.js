const db = require('../db')
const User = require('./user')
const Organization = require('./organization')
const Project = require('./project')
const Column = require('./column')
const Task = require('./task')

////////////////////
/* THROUGH TABLES */
////////////////////

const UserOrganization = require('./userOrganization')
const UserTask = db.define('user_task')

//////////////////
/* ASSOCIATIONS */
//////////////////

// project
// important! https://sequelize.org/master/manual/hooks.html
// in order to fire beforeDestroy hook we need onDelete, hooks options
Project.hasMany(Column, {onDelete: 'CASCADE', hooks: true})
Column.belongsTo(Project)

Project.hasMany(Task, {onDelete: 'CASCADE', hooks: true})
Task.belongsTo(Project)

// no cascade delete here
// allows us to retain tasks when columns are deleted
Column.hasMany(Task)
Task.belongsTo(Column)

// organization
Organization.hasMany(Project)
Project.belongsTo(Organization)

Organization.belongsToMany(User, {through: UserOrganization})
User.belongsToMany(Organization, {through: UserOrganization})

// task
Task.belongsToMany(User, {through: UserTask})
User.belongsToMany(Task, {through: UserTask})

module.exports = {
  User,
  Organization,
  Project,
  Column,
  Task,
  UserOrganization,
  UserTask
}
