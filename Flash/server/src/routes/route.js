const { Router } = require("express");
const router = Router()
const pool = require("../models/connection")
const bcrypt = require("bcrypt")

router.post("/signup", async (req, res) => {
    const { fullName, mobile, email, dob, password } = req.body;

    const query = `INSERT INTO user_info(full_name,mobile_number,email,date_of_birth,password) VALUES ($1,$2,$3,$4,$5);`;
    const values = [fullName, mobile, email, dob, password];


    try {
        await pool.query(query, values);
        res.status(200).send(req.body);
    } catch (err) {
        res.status(500).send("/serverError");
    }

})



router.get("/", (req, res) => {
    res.send("Hii")
})

module.exports = router;