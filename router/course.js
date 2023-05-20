// TODO:

const Professor = require('../schemas/professor')
const Course = require("../schemas/course");
const Student = require('../schemas/student');
const router = require("express").Router();
const bcrypt = require("bcrypt");
const {addStudent, deleteStudent, incrementCourseCount, decrementCourseCount} = require('./student');


router.post('/MyCourses/createCourse', async (req, res) => {

    const course = await new Course({
        CoursesName: req.body.CoursesName,
        Coursesid: req.body.Coursesid,
        Year: req.body.Year,
        Semester: req.body.Semester,
        courseDetails: req.body.courseDetails,
        ProfessorUserName: req.body.ProfessorUserName
    })

    let prof = await Professor.findOne({username: req.body.ProfessorUserName})
    prof.courseIdList.push(req.body.Coursesid)
    await prof.save()
    // Professor.findOne( {username: req.body.ProfessorUserName} ), async (prof_err, prof) => {
    //     prof.courseIdList.push(req.body.Coursesid);
    //     await prof.save();
    // }
    try {
        await course.save();
        
        res.status(200).json(course)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.delete("/MyCourses/deleteCourse", async (req, res) => {
    try {
        const data = await Course.findOneAndDelete({ Coursesid: req.body.Coursesid });
        let prof = await Professor.findOne({username: req.body.ProfessorUserName})
        await prof.updateOne(
            { $pull: { courseIdList: req.body.Coursesid } } 
        )
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post("/Course/addStudent", async (req, res) => {
    if (!req.body.Coursesid)
        return res.status(403).json("Missing courseid."); 

    try {
        let course = await Course.find({ Coursesid: req.body.Coursesid });
        if (course) {
            let student = await Student.find({StudentId: req.body.StudentId});
            if (student.length === 0) {
                console.log("4")
                await addStudent(req.body);
            }
            else {
                if (course[0].GradesSheet.has(req.body.StudentId)) {
                    console.log("8")
                    return res.status(400).send({ error: "Student ID already exists in this course."})
                }
                else
                {
                    console.log("9")
                    incrementCourseCount(student[0].StudentId);
                }
            }
            console.log("6");
            await course[0].GradesSheet.set(req.body.StudentId, req.body.Grade);
            console.log("7");
            try {
                await course[0].save();
                res.status(200).json(course[0]);
            } catch (err) {
                console.log(err);
                res.status(500).json(err);
            }
        } else {
                res.status(500).json(err)
            }
    } catch (err) {
        res.status(501).json(err)
    }
});       

router.put("/Course/deleteStudent", async (req, res) => {  
    if (!req.body.Coursesid)
    return res.status(403).json("Missing courseid."); 

try {
    let course = await Course.find({ Coursesid: req.body.Coursesid });
    if (course) {
        let student = await Student.find({StudentId: req.body.StudentId});
        if (!student) {
            console.log("1")
            return res.status(400).send({ error: "Student ID doesn't exists in this course."});
        } else {
            if (course[0].GradesSheet.has(req.body.StudentId)) 
                decrementCourseCount(req.body.StudentId);
            else
                return res.status(400).send({ error: "Student ID doesn't exists in this course."});
        }
        course[0].GradesSheet.delete(req.body.StudentId); 
        console.log(course[0].GradesSheet);
        try {
            await course[0].save();
            res.status(200).json(course[0]);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
        // await course[0].GradesSheet.unset(req.body.StudentId); 
    } else {
        res.status(500).json(err);
    }
} catch (err) {
    console.log(err)
    res.status(501).json(err)
}
});

router.put("/Course/updateStudent", async (req, res) => {
    if (!req.body.Coursesid)
        return res.status(403).json("err");
    try {
        let course = await Course.find({Coursesid: req.body.Coursesid});
        if (course){
            if (course[0].GradesSheet.has(req.body.StudentId)){
                course[0].GradesSheet.set(req.body.StudentId, req.body.newGrade);
                try {
                    await course[0].save();
                    res.status(200).json(course[0]);
                } catch (err) {
                    console.log(err);
                    res.status(500).json(err);
                }
            }
        } else {
            return res.status(500).json(err);
        }
    }
    catch (err) {
        res.status(501).json(err);
    }
});

router.get("/MyCourses/getAllCourses", async (req, res) => {
    try {
        const courses = await Course.find().sort({Year: -1});
        res.json(courses)
    }
    catch(err){
        console.error(err.message);
        res.status(500).send(SERVER_ERROR)
    }
});

router.get("/Course/getCourse", async (req, res) => {
    try{
        const course = await Course.find({Coursesid: req.body.Coursesid});
        res.json(course)
    }
    catch(err){
        console.error(err.message);
        res.status(500).send(SERVER_ERROR)
    }
    
});

module.exports = router;





