const cors = require("cors");

const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./router/user");
const loginRoute = require("./router/login");
const coursesRoute = require("./router/cours");

const port = "5555";
dotenv.config();

mongoose.connect(
    process.env.MONGO,
    { useNewUrlParser: true, useUnifiedTopology: true },
);

const app = express()
app.use(morgan("common"));
app.use(express.json());
app.use(cors());


//app.use("/users", userRoute); טיפול בבעית רוטר
app.use("/login", loginRoute);
app.use("/course", coursesRoute);

app.get('/', (req, res) => {
    console.log("welcome!");
    res.send("welcome")
})

app.listen(port, () => {
    console.log("listen to : " + port);
})
