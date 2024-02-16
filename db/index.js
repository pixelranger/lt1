const mongoose = require("mongoose");
const connection = require('../config').dbConnection;
const connectDb = () => {
    console.log('DB connected');
    return mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true });
};
mongoose.set('useFindAndModify', false);
module.exports = connectDb;
