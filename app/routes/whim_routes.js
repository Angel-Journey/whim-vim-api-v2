const express = require('express')
const passport = require('passport')
const Whim = require('../models/whim')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// CREATE
// POST /whims
router.post('/whims', requireToken, (req, res, next) => {
  req.body.whim.owner = req.user.id
  req.body.whim.ownerEmail = req.user.email
  Whim.create(req.body.whim)
    .then(whim => {
      res.status(201).json({ whim: whim.toObject() })
    })
    .catch(next)
})

// INDEX (user only)
// GET /whims
router.get('/whims', requireToken, (req, res, next) => {
  const id = req.user.id
  Whim.find({ owner: id })
    .then(whims => {
      return whims.map(whim => whim.toObject())
    })
    .then(whims => res.status(200).json({ whims: whims }))
    .catch(next)
})

// INDEX (all)
// GET /whims
router.get('/whims', requireToken, (req, res, next) => {
  Whim.find()
    .then(whims => {
      return whims.map(whim => whim.toObject())
    })
    .then(whims => res.status(200).json({ whims: whims }))
    .catch(next)
})

// UPDATE
// PATCH /whims/6099578461dd6be72ba96d87
router.patch('/whims/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.whim.owner

  Whim.findById(req.params.id)
    .then(handle404)
    .then(whim => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, whim)

      // pass the result of Mongoose's `.update` to the next `.then`
      return whim.updateOne(req.body.whim)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

router.delete('/whims/:id', requireToken, (req, res, next) => {
  Whim.findById(req.params.id)
    .then(handle404)
    .then(whim => {
      requireOwnership(req, whim)
      whim.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
