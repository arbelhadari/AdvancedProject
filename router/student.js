const Student = require('../schemas/student');
// const router = require("express").Router();


async function addStudent(StudentData){
    console.log("5")
    const student = new Student({
        StudentId: StudentData.StudentId,
        StudentDOB: StudentData.StudentDOB,
        Gender: StudentData.Gender
        // CourseCount: 1
    })
    try {
        student.save();
    } catch (err) {
        console.log(err);
    }
}

async function deleteStudent(StudentData){
    try{
        await Student.findOneAndDelete({StudentId: StudentData.StudentId});
    } catch (err){
        console.log(err);
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
    console.log("increment")
    try
    {
        const student = await Student.findOneAndUpdate({StudentId: studentId}, {$inc: {CourseCount: 1}}, {new:true});
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



module.exports = {addStudent, deleteStudent, incrementCourseCount, decrementCourseCount};
