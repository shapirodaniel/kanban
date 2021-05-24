const Sequelize = require('sequelize')
const db = require('../db')

const Column = db.define('column', {
  draggableId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  droppableId: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  name: Sequelize.STRING,
  // taskOrder is an array of taskIds
  taskOrder: {
    type: Sequelize.ARRAY(Sequelize.UUID),
    defaultValue: []
  }
})

module.exports = Column
