const Sequelize = require('sequelize')
const db = require('../db')

const Project = db.define('project', {
  name: Sequelize.STRING,
  about: Sequelize.TEXT,
  columns: Sequelize.TEXT,
  taskIds: Sequelize.TEXT,
})

module.exports = Project
