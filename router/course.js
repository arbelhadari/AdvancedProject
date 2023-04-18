const Course = require("../schemas/course");
const Student = require('../schemas/student');
const router = require("express").Router();
const bcrypt = require("bcrypt");


router.post('/MyCourses/creatCourse', async (req, res) => {

    const course = await new Course({
        CoursesName: req.body.CoursesName,
        Coursesid: req.body.Coursesid,
        ProfessorUserName: req.body.ProfessorUserName,
        Year: req.body.Year,
        Semester: req.body.Semester,
        courseDetails: req.body.courseDetails
    })
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
        Course.findOneAndDelete({ Coursesid: req.body.Coursesid }, async (err, data) => {
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
});

router.post("/Course/addStudent", async (req, res) => {

    if (!req.body.Coursesid || !req.body.ProfessorUserName)
        return res.status(403).json("Missing courseid or username."); 

    try {
        Course.find({ Coursesid: req.body.Coursesid }, async (course_err, course) => {
            if (!course_err) {
                Student.find({studentId: req.body.studentId}), async (student_err, student) => {
                    if (student_err) {
                        const new_student = new Student({
                            StudentId: req.body.StudentId,
                            StudentDOB: req.body.StudentDOB,
                            Gender: req.body.Gender
                        })
                        try {
                            await new_student.save();
                            res.status(200).json(new_student)
                        } catch (err) {
                            console.log(err);
                            res.status(500).json(err)
                        }
                        course[0].GradesSheet.set(req.body.StudentId, req.body.Grade)
                        try {
                            await course[0].save();
                            res.status(200).json(course[0]);
                        } catch (err) {
                            console.log(err);
                            res.status(500).json(err);
                        }
                    }
                    else {
                        if (course[0].GradesSheet.has(student[0].StudentId)) {
                            res.status(400).send({ error: "Sdudent ID already exists in this course."})
                        }
                        else {
                            course[0].GradesSheet.set(req.body.StudentId, req.body.Grade)
                            try {
                                await course[0].save();
                                res.status(200).json(course[0]);
                            } catch (err) {
                                console.log(err);
                                res.status(500).json(err);
                            }
                        }
                    }
                }
            }
            else {
                res.status(500).json(err)
            }
        })
    } catch (err) {
        res.status(501).json(err)
    }
});

router.put("/Course/updateStudent", async (req, res) => {
    if (!req.body.Coursesid || !req.body.lecturersId)
        return res.status(403).json("err");
    try {
        Course.find({ Coursesid: req.body.Coursesid }, async (err, data) => {
            console.log("1");
            if (err) res.status(500).json(err)
            else {
                console.log("2");
                let flag = false
                let lecturersIds_ = data[0].lecturersIds;
                lecturersIds_.forEach(element => {
                    if (req.body.lecturersId == element)
                        flag = true;
                });
                if (flag) {
                    console.log("3");
                    Course.findOneAndUpdate(
                        { Coursesid: req.body.Coursesid },
                        { $set: { "studentAndGrade.$[el].id_stu": req.body.studentId } },
                        {
                            arrayFilters: [{ "el.grade": req.body.gradeStudent }],
                            new: true
                        }
                        ,
                        (err, data) => {
                            console.log(data);
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





