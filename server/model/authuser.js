const mongoose = require('./db.js');

const Schema = mongoose.Schema;

const authUserSchema = new Schema({
    login: String,
    name: String,
    avatar_url: String,
});

const authUserModel = mongoose.model('authuser', authUserSchema);

function authUserDAO() {};

authUserDAO.prototype.save = function(data) {
    return new authUserModel(data).save();
};

authUserDAO.prototype.update = function(data) {
    let condition = {
        login: data.login
    };
    return authUserModel.update(condition, data).exec();
};


authUserDAO.prototype.findByLogin = function(condition) {
    return authUserModel.findOne(condition).exec();
};


authUserDAO.prototype.find = function(condition) {
    return authUserModel.find(condition).exec();
};


module.exports = new authUserDAO();