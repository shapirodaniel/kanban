/* eslint-disable camelcase */
const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')
const UserOrganization = require('./userOrganization')

const User = db.define('user', {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  fullName: {
    type: Sequelize.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`
    },
    set(value) {
      throw new Error('Do not try to set the `fullName` value!')
    }
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: '/assets/user-default.png'
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  }
})

module.exports = User

///////////
/* HOOKS */
///////////

const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.beforeBulkCreate(users => {
  users.forEach(setSaltAndPassword)
})

///////////////////
/* CLASS METHODS */
///////////////////

User.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

User.handleInvitation = async function (userId, organizationId, didAccept) {
  // first grab userOrg
  const user_organization = await UserOrganization.findOne({
    where: {
      userId,
      organizationId
    }
  })
  if (!user_organization) throw new Error('UserOrganization not found!')

  // if user rejected invitation, destroy the userOrg instance
  if (!didAccept) {
    await user_organization.destroy()
    return
  }

  // otherwise, update the userOrg status from 'pending' to 'active'
  user_organization.status = 'active'
  await user_organization.save()
}

//////////////////////
/* INSTANCE METHODS */
//////////////////////

User.prototype.correctPassword = function (candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}
