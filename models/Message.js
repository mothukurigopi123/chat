// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    image: { type: String },        // URL of the image
    description: { type: String },   // Description of the item
    price: { type: Number },         // Price of the item
    rating: { type: Number, min: 1, max: 5 }  // Rating (1 to 5)
});

module.exports = mongoose.model('Message', messageSchema);
