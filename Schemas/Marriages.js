const { model, Schema } = require("mongoose");

module.exports = model("Marriages", new Schema({
    Guild: String,
    User: String,
    Couple: String,
    DateCreate: Date
}))