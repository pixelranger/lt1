const mongoose = require("mongoose");
const SessionSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    appId: {
        type: String
    },
    assignmentId: {
        type: String
    },
    role: {
        type: String
    },
    session: {
        type: String
    },
    host: {
        type: String
    },
    courseId: {
        type: String
    },
    answers: [],
    journalDownloadedAt: [],
});
const Session = mongoose.model("Session", SessionSchema);
module.exports = Session;
