const Sequelize = require('sequelize')
const db = require('../db')
const Column = require('./column')
const User = require('./user')

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
  if (assignees) await task.setUsers(assignees)

  // fetch column and add task to taskOrder array
  const foundColumn = await Column.findByPk(+columnId)
  foundColumn.taskOrder = [...foundColumn.taskOrder, task.id]
  await foundColumn.save()

  return task
}

Task.updateAndAssociate = async function (taskId, updateInfo, assignees) {
  // update task instance
  const [numRows, [task]] = await this.update(updateInfo, {
    where: {
      id: taskId
    },
    include: [User],
    returning: true
  })

  // if assignees, reassign tasks's users
  // allows for adding and/or deleting users
  // just pass the assignees array [...userIds]
  if (assignees) await task.setUsers(assignees)
  return task
}

module.exports = Task
