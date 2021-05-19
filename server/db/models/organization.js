const Sequelize = require('sequelize')
const db = require('../db')

const Organization = db.define('organization', {
  name: Sequelize.STRING,
  imageUrl: Sequelize.STRING,
})

module.exports = Organization
