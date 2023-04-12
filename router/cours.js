const Course = require("../schemas/cours");
const router = require("express").Router();
const bcrypt = require("bcrypt");


router.post('/creatCourse', async (req, res) => {

    const cours = await new Course({
        CoursesName: req.body.CoursesName,
        Coursesid: req.body.Coursesid,
        lecturersIds: req.body.lecturersIds,
        studentAndGrade: req.body.studentAndGrade,
        courseDetails: req.body.courseDetails
    })
    try {
        await cours.save();
        res.status(200).json(cours)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

router.delete("/deleteCourse", async (req, res) => {
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

router.put("/updateGradeStudent", async (req, res) => {
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
/*
 {
                            //'studentAndGrade.$.id_stu': req.body.studentId,
                            //'studentAndGrade.$.grade': req.body.gradeStudent,
                            id_stu: req.body.studentId,
                            grade: req.body.gradeStudent,
                        },
*/
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
//יצירת עדכון ציון סטודנט 
router.post("/addStudentAndGrade", async (req, res) => {

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
                        , { $push: { studentAndGrade: req.body.studentAndGrade } }, (err, data) => {
                            if (err) res.status(500).json(err)
                            else res.status(200).json(data)
                        })
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

router.get('/allCourses', async function (req, res) {
    try {
        Course.find({}, (err, data) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.status(200).json(data)
            }
        })
    } catch (err) {
        res.status(501).json(err)
    }
});

module.exports = router;





