const mongoose = require("mongoose");
const SettingsSchema = new mongoose.Schema({
    appId: {
        type: String
    },
    settings: {},
});
const Settings = mongoose.model("Settings", SettingsSchema);
module.exports = Settings;
