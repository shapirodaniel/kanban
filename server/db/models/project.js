const Sequelize = require('sequelize')
const db = require('../db')
const Column = require('./column')
const Task = require('./task')

const Project = db.define('project', {
  name: Sequelize.STRING,
  about: Sequelize.TEXT,
  imageUrl: Sequelize.STRING,
  // columnOrder is an array of column ids
  columnOrder: Sequelize.ARRAY(Sequelize.INTEGER)
})

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

  const createdDefaultColumns = await Column.bulkCreate(defaultColumns, {
    returning: true
  })

  const createdDefaultTask = await Task.create(defaultTask, {returning: true})

  await createdDefaultColumns[0].setTasks([createdDefaultTask.id])

  createdDefaultColumns[0].taskOrder = [createdDefaultTask.id]

  await createdDefaultColumns[0].save()

  const columnOrder = createdDefaultColumns.map(column => column.id)

  await project.setColumns(columnOrder)

  await project.setTasks([createdDefaultTask.id])

  project.columnOrder = columnOrder

  await project.save()

  return project
})

module.exports = Project
