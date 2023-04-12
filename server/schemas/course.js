const mongoose = require("mongoose");

const CoursSchema = new mongoose.Schema(
    {
        CoursesName: {
            type: String,
            require: true,
            min: 3,
            max: 25,
            unique: true,
        },
        Coursesid: {
            type: Number,
            require: true,
            min: 1,
            max: 20,
            unique: true,
        },
        lecturersIds: [{
            type: String,
            require: true,
            min: 3,
            max: 20,
        }],
        studentAndGrade: [{
            nameStudent: {
                type: String,
                require: true,
                min: 1,
                max: 10,
            },
            id_stu: {
                type: String,
                require: true,
                min: 2,
                max: 10,
            },
            grade: {
                type: String,
                require: true,
                min: 1,
                max: 5,
            }
        }],
        courseDetails: {
            type: String,
            min: 0,
            max: 1000,
        }
    },

    { timestamps: true }
);

module.exports = mongoose.model("Course", CoursSchema);