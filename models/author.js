const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorModel = new Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    }
});

module.exports = mongoose.model('Author', AuthorModel);