const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 1,
        },
        lecturersId: {
            type: String,
            require: true,
            min: 3,
            max: 20,
        },
        type: {
            type: String,
            require: true,
            min: 3,
            max: 20,
        },
        img: {
            type: String,
            require: true,
            min: 3,
            max: 20,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);