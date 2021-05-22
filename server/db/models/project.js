const Sequelize = require('sequelize')
const db = require('../db')
const Column = require('./column')
const Task = require('./task')
const User = require('./user')

const Project = db.define('project', {
  name: Sequelize.STRING,
  about: Sequelize.TEXT,
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: '/assets/project-default.png'
  },
  // columnOrder is an array of column ids
  columnOrder: Sequelize.ARRAY(Sequelize.INTEGER)
})

///////////
/* HOOKS */
///////////

// give each new project default columns and a default task
Project.afterCreate(async project => {
  const defaultColumns = [
    {name: 'To-do'},
    {name: 'In-progress'},
    {name: 'Review'},
    {name: 'Done'}
  ]

  const defaultTask = {
    name: 'Sample Task',
    description: 'A sample task',
    assets: ['/assets/sample-task-asset.png'],
    openedBy: 'task daemon',
    lastEdit: Date.now()
  }

  // create default columns and default task
  const createdDefaultColumns = await Column.bulkCreate(defaultColumns, {
    returning: true
  })
  const createdDefaultTask = await Task.create(defaultTask, {returning: true})

  // add default task to first default column
  await createdDefaultColumns[0].setTasks([createdDefaultTask.id])

  // update first default column taskOrder
  createdDefaultColumns[0].taskOrder = [createdDefaultTask.id]
  await createdDefaultColumns[0].save()

  // set project's columnOrder field and associate default columns, task
  const columnOrder = createdDefaultColumns.map(column => column.id)
  await project.setColumns(columnOrder)
  await project.setTasks([createdDefaultTask.id])
  project.columnOrder = columnOrder
  await project.save()

  return project
})

// cascade hard delete to columns, tasks
// * note * this requires {onDelete: 'CASCADE', hooks: true} on the Model.hasMany association
Project.beforeDestroy(async project => {
  const columns = await project.getColumns()
  const tasks = await project.getTasks()

  columns.forEach(async col => {
    await col.destroy()
  })

  tasks.forEach(async task => {
    await task.destroy()
  })
})

///////////////////
/* CLASS METHODS */
///////////////////

Project.updateAndAssociate = async function (projectId, updateInfo) {
  const [numRows, [project]] = await this.update(updateInfo, {
    where: {
      id: projectId
    },
    include: [Column, Task, User],
    returning: true
  })

  // we can add/remove columns with columnOrder by waiting to set columns AFTER updating the instance, guaranteeing that we don't inadvertantly remove columns and tasks from our project
  await project.setColumns(project.columnOrder)

  // after removing columns, we'll check the project tasks
  // if any task's columnId is NOT in the new project.columns, we'll remove the task's column association
  // this will allow us to persist versions of the project history containing former columns and tasks
  const projectTasks = await project.getTasks()
  projectTasks.forEach(async task => {
    if (!project.columnOrder.includes(task.columnId)) {
      await task.setColumn(null)
    }
  })

  // finally, we'll delete all columns that don't have a projectId
  // as those are the columns we've removed with setColumns()
  const unassociatedColumns = await Column.findAll({
    where: {
      projectId: null
    }
  })

  unassociatedColumns.forEach(async column => {
    await column.destroy()
  })

  return project
}

module.exports = Project
