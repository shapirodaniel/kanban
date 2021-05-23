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
  columnOrder: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    defaultValue: []
  }
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

Project.getSingleProjectAndAssociations = async function (projectId) {
  const foundProject = await this.findByPk(projectId, {
    include: [
      {
        model: Column,
        include: {
          model: Task,
          attributes: ['id', 'name', 'openedBy'],
          include: {model: User, attributes: ['id', 'imageUrl']}
        }
      }
    ]
  })

  const tasksWithoutColumns = await foundProject.getTasks({
    where: {columnId: null},
    include: {model: User, attributes: ['id', 'imageUrl']}
  })

  return {
    ...foundProject.dataValues,
    tasksWithoutColumns: tasksWithoutColumns
  }
}

module.exports = Project
