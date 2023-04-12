const mongoose = require("mongoose");

const ProfessorSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            min: 3,
            max: 20,
            unique: true
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
            min: 5,
        },
        courseIdList: {
            type: [{type: Number}],
            validate: {
                validator: function(arr) {
                  return arr.length >= 0 && arr.every(num => num >= 1);
                },
                message: 'Each course ID must be greater than or equal to 1.'
            }
        }
        // img: {
        //     type: String,
        //     require: true,
        //     min: 3,
        //     max: 20,
        // },
    },
    { timestamps: true }
);
module.exports = mongoose.model("User", ProfessorSchema);