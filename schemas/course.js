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
        // user: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: 'user'
        // },
        ProfessorUserName: {
            type: String,
            require: true,
            min: 3,
            max: 20,
        },
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
            default: new Map()
            // validate: [{
            //   validator: function(value) {
            //     // Validate the string key
            //     if (typeof value !== 'string' || !/^\d{9}$/.test(value)) {
            //       return false;
            //     }
        
            //     return true;
            //   },
            //   message: 'Invalid string key',
            // }, {
            //   validator: function(value) {
            //     // Validate the number value
            //     if (typeof value !== 'number' || value < 0 || value > 100) {
            //       return false;
            //     }
        
            //     return true;
            //   },
            //   message: 'Invalid number value',
            // }],
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