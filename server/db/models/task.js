const Sequelize = require('sequelize')
const db = require('../db')

const Task = db.define('task', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  assets: Sequelize.ARRAY(Sequelize.TEXT),
  openedBy: Sequelize.STRING,
  lastEdit: Sequelize.DATE,
})

module.exports = Task
