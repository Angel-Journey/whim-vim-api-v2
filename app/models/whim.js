const mongoose = require('mongoose')

const whimSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Whim', whimSchema)
