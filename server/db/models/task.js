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

// board view only
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

// single task view only
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

// helper for reorder method below
// we could put this method on the Column prototype, but it's clearer to state the method standalone here, rather than hide this logic in the Column model
const handleReorder = async (taskOrderArray, columnInstance) => {
  if (!taskOrderArray.length) {
    await columnInstance.removeTasks()
  } else {
    columnInstance.taskOrder = taskOrderArray
    await columnInstance.save()
  }
}

// board view only
Task.reorder = async function (
  taskId,
  sourceColId,
  sourceTaskOrder,
  destColId,
  destTaskOrder
) {
  // grab task and columns
  const task = await Task.findByPk(taskId)
  const sourceCol = await Column.findByPk(sourceColId)

  if (!(task || sourceCol)) {
    throw new Error('Task or source column instance not found!')
  }

  // if no destination column id provided, task has been moved within a single column and we'll only need to persist the new taskOrder of the source column
  if (!destColId) {
    // we still need to set the column for the task, since it's possible that the task's columnId was NULL!
    task.setColumn(sourceCol.id)
    return handleReorder(sourceTaskOrder, sourceCol)
  }

  // else, task has been moved between columns and we'll need to reassign source and destination column tasks and taskOrders
  const destCol = await Column.findByPk(destColId)

  if (!destCol) {
    throw new Error('Destination column instance not found!')
  }

  task.setColumn(destCol.id)
  handleReorder(sourceTaskOrder, sourceCol)
  handleReorder(destTaskOrder, destCol)
}

Task.deleteAndReorderSourceCol = async function (
  taskId,
  sourceColId,
  sourceTaskOrder
) {
  const task = await Task.findByPk(taskId)
  const sourceCol = await Column.findByPk(sourceColId)

  if (!(task || sourceCol)) {
    throw new Error('Task or source column instance not found!')
  }

  await task.destroy()
  sourceCol.taskOrder = sourceTaskOrder
  await sourceCol.save()
}

module.exports = Task
