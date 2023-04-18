const router = require("express").Router()
const User = require('../schemas/professor')
const bcrypt = require('bcrypt')


//register |  api/register/register
router.post('/register', async (req, res) => {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashePass = await bcrypt.hash(req.body.password, salt)
    const user = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashePass
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
router.post("/", async (req, res) => {
    // console.log(req.body);
    try {
        //check user form the request 
        const user = await User.findOne({ username: req.body.username })
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