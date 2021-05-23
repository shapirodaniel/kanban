const Sequelize = require('sequelize')
const db = require('../db')

const Column = db.define('column', {
  name: Sequelize.STRING,
  // taskOrder is an array of taskIds
  taskOrder: Sequelize.ARRAY(Sequelize.INTEGER)
})

///////////////////
/* CLASS METHODS */
///////////////////

module.exports = Column
