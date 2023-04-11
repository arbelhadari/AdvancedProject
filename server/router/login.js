const router = require("express").Router()
const User = require('../schemas/user')
const bcrypt = require('bcrypt')



//register |  api/register/register
router.post('/register', async (req, res) => {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashePass = await bcrypt.hash(req.body.password, salt)
    const user = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashePass,
        lecturersId: req.body.lecturersId,
        img: req.body.img
    })
    try {
        await user.save();
        res.status(200).json(user)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})

//LOGIN
router.post("/login", async (req, res) => {
    console.log(req.body);
    console.log("asdasd111");
    try {
        //check user form the request 
        const user = await User.findOne({ email: req.body.email })
        console.log(req.body.email);
        console.log("asdasd22");
        console.log(user);
        if (!user) res.status(404).json("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        //const validPassword = req.body.password === user.password;
        !validPassword && res.status(400).json("wrong password")

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err)
    }
});



module.exports = router;