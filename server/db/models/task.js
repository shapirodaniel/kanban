const Sequelize = require('sequelize')
const db = require('../db')
const Column = require('./column')

const Task = db.define('task', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  assets: Sequelize.ARRAY(Sequelize.TEXT),
  openedBy: Sequelize.STRING,
  lastEdit: Sequelize.DATE
})

Task.createAndAssociate = async function (
  newTask,
  projectId,
  columnId,
  assignees
) {
  // create task and associate to project, column, and associate users through supplied userIds as assignees
  const task = await this.create(newTask)
  await task.setProject(projectId)
  await task.setColumn(columnId)
  await task.setUsers(assignees)

  // fetch column and add task to taskOrder array
  const foundColumn = await Column.findByPk(+columnId)
  foundColumn.taskOrder = [...foundColumn.taskOrder, task.id]
  await foundColumn.save()

  return task
}

module.exports = Task
