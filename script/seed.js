'use strict'

const db = require('../server/db')
const {User, Organization, Project} = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({
      firstName: 'albert',
      lastName: 'turtlesworth',
      email: 'albert@albert.com',
      password: '123'
    }),
    User.create({
      firstName: 'felix',
      lastName: 'bunnysworth',
      email: 'felix@felix.com',
      password: '123'
    })
  ])
  console.log(`seeded ${users.length} users`)

  const organizations = await Promise.all([
    Organization.create({
      name: 'myOrg',
      imageUrl: 'https://source.unsplash.com/random/400x400?nature,water'
    }),
    Organization.create({
      name: 'anotherOrg',
      imageUrl: 'https://source.unsplash.com/random/400x400?nature,water'
    })
  ])
  console.log(`seeded ${organizations.length} organizations`)

  const project = await Project.create({
    name: 'myProject',
    about: 'a new project',
    imageUrl: '/default-project.png'
  })

  await project.setOrganization(organizations[0])
  console.log(`seeded and associated 1 project`)

  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
