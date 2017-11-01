const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const commentSchema = Schema({
    commentField: String,
    autherName: String,
    autherId: String,
    autherImg: String,
    time: Date,
    content: String
})

const commentModel = mongoose.model('comment', commentSchema);

function commentDAO() {};

commentDAO.prototype.save = function(data) {
    return new commentModel(data).save();
}

commentDAO.prototype.findByField = function(field) {
    return commentModel.find({
        commentField: field
    }).exec();
}

commentDAO.prototype.findAll = function() {
    return commentModel.find({}).sort({'time': 'desc'}).exec();
}

commentDAO.prototype.delById = function(condition) {
    return commentModel.remove(condition).exec();
}


module.exports = new commentDAO();
