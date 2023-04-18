const mongoose = require("mongoose");

const GradeSheetSchema = new mongoose.Schema({
    CourseId: {
        type: Number,
        require: true,
        unique: true,
        min: 1
    },
    Grades: {
        type: Map,
        of: Number,
        require: false,
        validate: [
            {
                validator: function(v) {
                for (const [student_id, grade] of v.entries()) {
                    if (typeof student_id !== 'number' || student_id < 100000000 || student_id > 999999999) {
                    return false;
                    }
                    if (typeof grade !== 'number' || grade < 0 || grade > 100) {
                    return false;
                    }
                }
                return true;
                },
                message: 'Invalid key-value pair for myMap. The key must be a number between 0 and 100, and the value must be a number between 0 and 100.'
            }
            ]
    }

},
    { timestamps: true }
);

module.exports = mongoose.model("GradeSheet", GradeSheetSchema);