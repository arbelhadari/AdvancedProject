const student = require('../schemas/student');
const Student = require('../schemas/student');
const router = require("express").Router();


function addStudent(StudentData){
    const student = new Student({
        StudentId: StudentData.StudentId,
        StudentDOB: StudentData.StudentDOB,
        Gender: StudentData.Gender,
        CourseCount: 1
    })
    try {
        student.save();
        res.status(200).json(student)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}
function deleteStudent(StudentData){
    try {
        Student.findOneAndDelete({ StudentId: StudentData.StudentId }, async (err, data) => {
            if (err) {
                res.status(500).json(err)
                console.log(err);
            } else {
                res.status(200).json(data)
            }
        })
    } catch (err) {
        res.status(500).json(err);
    }
}

async function getStudent(studentId)
{
    try
    {
        const student = await Student.findOne({StudentId: studentId});
        return student
    }
    catch (err)
    {
        return -1;

    }
}

async function incrementCourseCount(studentId)
{
    try
    {
        const student = await Student.findOneAndUpdate({StudentId: studentId},{$inc: {CourseCount:1}}, {new:true} );
        return student
    }
    catch (err)
    {
        return -1;

    }
}

async function decrementCourseCount(studentId)
{
    try
    {
        const student = await Student.findOneAndUpdate({StudentId: studentId},{$inc: {CourseCount:-1}}, {new:true} );
        if (student.CourseCount == 0)
            deleteStudent(student);
        return student
    }
    catch (err)
    {
        return -1;

    }
}



module.exports = router;
