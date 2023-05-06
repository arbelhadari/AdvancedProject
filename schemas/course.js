// TODO:
// check course id (mongo auto generated?)

const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
    {
        CoursesName: {
            type: String,
            require: true,
            min: 3,
            max: 50,
            unique: true,
        },
        Coursesid: {
            type: Number,
            require: true,
            min: 1,
            unique: true,
        },
        ProfessorUserName: [{
            type: String,
            require: true,
            min: 3,
            max: 20,
        }],
        Semester: {
            type: String,
            require: true,
            enum: ['a', 'b']
        },
        Year: {
            type: Number,
            require: true,
            validate: {
                validator: function(year) {
                    return /^[1-9][0-9]{3}$/.test(String(year));
                  },
                  message: props => `${props.value} is not a valid year. The year format should be YYYY.`
            }
        },
        GradesSheet: {
            type: Map,
            of: Number,
            require: false,
            validate: [
                {
                  validator: function(v) {
                    for (const [student_id, grade] of v.entries()) {
                      if (typeof student_id !== Number || student_id < 100000000 || student_id > 999999999) {
                        return false;
                      }
                      if (!grade) return true;
                      if (typeof grade !== Number && grade < 0 || grade > 100) {
                        return false;
                      }
                    }
                    return true;
                  },
                  message: 'Invalid key-value pair for myMap. The key must be a number between 0 and 100, and the value must be a number between 0 and 100.'
                }
              ]
        },
        // studentAndGrade: [{
        //     nameStudent: {
        //         type: String,
        //         require: true,
        //         min: 1,
        //         max: 10,
        //     },
        //     id_stu: {
        //         type: String,
        //         require: true,
        //         min: 2,
        //         max: 10,
        //     },
        //     grade: {
        //         type: String,
        //         require: true,
        //         min: 1,
        //         max: 5,
        //     }
        // }],
        courseDetails: {
            type: String,
            min: 0,
            max: 1000,
        }
    },

    { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);