const mongoose = require("mongoose");
const entrySchema = new mongoose.Schema({
    userId: {
        type: String
    },
    name: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    course: {
        type: String
    },
    module: {
        type: String
    },
    role: {
        type: String
    },
    initial: {
        type: Boolean
    },
    session: {
        type: String
    },
    completed: {
        type: Boolean
    },
    answers: {},
});

const Entry = mongoose.model("Entry", entrySchema);
module.exports = Entry;
