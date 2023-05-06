// TODO:

const Professor = require('../schemas/professor')
const Course = require("../schemas/course");
const Student = require('../schemas/student');
const router = require("express").Router();
const bcrypt = require("bcrypt");
const studentRouter = require('./student');


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

    if (!req.body.Coursesid || !req.body.ProfessorUserName)
        return res.status(403).json("Missing courseid or username."); 

    try {
        Course.find({ Coursesid: req.body.Coursesid }, async (course_err, course) => {
            if (!course_err) {
                Student.find({studentId: req.body.studentId}, async (student_err, student) => {
                    if (student_err) {
                        studentRouter.addStudent(req.body);
                    }
                    else {
                        if (course[0].GradesSheet.has(student[0].StudentId)) {
                            res.status(400).send({ error: "Student ID already exists in this course."})
                        }
                        else
                        {
                            studentRouter.incrementCourseCount(student.StudentId);
                        }
                    }
                    course[0].GradesSheet.set(req.body.StudentId, req.body.Grade)
                    try {
                        await course[0].save();
                        res.status(200).json(course[0]);
                    } catch (err) {
                        console.log(err);
                        res.status(500).json(err);
                    }

                });
            }
            else {
                res.status(500).json(err)
            }
        });
    } catch (err) {
        res.status(501).json(err)
    }
});


router.post("/Course/deleteStudent", async (req, res) => {  
    if (!req.body.Coursesid || !req.body.ProfessorUserName)
    return res.status(403).json("Missing courseid or username."); 

try {
    Course.find({ Coursesid: req.body.Coursesid }, async (course_err, course) => {
        if (!course_err) {
            Student.find({studentId: req.body.studentId}, async (student_err, student) => {
                if (student_err) {
                    return res.status(400).send({ error: "Sdudent ID does not exists in this course."})
                }
                else {
                    if (course[0].GradesSheet.has(student[0].StudentId)) {
                        studentRouter.decrementCourseCount(req.body.StudentId);
                    }
                    else
                    {
                        return res.status(400).send({ error: "Sdudent ID already exists in this course."})
                    }
                }
                course[0].GradesSheet.unset(req.body.StudentId)
                try {
                    await course[0].save();
                    res.status(200).json(course[0]);
                } catch (err) {
                    console.log(err);
                    res.status(500).json(err);
                }

            });
        }
        else {
            res.status(500).json(err)
        }
    });
} catch (err) {
    res.status(501).json(err)
}
});


router.put("/Course/updateStudent", async (req, res) => {
    if (!req.body.Coursesid || !req.body.lecturersId)
        return res.status(403).json("err");
    try {
        Course.find({ Coursesid: req.body.Coursesid }, async (err, course) => {
            if (err) return res.status(500).json(err)
            else {
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
                else{
                    return res.status(403).json("student id doesnt exist in the course");
                }
            }
        })
    } catch (err) {
        res.status(501).json(err)
    }
});

router.post("/deleteStudentAndGrade", async (req, res) => {
    if (!req.body.Coursesid || !req.body.lecturersId)
        return res.status(403).json("err");

    try {
        Course.find({ Coursesid: req.body.Coursesid }, async (err, data) => {
            if (err) res.status(500).json(err)
            else {
                let flag = false
                let lecturersIds_ = data[0].lecturersIds;
                lecturersIds_.forEach(element => {
                    if (req.body.lecturersId == element)
                        flag = true;
                });
                if (flag) {
                    Course.findOneAndUpdate(
                        { Coursesid: req.body.Coursesid }
                        , { $pull: { studentAndGrade: req.body.studentAndGrade } }, (err, data) => {
                            if (err) res.status(500).json(err)
                            else res.status(200).json(data)
                        })
                } else {
                    res.status(500).json(err)
                }
            }
        })
    } catch (err) {
        res.status(501).json(err)
    }
});



router.post("/getCourse", async (req, res) => {
    if ((!req.body.lecturersId || !req.body.Coursesid))
        return res.status(403).json("err");
    try {
        Course.find({ Coursesid: req.body.Coursesid }, async (err, data) => {
            if (err) {
                res.status(500).json(err)
            }
            else {
                res.status(200).json(data)
            }
        })
    } catch (err) {
        res.status(501).json(err)
    }
});

router.post('/allUserCourses', async function (req, res) {
    try {
        Course.find({}, (err, data) => {
            if (err) {
                res.status(500).json(err)
            } else {
                let allData = [];
                data.forEach(element => {
                    if (element.lecturersIds.includes(req.body.lecturersId))
                        allData.push(element);
                });
                res.status(200).json(allData)
            }
        })
    } catch (err) {
        res.status(501).json(err)
    }
});

router.get('/allDataCourses', async function (req, res) {
    try {
        Course.find({}, (err, data) => {
            if (err) {
                res.status(500).json(err)
            } else {
                let allData = [], sum = 0;
                data.forEach(element => {
                    sum++;
                    let info = { name: element.CoursesName, Coursesid: element.Coursesid }
                    allData.push(info);
                });
                let allInfo = { namesAndIds: [...allData], numberOfStudent: sum }
                res.status(200).json(allInfo)
            }
        })
    } catch (err) {
        res.status(501).json(err)
    }
});

// router.get('/allCourses', async function (req, res) {
//     try {
//         Course.find({}, (err, data) => {
//             if (err) {
//                 res.status(500).json(err)
//             } else {
//                 res.status(200).json(data)
//             }
//         })
//     } catch (err) {
//         res.status(501).json(err)
//     }
// });

module.exports = router;





